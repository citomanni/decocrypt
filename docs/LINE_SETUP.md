# LINE Live Chat — Setup

The site shows a "Chat on LINE" button that opens your LINE Official Account.
It only appears when `LINE_URL` is set in `.env`.

## Steps

1. Install the **LINE** app and create a LINE account (needs a phone number).
2. Create a free **LINE Official Account** at <https://manager.line.biz>.
3. In the OA Manager: **Settings → Response settings → Chat = ON** (so you can reply to users live).
4. Copy your account's add-friend / chat link (looks like `https://lin.ee/xxxxxxx`).
5. Put it in `.env`:
   ```
   LINE_URL=https://lin.ee/xxxxxxx
   ```
6. Restart the server (`.env` changes are not auto-reloaded).

## Test

- Log in as a user → click the green **Chat on LINE** button → it opens your OA chat.
- Reply from the LINE app or the OA Manager (<https://manager.line.biz>).
