# Bhumaji Systems private website chat ↔ WhatsApp bridge

This folder contains a Cloudflare Worker starter for the existing website chat. It does **not** expose a WhatsApp link or your phone number to website visitors. The current website chat remains unchanged until you deploy and configure the bridge.

## Important interaction model

Because a website visitor has no WhatsApp identity in this setup, the simplest no-inbox-subscription approach sends the visitor's message to your existing WhatsApp number. The message includes a short chat code. Reply in WhatsApp using:

`BH ABC123 Thanks for contacting us. I can help with your AWS migration.`

Replace `ABC123` with the code shown in the notification. The worker routes that reply to the correct visitor's website chat. This code-based approach supports multiple simultaneous website chats. Do not send a reply without the code.

The WhatsApp Cloud API number is the **spare/API-enabled number**. Your existing WhatsApp Business number is configured as the owner/support recipient. Website visitors only see the website chat.

## Requirements

- Meta Business portfolio and a Meta developer app with the WhatsApp product.
- WhatsApp Cloud API sender phone number ID and an access token.
- The spare number registered with WhatsApp Cloud API.
- Your existing WhatsApp Business number configured as the owner recipient.
- Cloudflare account and a KV namespace.
- A webhook subscription for the `messages` field.
- For owner notifications, the owner recipient must have opened a WhatsApp service window by messaging the API number, or the Worker must be adapted to use an approved template when outside the 24-hour window. The API does not guarantee free-form notifications can be sent at any time.

## Deploy

1. Create a Cloudflare KV namespace named e.g. `BHUMAJI_CHAT_KV`.
2. Set the namespace ID in `wrangler.toml`.
3. Install Wrangler and authenticate with Cloudflare.
4. Add secrets (never put tokens in GitHub or website JavaScript):
   - `npx wrangler secret put WHATSAPP_TOKEN`
   - `npx wrangler secret put WHATSAPP_VERIFY_TOKEN` (choose a long random string)
   - `npx wrangler secret put WHATSAPP_APP_SECRET` (Meta app secret)
   - `npx wrangler secret put WHATSAPP_OWNER_PHONE` (digits only, country code included)
   - `npx wrangler secret put WHATSAPP_PHONE_NUMBER_ID`
5. Set `ALLOWED_ORIGIN` as a Worker variable to `https://bhumaji.com,https://www.bhumaji.com`.
6. Deploy with `npx wrangler deploy`; test `/health`.
7. In Meta Developers → WhatsApp → Configuration, set callback URL to `https://YOUR-WORKER.workers.dev/webhook`, use the same verify token, and subscribe to `messages`.
8. Message the spare/API number from your owner WhatsApp number once to open the support-message window.
9. Only after the Worker is deployed, update the website chat script to use its Worker URL. Do not expose any access token in the website.

## API

- `POST /api/session` — create a private session; returns `sessionId`, `token`, and the owner reply `code`.
- `POST /api/message` — body: `{ "sessionId": "...", "token": "...", "text": "..." }`.
- `POST /api/poll` — body: `{ "sessionId": "...", "token": "..." }`.
- `GET /webhook` — Meta webhook verification.
- `POST /webhook` — verifies Meta's `X-Hub-Signature-256` and routes owner replies.

## Security and launch checklist

- Never commit access tokens, app secrets, or real phone numbers.
- Restrict allowed origins to the exact production site domains.
- Test Meta webhook signatures, message delivery, invalid/expired codes, and concurrent sessions.
- Add rate limiting and abuse protection before advertising the chat publicly.
- Add a short privacy notice for visitors explaining that messages are sent to Bhumaji Systems support.
- Set an approved template for owner notifications outside the WhatsApp service window, if needed.
- This is a starter implementation; deploy to a test environment and validate the current Meta account's rules before production.
