# Deploying Garden of Weeden on Railway

This app runs as a standard Express + Vite + PostgreSQL service on Railway.

## Railway service settings

- Build command: `npm run build`
- Start command: `npm run start`
- Health check path: `/health`

## Required environment variables

```bash
DATABASE_URL=postgresql://...
SESSION_SECRET=<long random string>
APP_URL=https://<your-railway-domain>
NODE_ENV=production
```

`APP_URL` should match the public Railway URL. Update it again if you add a custom domain.

## Authentication

If you use OpenID Connect, set:

```bash
OIDC_ISSUER_URL=https://<your-identity-provider>
OIDC_CLIENT_ID=<client id>
OIDC_CLIENT_SECRET=<client secret>
```

Callback URL:

```text
https://<your-railway-domain>/api/callback
```

## Database

Use Railway Postgres or another Postgres host. After setting `DATABASE_URL`, push schema changes with:

```bash
npm run db:push
```

## File storage

If you use the secure document upload/download flow, set the Google Cloud storage credentials used by `server/objectStorage.ts`.
