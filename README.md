# Deco Holdings

A cryptocurrency platform for **Deco Holdings**, covering two product lines:

- **Deco Trade** – new investment/trading accounts (`type: "New Trade"`)
- **Deco Recovery** – fund-recovery accounts (`type: "Recovery"`)

It includes a public marketing site, a user area (register, dashboard, deposit,
withdrawal, profile, settings) and an admin dashboard for managing users and
deposit addresses.

> School project. Passwords are intentionally stored in plain text — this is **not**
> production-ready and should not be deployed as-is.

## Tech stack

- **Node.js / Express** – server and routing
- **EJS** – server-rendered views
- **MongoDB / Mongoose** – data layer
- **Cloudinary** – profile-image storage
- **CoinGecko / NewsAPI** – live prices and crypto news

## Architecture (MVC)

```
index.js            # app entry: env, db, middleware, routes, error handlers
models/             # Mongoose schemas (User, Address)
controllers/        # request handlers (auth, user, admin, news)
routes/             # Express routers (user, admin, news)
middleware/         # upload (multer)
utils/              # apiFeatures, dashboardData, validator, cloudinary, errors
views/              # EJS templates
public/             # static assets (admin theme, home, funding, shared)
```

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file (see `.env.example` for all keys), then run:
   ```bash
   npm run dev      # development (nodemon)
   npm start        # production
   ```
3. Open `http://localhost:8000`.

## Admin panel

The admin dashboard lives under the obfuscated base path defined by `ADMIN_PATH`
in `.env`. Log in with `ADMIN_USERNAME` / `ADMIN_PASSWORD`.
