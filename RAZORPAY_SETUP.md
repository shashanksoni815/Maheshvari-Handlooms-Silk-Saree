# Razorpay setup

The checkout flow uses Razorpay Checkout. It creates the order and calculates the amount on the server, opens the Razorpay payment window in the browser, verifies the payment signature and captured payment on the server, and accepts signed provider webhooks as a server-to-server confirmation path.

## Add test credentials

1. Create or sign in to a Razorpay account and switch to **Test Mode**.
2. Generate a test API Key ID and Key Secret in **Account & Settings → API Keys**.
3. Copy the examples to local environment files (do not commit the populated files):
   - `server/.env.example` → `server/.env`
   - `client/.env.example` → `client/.env`
4. Put the **Key ID** in both `server/.env` (`RAZORPAY_KEY_ID`) and `client/.env` (`VITE_RAZORPAY_KEY_ID`). Put the **Key Secret only in `server/.env`** (`RAZORPAY_KEY_SECRET`). Never use a `VITE_` variable for a secret.
5. Configure payment capture as **automatic** in Razorpay. The server confirms a payment only after Razorpay reports it as captured.
6. Restart the client and server after editing environment files. Vite embeds `VITE_` values when it starts/builds.

Example variable names (replace values with your own):

- Server: `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`
- Client: `VITE_API_URL`, `VITE_RAZORPAY_KEY_ID`

## Configure webhooks

1. In Razorpay Dashboard, create a webhook with URL `https://<your-api-host>/api/v1/payments/webhook`.
2. Create a webhook secret and set it as `RAZORPAY_WEBHOOK_SECRET` in the server environment. This is separate from the API Key Secret.
3. Subscribe to `payment.captured` (the handler also accepts `order.paid`).
4. For local development, expose the local server through a trusted HTTPS tunnel and configure that tunnel URL as the webhook URL.

## Test the flow

1. Start MongoDB, the server, and the client.
2. Publish an in-stock product and add it to the cart.
3. Complete checkout using Razorpay's test payment credentials and test payment methods.
4. Confirm the order in the account order history and verify the payment status in the admin order detail.
5. Test a declined/cancelled attempt: the checkout should explain the result and reuse the saved order when retrying in the same checkout session.
6. Test the webhook with Razorpay's dashboard tools and confirm invalid/missing signatures are rejected.
7. Test refunds only in Test Mode. Admin refund action supports full-order refunds through the Razorpay API.

For production, replace test keys with live keys, use the production API URL and frontend origin, and use a distinct production webhook secret. Keep all secrets in the hosting provider's server-side environment configuration. Do not commit `.env` files.
