# Al-Saad Furniture — Showroom Website

A bilingual (Arabic / English) furniture **showroom catalog**. Visitors browse products and contact the showroom. There is **no cart, no prices, and no checkout**.

## Stack

- **Frontend:** React, Vite, React Router, Tailwind CSS, Framer Motion, Lucide React
- **Backend:** Node.js, Express, MongoDB, Mongoose
- **Auth:** JWT + bcrypt (admin dashboard)

## Project structure

```text
├── client/     Public website + admin UI
├── server/     REST API, uploads, seed script
├── .env.example
└── README.md
```

## Setup

### 1. Environment

Copy `.env.example` to `.env` in the **project root** (the API also reads `server/.env` if you prefer).

```text
MONGODB_URI=mongodb://127.0.0.1:27017/al-saad-furniture
JWT_SECRET=use-a-long-random-string
PORT=5000
CLIENT_ORIGIN=http://localhost:5173
ADMIN_EMAIL=admin@alsaad.local
ADMIN_PASSWORD=ChangeMe123!
```

Replace placeholder branch phone numbers, WhatsApp, email, addresses, and Google Maps URLs from **Admin → Branches**. Do not commit real credentials.

### 2. MongoDB

Install and start MongoDB locally, or set `MONGODB_URI` to a MongoDB Atlas connection string.

### 3. Install and seed

```bash
cd server
npm install
npm run seed
npm run dev
```

```bash
cd client
npm install
npm run dev
```

- Website: http://localhost:5173
- Admin: http://localhost:5173/admin/login
- API: http://localhost:5000/api/health

Seeded admin login uses `ADMIN_EMAIL` / `ADMIN_PASSWORD` from `.env`.

`npm run seed` **resets** demo products, categories, and branches so the catalog is easy to replace later.

### 4. Images

For local development, product and category uploads are stored in `server/uploads/` and served at `/uploads/...`. In production, configure Cloudinary with `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET`; uploads then persist across Vercel deployments.

Allowed types: JPEG, PNG, WebP. Max size: 5MB per file (up to 10 images per product).

For production, point the client at your API (or reverse-proxy `/api` and `/uploads`) and keep `CLIENT_ORIGIN` set to the public site URL.

## Main customer flow

Home → Products (search / filter) → Product details → Contact Us (`/contact?product=<id>`) → Message saved → Admin views and updates status.

## Scripts

| Location | Command | Purpose |
| --- | --- | --- |
| `server` | `npm run dev` | API with file watch |
| `server` | `npm start` | API production |
| `server` | `npm run seed` | Demo data + admin user |
| `client` | `npm run dev` | Vite development server |
| `client` | `npm run build` | Production build |

## Production notes

- Change `JWT_SECRET` and the admin password before going live.
- Restrict CORS to the real frontend origin.
- Put MongoDB credentials only in environment variables.
- Replace Unsplash demo images with your own photography via the admin dashboard.

### Deployment

- Deploy `server/` as a Vercel project. Set its Root Directory to `server`; Vercel will use `api/index.js` as the serverless entry point.
- Deploy `client/` as a Vite project on Vercel with build command `npm run build` and output directory `dist`.
- Set `VITE_API_URL` to the Vercel API project URL including `/api`, for example `https://your-api.vercel.app/api`.
- Set `CLIENT_ORIGIN` in the API project's Vercel environment to the deployed frontend Vercel URL.
- Run `npm run seed` once against the production database using the production environment variables.

Vercel's local filesystem is temporary. This project switches to Cloudinary automatically when its three Cloudinary environment variables are configured. To receive contact-form notifications, set `RESEND_API_KEY` and `NOTIFICATION_EMAIL`. For optional Google Analytics, set `VITE_GA_MEASUREMENT_ID` in the client project.
