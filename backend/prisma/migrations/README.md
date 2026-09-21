# Migrations

This project historically used `prisma db push` for local sync.

For production / versioned history:

```bash
# after Docker is up and Role data is clean
npx prisma migrate dev --name init
```

If `db push` fails because of old `SUPER_ADMIN` / `EDITOR` roles, run:

```bash
docker compose exec -T db psql -U flexit -d flexit < backend/scripts/fix-role-enum.sql
```

Or reset local DB (wipes data):

```bash
docker compose down -v
docker compose up -d
cd backend
npx prisma db push
npm run db:seed
```
