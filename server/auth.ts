import * as client from "openid-client";
import { Strategy, type VerifyFunction } from "openid-client/passport";
import passport from "passport";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import memoize from "memoizee";
import connectPg from "connect-pg-simple";
import { storage } from "./storage";

const DEFAULT_ISSUER_URL = "https://replit.com/oidc";

function getAppUrl(): string | undefined {
  if (process.env.APP_URL) return process.env.APP_URL;
  if (process.env.RAILWAY_PUBLIC_DOMAIN) return `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`;
  return undefined;
}

function getOidcClientId() {
  return process.env.OIDC_CLIENT_ID || process.env.REPL_ID;
}

function getOidcIssuerUrl() {
  return process.env.OIDC_ISSUER_URL || process.env.ISSUER_URL || DEFAULT_ISSUER_URL;
}

function getOidcClientSecret() {
  return process.env.OIDC_CLIENT_SECRET;
}

function isOidcConfigured() {
  return Boolean(getAppUrl() && getOidcClientId());
}

const getOidcConfig = memoize(
  async () => {
    const clientId = getOidcClientId();
    if (!clientId) {
      throw new Error("OIDC_CLIENT_ID is not configured");
    }

    return await client.discovery(
      new URL(getOidcIssuerUrl()),
      clientId,
      getOidcClientSecret(),
    );
  },
  { maxAge: 3600 * 1000 },
);

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false,
    ttl: sessionTtl,
    tableName: "sessions",
  });

  return session({
    secret: process.env.SESSION_SECRET || "change-me-before-production",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
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

  passport.serializeUser((user: Express.User, cb) => cb(null, user));
  passport.deserializeUser((user: Express.User, cb) => cb(null, user));

  if (!isOidcConfigured()) {
    console.warn(
      "OIDC auth is not configured. Set APP_URL, OIDC_CLIENT_ID, OIDC_CLIENT_SECRET, and OIDC_ISSUER_URL to enable login.",
    );

    app.get("/api/login", (_req, res) => {
      res.status(503).json({
        message: "Login is not configured. Set Railway OIDC environment variables.",
      });
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
  const user = req.user as any;

  if (!req.isAuthenticated() || !user?.expires_at) {
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
    const user = req.user as any;
    const userId = user?.claims?.sub;
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
