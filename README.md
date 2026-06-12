# Garden of Weeden

Garden of Weeden is a Buffalo, NY cannabis microbusiness site built with React, Vite, TypeScript, Express, Drizzle, and PostgreSQL.

## Stack

- Frontend: React, Vite, TypeScript, Tailwind, shadcn/ui
- Backend: Express, Drizzle ORM
- Database: PostgreSQL
- Auth: session-based login with customer, investor, and admin roles

## Scripts

```bash
npm run dev
npm run build
npm run check
npm run test:admin
npm run db:push
```

## Deployment

The app is deployed on Railway. Build with `npm run build`, start with `npm run start`, and set the required environment variables described in `RAILWAY_DEPLOYMENT.md`.

## Admin

The admin dashboard supports site content, media, users, subscribers, homepage editing, and blog management.
