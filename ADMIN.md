# Flex it! Admin CMS

Enterprise inventory CMS for managing products, brands, categories, media, WhatsApp, and homepage content.

## Stack

- Next.js (App Router) + TypeScript
- PostgreSQL + Prisma ORM
- Auth.js / NextAuth (credentials + JWT)
- Local image uploads (`public/uploads`) — R2-ready architecture

## Quick start

### 1) Start Postgres

```bash
docker compose up -d
```

### 2) Install & migrate

```bash
npm install
cp .env.example .env
npx prisma db push
npm run db:seed
```

### 3) Run

```bash
npm run dev
```

- Storefront: http://localhost:3000
- Admin: http://localhost:3000/admin/login

**Default admin**
- Email: `admin@flexit.store`
- Password: `FlexitAdmin123!` (or `ADMIN_PASSWORD` in `.env`)

## What you can manage

| Area | Path |
|---|---|
| Dashboard & charts | `/admin` |
| Products + size inventory | `/admin/products` |
| Brands | `/admin/brands` |
| Categories | `/admin/categories` |
| Media library | `/admin/media` |
| Homepage hero | `/admin/homepage` |
| WhatsApp number/message | `/admin/whatsapp` |
| Store settings | `/admin/settings` |

## Production deploy (Vercel + Neon)

### 1) Create a Neon database

1. Sign up at [neon.tech](https://neon.tech)
2. Create a project (e.g. `flex-it-store`)
3. Copy the **pooled** connection string (`DATABASE_URL`)

### 2) Push schema + seed against Neon

```bash
# temporarily point local .env at Neon
# DATABASE_URL="postgresql://...@ep-xxxx.neon.tech/neondb?sslmode=require"

npx prisma db push
npm run db:seed
```

### 3) Deploy on Vercel

1. Import the GitHub repo in [vercel.com/new](https://vercel.com/new)
2. Framework: **Next.js** (auto-detected)
3. Add environment variables:

| Name | Value |
|---|---|
| `DATABASE_URL` | Neon connection string |
| `AUTH_SECRET` | Long random string (32+ chars) |
| `AUTH_TRUST_HOST` | `true` |
| `NEXTAUTH_URL` | Your Vercel URL, e.g. `https://flex-it-store.vercel.app` |
| `ADMIN_PASSWORD` | Strong admin password (seed / first admin) |
| `NEXT_PUBLIC_SITE_URL` | Same as production URL |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | `923330215663` |

4. Deploy
5. Open `/admin/login` and sign in with `admin@flexit.store` + your `ADMIN_PASSWORD`

### Uploads note

Vercel’s serverless filesystem is ephemeral. Product images uploaded in admin work for the request, but for durable production media move to **Cloudflare R2 / S3 / Vercel Blob** next. Until then, host images under `public/products` or an external CDN URL.

## Size inventory behavior

- Each size has its own quantity
- Qty `0` → size hidden/disabled on product page
- Qty `1–2` → low-stock alert on dashboard

## Future-ready modules

Schema and dashboard placeholders exist for:

- Orders / revenue / visitors
- Cart, checkout, payments, COD
- Coupons, wishlist, customer accounts
