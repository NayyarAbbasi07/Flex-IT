# Flex it! — Project Status & Flow

**Updated:** 2026-09-15  
**What this is:** Pakistan thrift / curated sneaker storefront (PKR) + admin CMS. Shoppers browse online and buy via **WhatsApp** (no cart payment gateway). Customers do **not** need accounts.

Related: [backend/docs/BACKEND-STATUS.md](backend/docs/BACKEND-STATUS.md) · [README.md](README.md) · [ADMIN.md](ADMIN.md)

---

## Verdict

| Layer | Status |
| --- | --- |
| Storefront (browse, product pages, WhatsApp CTAs) | **Working** |
| WhatsApp CMS number + dynamic order message | **Working** |
| Inquiry log on Buy click | **Working** |
| Admin CMS (catalog, media, settings, homepage, FAQs, reviews) | **Working** |
| Admin orders (list + create + status) | **Working** |
| Admin users / low-stock / change-password | **Working** |
| Backend API + Postgres + roles | **Working** |
| Swagger UI (`/api/docs`, `backend/swagger/*.docs.js`) | **Working** |
| Customer account UI | **Out of scope** (WhatsApp-first) |
| Payments / shopping cart | **Out of scope** |

**Overall:** App is feature-complete for WhatsApp-first ops. Remaining work is **production deploy**, secrets, real catalog/photos, and durable media storage.

---

## Shopper journey

1. Browse homepage / shop / collections (API data; static demo fallback **only in development**)
2. Open product → pick size → **Buy on WhatsApp**
3. Prefills order message (product, SKU, size, price, condition, link)
4. Also logs a lead in Admin → Inquiries (best-effort)
5. You confirm payment & delivery on WhatsApp

---

## Correctly done

### Backend
- [x] Express + Prisma + PostgreSQL
- [x] Auth, roles, products, brands, categories, media
- [x] Hero, settings, FAQs, testimonials
- [x] Inquiries + orders (stock down on confirm)
- [x] Users CRUD, low-stock, stats
- [x] Full Swagger UI via JSDoc modules in `backend/swagger/`

### Frontend — storefront
- [x] Homepage, shop, product detail, collections, about, contact
- [x] WhatsApp settings provider (CMS number everywhere)
- [x] Dedicated product order message (not general chat text)
- [x] Inquiry POST on Buy click
- [x] Production-safe: no demo catalog fallback when `NODE_ENV=production`

### Frontend — admin
- [x] Dashboard, products, brands, categories, media
- [x] Inquiries, orders (**create + update**), FAQs, reviews
- [x] Homepage, WhatsApp, settings
- [x] Low stock page, Users page, change password

---

## Still missing (ops / launch — not missing app features)

| Gap | Notes |
| --- | --- |
| Production hosting | Deploy Next + Express + Postgres |
| Production secrets | Change `AUTH_SECRET`, `ADMIN_PASSWORD`, DB password |
| `NEXT_PUBLIC_SITE_URL` | Must be live domain for WhatsApp product links |
| Real catalog + photos | Replace seed demo; upload via Media |
| Durable uploads | Local `uploads/` needs volume or S3/R2 in production |
| Versioned Prisma migrations | Prefer migrate over `db push` for prod |
| CI / automated tests | Optional |

### Optional later
- Live Instagram Graph API feed
- Forgot-password email reset (password change is in Settings)
- Cloud CDN for images

---

## How to run

```bash
npm install
docker compose up -d
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
npm run db:push
npm run db:seed
npm run dev
```

| URL | Purpose |
| --- | --- |
| http://localhost:3000 | Storefront |
| http://localhost:3000/admin/login | Admin |
| http://localhost:3001/api/docs | Swagger UI |
| http://localhost:3001/health | API health |

---

## Production checklist

1. Set WhatsApp number in Admin → WhatsApp  
2. Set `NEXT_PUBLIC_SITE_URL` to your live domain  
3. Rotate admin password (Settings → Change password) and `AUTH_SECRET`  
4. Deploy API + DB + frontend; persist `/uploads`  
5. Publish real products; do not re-seed over live data  
6. Smoke-test Buy on WhatsApp + Admin → Inquiries  
