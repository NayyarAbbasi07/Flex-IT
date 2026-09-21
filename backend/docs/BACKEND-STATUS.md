# Flex it! Backend — Done / Not Done

Single source of truth for the Express + Prisma API.  
**Last audited / updated:** 2026-09-15

---

## Verdict

| Area | Status |
|------|--------|
| Catalog CMS (products, brands, categories, media, hero, settings) | **Done** |
| Auth + roles (`ADMIN` / `CUSTOMER`) per-route gates | **Done** |
| Admin user CRUD | **Done** |
| FAQ + Testimonials APIs + seed | **Done** |
| WhatsApp inquiries + orders + stock on confirm | **Done** |
| Change password | **Done** |
| Low-stock, product pagination/filters, bulk status | **Done** |
| Rate limit, request logging, env validation, DB health, API docs JSON | **Done** |
| Forgot/reset password | **Not done** (optional) |
| Full Swagger UI + OpenAPI | **Done** (`/api/docs` UI + `/api/docs/openapi.json`; JSDoc in `backend/swagger/`) |
| Checked-in Prisma migration SQL history | **Partial** (folder + README; use `migrate dev` after clean DB) |

---

## 1. Stack

| Item | Detail |
|------|--------|
| Runtime | Node.js (CommonJS) |
| Framework | Express 5 |
| ORM / DB | Prisma 6 + PostgreSQL |
| Auth | JWT cookie `flexit_token` and/or Bearer |
| Validation | Joi |
| Uploads | Multer → `uploads/` |
| Config | `config.json` + `config.js` + `.env` |
| Enums | `common/enumFunction.js` |
| Roles | `authenticationMiddleware([RoleAuthorizationTypes.Admin])` per route |

Local DB: Docker Compose Postgres only (`docker compose up -d`).

---

## 2. Roles

| Role | Access |
|------|--------|
| **Admin** | Full CMS + users + inquiries + orders + stats |
| **Customer** | Register/login/me/change-password; `GET /inquiries/mine`, `GET /orders/mine`; public catalog |

---

## 3. Done

### Auth (`/api/auth`)

| Method | Path | Access |
|--------|------|--------|
| POST | `/register` | Public → CUSTOMER (rate limited) |
| POST | `/login` | Public (rate limited) |
| POST | `/logout` | Public |
| GET | `/me` | Admin \| Customer |
| POST | `/change-password` | Admin \| Customer |

### Products (`/api/products`)

| Method | Path | Access |
|--------|------|--------|
| GET | `/`, `/featured`, `/latest`, `/:slug`, `/:slug/related` | Public |
| GET | `/manage` | Admin (pagination: `page`, `pageSize`, `q`, `status`, `brandId`, `categoryId`) |
| GET | `/low-stock` | Admin |
| PUT | `/bulk-status` | Admin `{ ids, status }` |
| POST | `/` | Admin |
| GET/PUT/DELETE | `/id/:id` | Admin |

### Brands / Categories / Media / Users / Stats

Admin-only CRUD (and stats GET) as before under `/api/brands`, `/categories`, `/media`, `/users`, `/stats`.

### Settings / Hero / Catalog / Collections

Public reads + Admin writes (settings `/manage`, hero PUT) — unchanged pattern.

### FAQs (`/api/faqs`)

| Method | Path | Access |
|--------|------|--------|
| GET | `/` | Public (enabled only) |
| GET | `/manage` | Admin |
| POST | `/` | Admin |
| PUT/DELETE | `/:id` | Admin |

### Testimonials (`/api/testimonials`)

| Method | Path | Access |
|--------|------|--------|
| GET | `/` | Public (enabled only) |
| GET | `/manage` | Admin |
| POST | `/` | Admin |
| PUT/DELETE | `/:id` | Admin |

### Inquiries (`/api/inquiries`)

| Method | Path | Access |
|--------|------|--------|
| POST | `/` | Public (optional Customer token; rate limited) |
| GET | `/mine` | Customer |
| GET | `/` | Admin |
| GET/PUT | `/:id` | Admin |

### Orders (`/api/orders`)

| Method | Path | Access |
|--------|------|--------|
| GET | `/mine` | Customer |
| GET | `/` | Admin |
| POST | `/` | Admin |
| GET/PUT | `/:id` | Admin |

Confirming an order (`status: CONFIRMED`) **decrements** size inventory in a transaction; insufficient stock → `409`. Cancelling a confirmed order restores stock.

### Hardening

- [x] Request logging (`common/requestLogger.js`)
- [x] Rate limit on login/register/inquiry (`common/rateLimiter.js`)
- [x] Boot env validation (`common/validateEnv.js`)
- [x] Health check with DB ping (`GET /health` → `{ ok, db: "up"|"down" }`)
- [x] Lightweight OpenAPI summary (`GET /api/docs`)
- [x] Stats include inquiry/order counts + low-stock via `lowStockAt`

---

## 4. Partial / not done

| Item | Notes |
|------|--------|
| Forgot / reset password | Not built |
| Full Swagger UI | Use `/api/docs` JSON summary for now |
| Versioned migrate history | See `prisma/migrations/README.md` — run `prisma migrate dev` on a clean DB |
| Automated CI tests | Not added |

---

## 5. Prisma models

| Model | API |
|-------|-----|
| User, Brand, Category, Product, ProductImage, ProductInventory | Done |
| MediaAsset, StoreSetting, HeroSection | Done |
| Faq, Testimonial | Done |
| Inquiry, Order, OrderItem | Done |

**Enums:** `Role`, `ProductStatus`, `ConditionGrade`, `Gender`, `InquiryStatus`, `InquirySource`, `OrderStatus`

---

## 6. Endpoint map

```text
GET  /health
GET  /uploads/*
GET  /api/docs

POST /api/auth/register | /login | /logout
GET  /api/auth/me
POST /api/auth/change-password

GET  /api/products | /featured | /latest | /:slug | /:slug/related
GET  /api/products/manage | /low-stock
PUT  /api/products/bulk-status
POST /api/products
GET|PUT|DELETE /api/products/id/:id

GET|POST|PUT|DELETE /api/brands
GET|POST|PUT|DELETE /api/categories
GET|POST|DELETE /api/media
GET|POST /api/users ; PUT|DELETE /api/users/:id
GET  /api/stats

GET  /api/settings ; GET /api/settings/manage ; PUT /api/settings
GET  /api/hero ; PUT /api/hero
GET  /api/catalog ; GET /api/collections ; GET /api/collections/:slug

GET  /api/faqs ; GET /api/faqs/manage ; POST /api/faqs ; PUT|DELETE /api/faqs/:id
GET  /api/testimonials ; GET /api/testimonials/manage ; POST /api/testimonials ; PUT|DELETE /api/testimonials/:id

POST /api/inquiries ; GET /api/inquiries/mine ; GET /api/inquiries ; GET|PUT /api/inquiries/:id
GET  /api/orders/mine ; GET|POST /api/orders ; GET|PUT /api/orders/:id
```

---

## 7. Apply DB changes (important)

Docker must be running. If Role enum push fails on old `SUPER_ADMIN`:

```powershell
docker compose up -d
docker compose exec -T db psql -U flexit -d flexit -c "UPDATE \"User\" SET role = 'ADMIN' WHERE role::text IN ('SUPER_ADMIN', 'EDITOR');"
cd backend
npx prisma db push
npm run db:seed
```

Or reset local DB:

```powershell
docker compose down -v
docker compose up -d
cd backend
npx prisma db push
npm run db:seed
```

---

## 8. File inventory (new)

**Routes:** `faqRoutes.js`, `testimonialRoutes.js`, `inquiryRoutes.js`, `orderRoutes.js`  
**Services:** `faqService.js`, `testimonialService.js`, `inquiryService.js`, `orderService.js`  
**Common:** `rateLimiter.js`, `requestLogger.js`, `validateEnv.js`  
**Scripts:** `scripts/fix-role-enum.sql`

---

## Legend

| Status | Meaning |
|--------|---------|
| **Done** | Shipped via HTTP |
| **Partial** | Started / lightweight |
| **Not done** | Still missing |
| **Out of scope** | Cart / payment gateways / tax |
