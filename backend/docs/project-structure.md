# Flex it! Backend — Project Structure

How the **Flex it!** Express API is organized: folder layout, layers, and conventions.

Adapted from the TNE-backend style (one action per controller file, flat `*Routes.js`, one `*Service.js` per domain), using **Prisma + PostgreSQL** instead of Sequelize + SQL Server.

---

## 1. Stack & entry points

| Item | Detail |
|------|--------|
| Runtime | Node.js |
| Framework | Express 5 |
| ORM / DB | Prisma + PostgreSQL |
| Auth | JWT (cookie / Bearer) |
| Config | `config.json` + `backend/.env` (`DATABASE_URL`, `AUTH_SECRET`, …) |
| Schema | `prisma/schema.prisma` (replaces Sequelize `models/definition`) |

| Script | Command | Entry |
|--------|---------|--------|
| Start | `npm start` | `bin/www.js` |
| Dev | `npm run dev` | `node --watch bin/www.js` |
| Seed | `npm run db:seed` | `seeders/seed.js` |
| Generate client | `npm run build` / `npx prisma generate` | Prisma → `@prisma/client` |

**Boot sequence**

```text
bin/www.js
  → loads dotenv
  → loads app.js (Express app)
  → creates HTTP server
  → listen(PORT from config.json, default 3001)
```

**HTTP mount**

```text
/health            → health check
/uploads/*         → static media
/api/*             → routes/index.js (public + admin)
```

Not included (not needed for this shop API): Socket.IO, Swagger, cron jobs, Sequelize models.

---

## 2. Request flow

```text
Client
  → routes/<domain>Routes.js          (path + auth middleware)
  → controllers/<domain>/<action>.js  (Joi validate + HTTP response)
  → service/<domain>Service.js        (business logic + Prisma)
  → prisma/schema.prisma              (DB schema)
  → PostgreSQL
```

| Layer | Responsibility | Must not |
|-------|----------------|----------|
| **Route** | URL + middleware (`authenticationMiddleware` for admin) | Contain business logic |
| **Controller** | Validate with Joi; call one service method; return `{ success, data }` | Talk to Prisma directly |
| **Service** | Queries, domain rules, status payloads | Know about Express `req`/`res` |
| **Prisma schema** | Tables, enums, relations | Contain API validation |
| **Common / Utils** | Auth middleware, JWT, slug, errors, response helpers | Become feature dumping grounds |

**Barrel files**

- `controllers/index.js` — **one** barrel exporting every action handler (no `index.js` inside domain folders)
- `service/index.js` — `{ brandService, productService, … }`
- `routes/index.js` — mounts all routers under `/api`

---

## 3. Top-level directory map

```text
backend/
├── app.js
├── bin/www.js
├── config.json
├── package.json
├── common/
│   ├── authenticationMiddleware.js
│   └── response.js
├── controllers/<domain>/<action>.js
├── controllers/index.js
├── routes/
│   ├── index.js
│   ├── authRoutes.js
│   ├── productRoutes.js
│   ├── collectionRoutes.js
│   ├── catalogRoutes.js
│   ├── settingsRoutes.js
│   ├── heroRoutes.js
│   ├── brandRoutes.js
│   ├── categoryRoutes.js
│   ├── mediaRoutes.js
│   ├── userRoutes.js
│   └── statsRoutes.js
├── service/
│   ├── index.js
│   ├── prisma.js
│   ├── brandService.js
│   ├── productService.js
│   ├── categoryService.js
│   ├── authService.js
│   ├── mediaService.js
│   ├── settingsService.js
│   ├── heroService.js
│   ├── statsService.js
│   ├── collectionService.js
│   └── catalogService.js
├── utils/
│   ├── jwt.js
│   ├── slug.js
│   ├── params.js
│   └── errorHandlers/
│       ├── CustomError.js
│       └── CustomErrorMiddleware.js
├── seeders/seed.js
├── prisma/schema.prisma
├── uploads/
├── scripts/
└── docs/
    └── project-structure.md
```

---

## 4. How to add a feature

1. **Schema** — update `prisma/schema.prisma`, then `npx prisma db push` (or migrate)
2. **Service** — add methods to `service/<name>Service.js` + export from `service/index.js`
3. **Controllers** — `controllers/<name>/<action>.js` (one action = one file)
4. **Register controllers** — add the action to the single `controllers/index.js`
5. **Routes** — `routes/<name>Routes.js` + mount in `routes/index.js`

---

## 5. Routes & auth

Public routes (no JWT):

| Mount | File |
|-------|------|
| `/api/auth` | `authRoutes.js` |
| `/api/products` | `productRoutes.js` |
| `/api/collections` | `collectionRoutes.js` |
| `/api/catalog` | `catalogRoutes.js` |
| `/api/settings` | `settingsRoutes.js` |
| `/api/hero` | `heroRoutes.js` |

Admin routes (JWT via `authenticationMiddleware` in `routes/index.js`):

| Mount | File |
|-------|------|
| `/api/products` | `productRoutes.js` (public + Admin-gated manage/CRUD) |
| `/api/brands` | `brandRoutes.js` (Admin) |
| `/api/categories` | `categoryRoutes.js` (Admin) |
| `/api/media` | `mediaRoutes.js` (Admin) |
| `/api/users` | `userRoutes.js` (Admin) |
| `/api/stats` | `statsRoutes.js` (Admin) |
| `/api/settings` | `settingsRoutes.js` (public GET + Admin PUT/manage) |
| `/api/hero` | `heroRoutes.js` (public GET + Admin PUT) |

Admin protection is **per-route** via `authenticationMiddleware([RoleAuthorizationTypes.Admin])` — there is no separate `adminRoutes.js`.

Response shape stays `{ success: true, data }` / `{ success: false, error }` — do not change API contracts.

---

## 6. Services

| File | Purpose |
|------|---------|
| `prisma.js` | PrismaClient singleton |
| `authService.js` | Login, get user by id |
| `brandService.js` | Brand CRUD |
| `categoryService.js` | Category CRUD |
| `productService.js` | Admin product CRUD |
| `catalogService.js` | Public catalog mapping + shop filters |
| `collectionService.js` | Public collections (uses catalog) |
| `mediaService.js` | Upload / list / soft-delete media |
| `settingsService.js` | Store settings |
| `heroService.js` | Homepage hero |
| `statsService.js` | Admin dashboard stats |

Controllers always import via the barrel:

```js
const { brandService } = require('../../service');
await brandService.createBrand(...);
```

---

## 7. Errors

```text
controller / service → throw CustomError(message, statusCode)
  → CustomErrorMiddleware (app.js)
  → JSON { success: false, error }
```

Joi / ValidationError → `422` with optional `details`.

---

## 8. Prisma vs Sequelize models

There is **no** `models/definition/` folder. Table shapes live in `prisma/schema.prisma`. The generated client is consumed as `@prisma/client` (default output under `node_modules`). Do not use a custom `generated/prisma` output.

---

## 9. Quick reference

| I need to… | Put it in… |
|------------|------------|
| Add an API endpoint | `controllers/` + `routes/` |
| Add business logic | `service/<domain>Service.js` |
| Add a DB table | `prisma/schema.prisma` |
| Protect admin routes | `authenticationMiddleware` in `routes/index.js` |
| Add seed data | `seeders/seed.js` |
| Document structure | `docs/project-structure.md` |
