# Configure email delivery

The forgot-password endpoint creates a short-lived reset token and emails a link to the address on the account. Email delivery is performed by the server using SMTP; the browser cannot send these messages directly.

## Why the endpoint returned HTTP 500

The server's mailer requires `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`, and `FROM_EMAIL`. These values were missing from the server environment configuration, so Nodemailer could not connect/authenticate and the controller returned an email-delivery error. The reset token is cleared when sending fails, so a failed request does not leave a usable token behind.

## Setup

1. Copy `server/.env.example` to `server/.env` if you have not already.
2. Get SMTP host, port, username, and password from your email provider. Enter them in `server/.env` as `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, and `SMTP_PASS`.
3. Set `FROM_EMAIL` to a sender address permitted by that provider, and optionally set `FROM_NAME`.
4. Set `FRONTEND_URL` to the client origin that serves the reset-password page, for example `http://localhost:5173` during local development.
5. Restart the server after changing environment variables.
6. Request a reset for an email address that exists in the application's database, then check inbox and spam folders. Reset links expire after 10 minutes.

SMTP port `587` uses STARTTLS; port `465` uses implicit TLS. For Gmail, use an App Password (with 2-Step Verification enabled), not the normal account password. For a deployed site, use a verified sender/domain and store SMTP credentials in the hosting provider's secret environment settings. Never commit `server/.env` or publish `SMTP_PASS` in a `VITE_` variable.
