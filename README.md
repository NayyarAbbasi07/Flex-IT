# Flex it! — Curated Fashion

Premium curated imported thrift fashion storefront + admin CMS.

**Status & flow:** see [PROJECT-STATUS.md](PROJECT-STATUS.md) (what’s done, what’s missing, how the app works).

## Project structure

```
flex-it-store/
├── frontend/              # Next.js — storefront + admin UI (:3000)
├── backend/               # Express API (Node.js/CommonJS) + Prisma (:3001)
├── docker-compose.yml     # Local Postgres
├── package.json           # Workspace scripts (run both apps)
├── README.md
└── ADMIN.md
```

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
  (`admin@flexit.store` / `FlexitAdmin123!`)
- API: http://localhost:3001

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start backend + frontend |
| `npm run dev:frontend` | Frontend only |
| `npm run dev:backend` | Backend only |
| `npm run db:up` | Start Postgres |
| `npm run db:push` | Sync Prisma schema |
| `npm run db:seed` | Seed admin + sample catalog |
| `npm run db:studio` | Browse database in browser |

Env files live in each app: `backend/.env`, `frontend/.env.local`.
