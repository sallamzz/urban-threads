# UrbanThreads — Gameball Integration Notes

## APIs Used

| Integration | Endpoint | Auth |
|-------------|----------|------|
| Customer registration | `POST /integrations/customers` | APIKey + SecretKey |
| Custom events | `POST /integrations/events` | APIKey + SecretKey |
| Points balance | `GET /integrations/customers/{id}/points-balance` | APIKey + SecretKey |
| Tier progress | `GET /integrations/customers/{id}/tier-progress` | APIKey + SecretKey |
| Badges / campaigns | `GET /integrations/customers/{id}/campaigns` | APIKey + SecretKey |
| Points hold | `POST /integrations/transactions/hold` | APIKey + SecretKey |
| Release hold | `DELETE /integrations/transactions/hold/{ref}` | APIKey + SecretKey |
| Order (earn + redeem) | `POST /integrations/orders` | APIKey + SecretKey |

All API calls are proxied through Next.js Route Handlers (`app/api/gameball/*`) — the `SecretKey` never reaches the browser. Only `NEXT_PUBLIC_GAMEBALL_API_KEY` is exposed client-side (used for the Gameball widget).

## Four Integration Requirements

1. **Customer Registration** — On first visit, an onboarding modal collects name and email. A UUID is generated client-side as `customerId`. `POST /integrations/customers` is called with `customerAttributes` (displayName, email). Registration is non-blocking: the user can browse immediately; failure is retried on next visit.

2. **Events** — Two events are tracked:
   - `profile_completed: {}` — fires once immediately after successful registration (not before, to ensure the customer exists in Gameball first).
   - `write_review: { has_image: "true"|"false", product_id: "...", rating: "..." }` — fires when a user submits a review from any product detail page. A `submitted` flag prevents duplicate firing.

3. **Order Earn + Redeem** — At checkout:
   - If redeeming points: `POST /transactions/hold` first. The returned `holdReference` is passed as `redemption.pointsHoldReference` in the order call.
   - `POST /integrations/orders` is called with `totalPaid` (post-discount, in dollars), `lineItems` (with productId, quantity, price, title, category), and `channel: "web"`.
   - Hold is blocking: the flow aborts if the hold fails, preventing order submission without confirmed redemption.

4. **Customer Profile Page** — `/account` fetches points balance, tier progress, and campaigns (badges) in a single refresh cycle. Badges are rendered as achieved (full color, gold border) or unachieved (grayscale, progress bar) based on `isAchieved`, `achievedCount`, or `completionPercentage`.

## Assumptions

- **100 pts = $1** for display purposes (matching the dashboard's `1pt = $0.01` redemption rate).
- The Gameball widget is loaded via the official `gameball-init.min.js` script using the queue-based `GbLoadInit` stub pattern.
- No mobile number collected — `customerAttributes` uses name and email only.
- Orders are persisted in `localStorage` (no backend database). Gameball is the source of truth for points, tiers, and badges.

## What Would Be Different in Production

- **Server-side secrets**: Ensure `GAMEBALL_BASE_URL`, `GAMEBALL_API_KEY`, and `GAMEBALL_SECRET_KEY` are set as environment variables in the hosting platform (e.g., Cloudflare Pages, Vercel).
- **COD orders**: Do not call the Order API at checkout — only after payment confirmation.
- **Refunds**: Call `POST /integrations/transactions/refund` with the original `orderId` on every refund to reverse earned points.
- **Hold expiry**: Surface a countdown timer at checkout; release and re-hold if the 10-minute window elapses.
- **Pending points**: Clearly distinguish pending vs. available in the UI so customers understand the 14-day return window.
- **Error recovery**: If the order API fails after a successful hold, call `DELETE /hold` to release the points immediately rather than waiting for automatic expiry.
- **Idempotency**: Generate deterministic `orderId` values tied to the checkout session so re-submissions are safe.
