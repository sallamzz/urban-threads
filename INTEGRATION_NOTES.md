# UrbanThreads — Gameball Integration Notes

## Architecture

All Gameball API calls are proxied through **separate Next.js Route Handlers** under `app/api/gameball/`. Each route has one job and uses the appropriate authentication level:

| Route File | Auth | Gameball Endpoint |
|---|---|---|
| `register/route.ts` | APIKey + SecretKey | `POST /integrations/customers` |
| `events/route.ts` | APIKey + SecretKey | `POST /integrations/events` |
| `orders/route.ts` | APIKey + SecretKey | `POST /integrations/orders` |
| `hold/route.ts` | APIKey + SecretKey | `POST/DELETE /integrations/transactions/hold` |
| `points/route.ts` | APIKey | `GET /integrations/customers/{id}/points-balance` |
| `tier/route.ts` | APIKey | `GET /integrations/customers/{id}/tier-progress` |
| `campaigns/route.ts` | APIKey | `GET /integrations/customers/{id}/campaigns` |

A shared helper (`lib/gameball.ts`) provides `gbGet`, `gbPost`, and `gbDel` with the correct auth headers. The **SecretKey never reaches the browser** — only `NEXT_PUBLIC_GAMEBALL_API_KEY` is exposed client-side for the Gameball widget.

## The Four Required Integrations

1. **Customer Registration** — Onboarding modal on first visit → `POST /integrations/customers` with `customerAttributes` (displayName, email). Non-blocking: user can browse immediately if the API fails; registration retries on next visit.

2. **Events** — `profile_completed` fires only after successful registration (so the customer exists in Gameball first). `write_review` sends `has_image`, `product_id`, and `rating` as metadata — the dashboard campaign distinguishes image reviews from text-only.

3. **Order & Redemption** — Hold → Order pattern. If redeeming: `POST /transactions/hold` first, then pass `holdReference` in the order's `redemption` field. `totalPaid` is always the post-discount amount in dollars (what Gameball uses for reward calculation). `lineItems` include productId, quantity, price, title, and category.

4. **Profile Page** — Points balance, tier progress, and campaigns fetched in parallel. Badges render as achieved (gold border, trophy) or unachieved (grayscale, progress bar).

## Assumptions

- 100 points = $1 redemption rate (matching dashboard config)
- Only `displayName` and `email` collected — minimal friction for a demo
- Orders stored in localStorage (no DB) — Gameball is the source of truth for points/tiers
- Widget initialized with the `GbSdk` queue stub pattern per Gameball docs

## What Would Change in Production

- **COD orders**: Only call the Order API after payment confirmation, not on placement
- **Refunds**: Call `POST /integrations/transactions/refund` with original `orderId`
- **Hold expiry**: Show countdown at checkout; release + re-hold if the 10-min window lapses
- **Pending vs available points**: Distinguish in UI (14-day return window)
- **Error recovery**: If order API fails after a successful hold, `DELETE /hold` to release immediately
- **Idempotency**: Deterministic `orderId` tied to checkout session to prevent double-earn
