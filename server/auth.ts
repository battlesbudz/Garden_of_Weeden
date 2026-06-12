import * as client from "openid-client";
import { Strategy, type VerifyFunction } from "openid-client/passport";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import memoize from "memoizee";
import connectPg from "connect-pg-simple";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";
import { storage } from "./storage";
import { db } from "./db";
import { users } from "@shared/schema";
import { eq, or, sql } from "drizzle-orm";
import type { Request } from "express";

function getAppUrl(): string | undefined {
  if (process.env.APP_URL) return process.env.APP_URL;
  if (process.env.RAILWAY_PUBLIC_DOMAIN) return `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`;
  return undefined;
}

function getOidcClientId() {
  return process.env.OIDC_CLIENT_ID;
}

function getOidcIssuerUrl() {
  return process.env.OIDC_ISSUER_URL || process.env.ISSUER_URL;
}

function getOidcClientSecret() {
  return process.env.OIDC_CLIENT_SECRET;
}

function isOidcConfigured() {
  return Boolean(getAppUrl() && getOidcClientId() && getOidcIssuerUrl());
}

const getOidcConfig = memoize(
  async () => {
    const clientId = getOidcClientId();
    if (!clientId) {
      throw new Error("OIDC_CLIENT_ID is not configured");
    }

    const issuerUrl = getOidcIssuerUrl();
    if (!issuerUrl) {
      throw new Error("OIDC_ISSUER_URL is not configured");
    }

    return await client.discovery(
      new URL(issuerUrl),
      clientId,
      getOidcClientSecret(),
    );
  },
  { maxAge: 3600 * 1000 },
);

function getRequiredEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is required for secure startup`);
  }
  return value;
}

export function getSessionUserId(req: Request): string | undefined {
  const user = req.user as any;
  return user?.claims?.sub ?? user?.id;
}

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: true,
    ttl: sessionTtl,
    tableName: "sessions",
  });

  return session({
    secret: getRequiredEnvVar("SESSION_SECRET"),
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: sessionTtl,
    },
  });
}

function updateUserSession(
  user: any,
  tokens: client.TokenEndpointResponse & client.TokenEndpointResponseHelpers,
) {
  user.claims = tokens.claims();
  user.access_token = tokens.access_token;
  user.refresh_token = tokens.refresh_token;
  user.expires_at = user.claims?.exp;
}

const ADMIN_EMAILS = [
  "battlesbudz@gmail.com",
  "BattlesBudz@gmail.com",
];

async function ensureLocalAuthSchema() {
  await db.execute(sql`
    ALTER TABLE users
    ADD COLUMN IF NOT EXISTS username varchar UNIQUE,
    ADD COLUMN IF NOT EXISTS password_hash varchar
  `);
}

async function seedDefaultAdmin() {
  const username = process.env.DEFAULT_ADMIN_USERNAME;
  const email = process.env.DEFAULT_ADMIN_EMAIL;
  const password = process.env.DEFAULT_ADMIN_PASSWORD;

  if (!username || !email || !password) return;

  const passwordHash = await bcrypt.hash(password, 12);
  const values = {
    username,
    email,
    passwordHash,
    firstName: "Garden",
    lastName: "Admin",
    role: "admin",
    updatedAt: new Date(),
  };

  const [matchingDefaultAdmin] = await db
    .select()
    .from(users)
    .where(or(eq(users.username, username), eq(users.email, email)))
    .limit(1);

  if (matchingDefaultAdmin) {
    await db.update(users).set(values).where(eq(users.id, matchingDefaultAdmin.id));
    return;
  }

  const [localAdmin] = await db
    .select()
    .from(users)
    .where(sql`${users.role} = 'admin' and ${users.passwordHash} is not null`)
    .limit(1);

  if (localAdmin) return;

  await db.insert(users).values({
    id: `admin_${nanoid(16)}`,
    ...values,
  });
}

async function upsertUser(claims: any): Promise<{ id: string; email: string | null }> {
  const email = claims["email"];
  const isAdmin = ADMIN_EMAILS.some(adminEmail =>
    adminEmail.toLowerCase() === email?.toLowerCase(),
  );

  const userData: any = {
    id: claims["sub"],
    email,
    firstName: claims["first_name"] || claims["given_name"],
    lastName: claims["last_name"] || claims["family_name"],
    profileImageUrl: claims["profile_image_url"] || claims["picture"],
  };

  if (isAdmin) {
    userData.role = "admin";
  } else if (claims["role"]) {
    userData.role = claims["role"];
  }

  const user = await storage.upsertUser(userData);
  return { id: user.id, email: user.email };
}

export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  await ensureLocalAuthSchema();
  await seedDefaultAdmin();

  passport.serializeUser((user: Express.User, cb) => {
    const sessionUser = user as any;
    if (sessionUser.claims?.sub) {
      cb(null, {
        provider: "oidc",
        id: sessionUser.claims.sub,
        claims: sessionUser.claims,
        access_token: sessionUser.access_token,
        refresh_token: sessionUser.refresh_token,
        expires_at: sessionUser.expires_at,
      });
      return;
    }

    cb(null, { provider: "local", id: sessionUser.id });
  });

  passport.deserializeUser(async (sessionUser: any, cb) => {
    try {
      if (sessionUser?.provider === "oidc") {
        cb(null, sessionUser);
        return;
      }

      const id = typeof sessionUser === "string" ? sessionUser : sessionUser?.id;
      const user = id ? await storage.getUser(id) : undefined;
      cb(null, user ? { provider: "local", id: user.id } : false);
    } catch (error) {
      cb(error);
    }
  });

  passport.use(
    "local",
    new LocalStrategy(async (username, password, done) => {
      try {
        const [user] = await db
          .select()
          .from(users)
          .where(or(eq(users.username, username), eq(users.email, username)))
          .limit(1);

        if (!user?.passwordHash) return done(null, false, { message: "Invalid credentials" });

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) return done(null, false, { message: "Invalid credentials" });

        return done(null, { id: user.id });
      } catch (error) {
        return done(error);
      }
    }),
  );

  if (!isOidcConfigured()) {
    console.warn(
      "OIDC auth is not configured. Set APP_URL, OIDC_CLIENT_ID, OIDC_CLIENT_SECRET, and OIDC_ISSUER_URL to enable login.",
    );

    app.get("/api/login", (_req, res) => {
      res.redirect("/login");
    });

    app.get("/api/logout", (req, res) => {
      req.logout(() => {
        req.session.destroy(() => {
          res.redirect("/");
        });
      });
    });

    return;
  }

  const config = await getOidcConfig();
  const appUrl = getAppUrl()!;
  const clientId = getOidcClientId()!;

  const verify: VerifyFunction = async (
    tokens: client.TokenEndpointResponse & client.TokenEndpointResponseHelpers,
    verified: passport.AuthenticateCallback,
  ) => {
    const user: any = {};
    updateUserSession(user, tokens);

    const dbUser = await upsertUser(tokens.claims());
    if (user.claims && dbUser.id !== user.claims.sub) {
      user.claims.sub = dbUser.id;
    }

    verified(null, user);
  };

  passport.use(
    "oidc",
    new Strategy(
      {
        name: "oidc",
        config,
        scope: "openid email profile offline_access",
        callbackURL: `${appUrl}/api/callback`,
      },
      verify,
    ),
  );

  app.get("/api/login", (req: any, res, next) => {
    const redirectTo = typeof req.query.redirect === "string" ? req.query.redirect : "/";
    req.session.returnTo = redirectTo;

    passport.authenticate("oidc", {
      prompt: "login consent",
      scope: ["openid", "email", "profile", "offline_access"],
    })(req, res, next);
  });

  app.get("/api/callback", (req: any, res, next) => {
    passport.authenticate("oidc", {
      failureRedirect: "/api/login",
    })(req, res, (err: any) => {
      if (err) return next(err);
      const redirectTo = req.session.returnTo || "/";
      delete req.session.returnTo;
      res.redirect(redirectTo);
    });
  });

  app.get("/api/logout", (req, res) => {
    req.logout(() => {
      req.session.destroy(() => {
        res.redirect(
          client.buildEndSessionUrl(config, {
            client_id: clientId,
            post_logout_redirect_uri: appUrl,
          }).href,
        );
      });
    });
  });
}

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  const userId = getSessionUserId(req);
  const user = req.user as any;

  if (!req.isAuthenticated() || !userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (user?.provider === "local") return next();

  if (!user.expires_at) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const now = Math.floor(Date.now() / 1000);
  if (now <= user.expires_at) {
    return next();
  }

  const refreshToken = user.refresh_token;
  if (!refreshToken) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const config = await getOidcConfig();
    const tokenResponse = await client.refreshTokenGrant(config, refreshToken);
    updateUserSession(user, tokenResponse);
    return next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
};

export const isAdmin: RequestHandler = async (req, res, next) => {
  await isAuthenticated(req, res, async () => {
    const userId = getSessionUserId(req);
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const dbUser = await storage.getUser(userId);
    if (!dbUser || dbUser.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    return next();
  });
};
