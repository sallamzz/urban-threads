# UrbanThreads × Gameball — Integration Architecture

## Overview

UrbanThreads is a Next.js e-commerce storefront with a fully integrated Gameball loyalty program. Every Gameball API call is proxied through server-side Route Handlers — the browser never touches API secrets. The integration covers four surfaces: customer registration, behavioral event tracking, transactional order processing with point redemption, and a real-time customer profile dashboard.

---

## System Design

### API Proxy Layer

All Gameball communication flows through `app/api/gameball/*` Route Handlers running on the Edge runtime. A shared helper module (`lib/gameball.ts`) abstracts authentication into three primitives:

| Helper | Auth Headers | Use Case |
|---|---|---|
| `gbGet(path)` | `APIKey` | Read-only: balance, tier progress, campaign progress |
| `gbPost(path, body)` | `APIKey` + `SecretKey` | Writes: register, events, orders, holds |
| `gbDel(path)` | `APIKey` + `SecretKey` | Destructive: release held points |

The `SecretKey` is a server-only environment variable. Only `NEXT_PUBLIC_GAMEBALL_API_KEY` is exposed to the client — and that's exclusively for the Gameball widget initialization, never for API calls.

### Route Map

| Route | Method | Gameball Endpoint | Purpose |
|---|---|---|---|
| `register/route.ts` | POST | `/integrations/customers` | Create or update a customer profile |
| `events/route.ts` | POST | `/integrations/events` | Fire custom behavioral events |
| `orders/route.ts` | POST | `/integrations/orders` | Submit orders (auto-triggers reward campaigns) |
| `hold/route.ts` | POST | `/integrations/transactions/hold` | Reserve points for redemption |
| `hold/route.ts` | DELETE | `/integrations/transactions/hold` | Release an unused hold |
| `points/route.ts` | GET | `/integrations/customers/{id}/balance` | Fetch points balance |
| `tier/route.ts` | GET | `/integrations/customers/{id}/tier-progress` | Fetch tier status and progress |
| `campaigns/route.ts` | GET | `/integrations/customers/{id}/reward-campaigns-progress` | Fetch badge/achievement progress |

---

## Integration Details

### 1. Customer Registration

**Trigger:** First visit → onboarding modal collects `displayName` and `email`.

**Flow:** `UserContext.completeOnboarding()` → `POST /api/gameball/register` → Gameball creates the customer record with `customerAttributes`.

**Design decisions:**
- Non-blocking — if the Gameball API fails, the user still proceeds. Registration retries silently on the next visit.
- A `profile_completed` event fires immediately after successful registration (never before — the customer must exist in Gameball first, or the event is orphaned).
- The `playerId` and user metadata are persisted to `localStorage` so the customer is recognized on return.

### 2. Event Tracking

Two custom events are tracked:

**`profile_completed`** — Fires once, immediately after successful customer registration. No metadata. Signals that the customer has completed onboarding, which can trigger a welcome reward campaign in the Gameball dashboard.

**`write_review`** — Fires when a customer submits a product review. Includes metadata that distinguishes image-attached reviews from text-only reviews:

```json
{
  "customerId": "<playerId>",
  "events": {
    "write_review": {
      "has_image": "true" | "false",
      "product_id": "<productId>",
      "rating": "1" - "5"
    }
  }
}
```

The `has_image` field enables segmented reward campaigns in the dashboard — e.g., award 50 points for a text review, 100 points for an image review. The UI surfaces this distinction with a checkbox labeled "I'm attaching an image with my review" paired with a "+Extra Points" incentive label.

**Why there's no separate `purchase_completed` event:** Gameball's Orders API internally triggers reward campaigns tied to purchase events. Firing a manual `purchase_completed` event on top of the order submission causes double-rewarding — the customer earns points twice for the same transaction. We removed this during testing after observing inflated point balances (~2,000 extra points on a $60 order). The comment in `checkout/page.tsx:156` documents this.

### 3. Order & Redemption

**Order submission** sends a full payload to `POST /api/gameball/orders`:

```json
{
  "customerId": "<playerId>",
  "orderId": "UT-<timestamp>-<random>",
  "totalPaid": 49.99,
  "totalPrice": 59.99,
  "orderDate": "<ISO 8601>",
  "channel": "web",
  "lineItems": [
    {
      "productId": "prod-001",
      "quantity": 1,
      "price": 59.99,
      "title": "Classic Oxford Shirt",
      "category": ["Shirts"]
    }
  ]
}
```

`totalPaid` is always the post-discount amount (what Gameball uses for reward calculation). `totalPrice` is the original cart value before any point redemption discount.

**Redemption flow (Hold → Order → Release):**

1. **Hold** — `POST /api/gameball/hold` reserves N points. Gameball returns a `holdReference`.
2. **Order** — The order payload includes `redemption: { pointsHoldReference: "<ref>" }`. Gameball atomically redeems the held points and processes the order.
3. **Failure recovery** — If the order call fails after a successful hold, we fire a `DELETE /api/gameball/hold?ref=<ref>` to release frozen points. This prevents the 10-minute hold timeout from locking the customer out of their balance.

The checkout page computes the discount at 100 points = $1, matching the dashboard configuration.

### 4. Customer Profile Page

**Data fetching:** Points balance and tier progress are fetched in parallel via `Promise.all` in `UserContext.fetchPlayerInfo()`. Badge/achievement data comes from the `/campaigns` route.

**Points balance** — Displays `totalPointsBalance` from `GET /customers/{id}/balance`. The equivalent dollar value is calculated client-side at the 100:1 rate.

**Tier progress** — Shows the current tier name, a progress bar toward the next tier, and the remaining spend required. Fetched from `GET /customers/{id}/tier-progress`.

**Achievements & Badges** — Fetched from `GET /customers/{id}/reward-campaigns-progress`. Each campaign card shows the Gameball CDN icon, campaign name, description, and either "Earned ×N" for completed campaigns or a progress bar for in-progress ones. Earned state is determined by `achievedCount > 0`.

---

## Security Model

- **Secret isolation**: `GAMEBALL_SECRET_KEY` lives exclusively in `.env.local` and is never bundled into client JavaScript. Route Handlers run server-side on the Edge.
- **No client-side API calls**: Every Gameball interaction goes through `/api/gameball/*`. The browser has zero knowledge of the secret key.
- **Widget initialization**: The Gameball JS widget uses only the public API key via the `GbSdk` queue stub pattern per their docs.

---

## Known Limitations & Production Considerations

**COD / delayed payment** — The current implementation fires the order to Gameball at placement time. For cash-on-delivery or deferred payment models, this means customers earn points before the money is collected. If they refuse delivery, you've leaked loyalty currency. In production, defer the Gameball order call until payment confirmation.

**Refunds** — No refund integration exists. In production, call `POST /integrations/transactions/refund` with the original `orderId` when processing returns. Without this, refunded customers retain their earned points — a financial leak that compounds at scale.

**Hold expiry** — Point holds expire after 10 minutes. If a customer lingers at checkout past this window, the hold silently dies. Submitting an order with an expired `holdReference` returns a Gameball error. In production, track hold timestamps and re-hold if the window is close to expiring.

**Pending vs. available points** — Earned points enter a "pending" state for a configurable period (typically 14 days, matching the return window). The UI should only surface `availablePointsBalance` for redemption — showing `totalPointsBalance` will cause hold failures when customers try to redeem pending points.

**Idempotency** — `orderId` is currently generated as `UT-{timestamp}-{random}`. A double-click on "Place Order" generates two distinct IDs, causing duplicate orders and double-rewarding. In production, derive `orderId` from the checkout session so resubmissions are deduplicated by Gameball.

**Orchestration** — The browser currently orchestrates the hold → order sequence as separate fetch calls. If the user closes the tab between the hold and the order, points are frozen for 10 minutes with no corresponding order. In production, collapse this into a single server-side endpoint: one call from the browser, the server handles hold + order atomically.

---

## Tech Stack

- **Framework**: Next.js 14+ (App Router, Edge Runtime)
- **State**: React Context (`UserContext`, `CartContext`) + `localStorage`
- **Gameball SDK**: v4.0 REST API + JS Widget
- **Styling**: Tailwind CSS
- **Auth model**: API key proxy (no user authentication layer — demo scope)
