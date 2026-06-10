# Deploying Garden of Weeden on Railway

This app is an Express + Vite + PostgreSQL application. It no longer needs Replit runtime variables to boot.

## Railway settings

Railway can use the included `railway.json`:

- Build command: `npm run build`
- Start command: `npm run start`
- Health check: `/api/auth/user`

## Required environment variables

Set these in the Railway service Variables tab:

```bash
DATABASE_URL=postgresql://...
SESSION_SECRET=<long random string>
APP_URL=https://<your-railway-domain>
NODE_ENV=production
```

`APP_URL` must match the public Railway URL after deployment. If you later add a custom domain, update it.

## Authentication

The previous Replit auth integration required `REPLIT_DOMAINS` and `REPL_ID`, which are not available on Railway. The app now uses provider-neutral OpenID Connect when these variables are present:

```bash
OIDC_ISSUER_URL=https://<your-identity-provider>/.well-known/openid-configuration-parent
OIDC_CLIENT_ID=<client id>
OIDC_CLIENT_SECRET=<client secret>
```

Callback URL to configure in your identity provider:

```text
https://<your-railway-domain>/api/callback
```

Logout and login routes remain:

- `GET /api/login`
- `GET /api/callback`
- `GET /api/logout`
- `GET /api/auth/user`

If OIDC variables are not set, the app still boots and `/api/auth/user` returns unauthenticated responses, but login routes return `503`.

## Database

Use Railway Postgres or keep the existing Neon database. Either way, set `DATABASE_URL` and run migrations/schema push:

```bash
npm run db:push
```

## Object storage follow-up

`server/objectStorage.ts` was written for Replit Object Storage's sidecar credential service. Railway does not provide that endpoint. File upload/signing flows that use object storage should be migrated to one of:

- Google Cloud Storage with a service account JSON
- S3-compatible storage
- Railway volume for simple local persistence

The app can still deploy without this if those routes are not exercised, but object storage is the remaining Replit-specific subsystem to replace.
