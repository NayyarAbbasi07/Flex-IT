# Flex it! Admin CMS

Enterprise inventory CMS for managing products, brands, categories, media, WhatsApp, and homepage content.

## Architecture

- **Frontend** (`frontend/`): Next.js admin UI at `/admin`
- **Backend** (`backend/`): Express API at `:3001` — Prisma, JWT auth, uploads

## Quick start

```bash
npm install
docker compose up -d
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
npm run db:push
npm run db:seed
npm run dev
```

- Storefront: http://localhost:3000
- Admin: http://localhost:3000/admin/login
- API health: http://localhost:3001/health

**Default admin**
- Email: `admin@flexit.store`
- Password: `FlexitAdmin123!` (or `ADMIN_PASSWORD` in `backend/.env`)

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

## Backend layout

```
backend/
├── app.js
├── bin/www.js
├── routes/          # flat *Routes.js under /api
├── controllers/     # one action per file
├── service/         # one *Service.js per domain + prisma.js
├── common/          # authenticationMiddleware, response helpers
├── utils/           # jwt, slug, CustomError*
├── seeders/
├── prisma/          # schema (Postgres via Prisma)
├── docs/            # project-structure.md
└── uploads/         # media storage
```

See `backend/docs/project-structure.md` for the full map.

## Production (Vercel frontend + Node backend + Neon)

1. Create Neon Postgres and set `DATABASE_URL` on the backend host
2. `npx prisma db push` + `npm run db:seed` from `backend/`
3. Deploy backend (Railway/Render/Fly) with `AUTH_SECRET`, `CORS_ORIGIN`
4. Deploy `frontend/` to Vercel with `NEXT_PUBLIC_API_URL` pointing at the API
5. Point media/uploads at durable storage (R2/S3) when moving off local disk
