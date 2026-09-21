-- Run once if db push fails on Role enum (old SUPER_ADMIN / EDITOR values).
-- From host with Docker running:
--   docker compose exec -T db psql -U flexit -d flexit < backend/scripts/fix-role-enum.sql
-- Then:
--   cd backend && npx prisma db push && npm run db:seed

UPDATE "User" SET role = 'ADMIN' WHERE role::text IN ('SUPER_ADMIN', 'EDITOR');
