import * as client from "openid-client";
import { Strategy, type VerifyFunction } from "openid-client/passport";

import passport from "passport";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import memoize from "memoizee";
import connectPg from "connect-pg-simple";
import { storage } from "./storage";
import crypto from "crypto";

if (!process.env.REPLIT_DOMAINS) {
  throw new Error("Environment variable REPLIT_DOMAINS not provided");
}

const getOidcConfig = memoize(
  async () => {
    return await client.discovery(
      new URL(process.env.ISSUER_URL ?? "https://replit.com/oidc"),
      process.env.REPL_ID!
    );
  },
  { maxAge: 3600 * 1000 }
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
    secret: process.env.SESSION_SECRET!,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: true,
      maxAge: sessionTtl,
    },
  });
}

function updateUserSession(
  user: any,
  tokens: client.TokenEndpointResponse & client.TokenEndpointResponseHelpers
) {
  user.claims = tokens.claims();
  user.access_token = tokens.access_token;
  user.refresh_token = tokens.refresh_token;
  user.expires_at = user.claims?.exp;
}

const ADMIN_EMAILS = [
  "battlesbudz@gmail.com",
  "Battlesbudz@gmail.com",
];

async function upsertUser(
  claims: any,
) {
  const email = claims["email"];
  const isAdmin = ADMIN_EMAILS.some(adminEmail => 
    adminEmail.toLowerCase() === email?.toLowerCase()
  );
  
  const userData: any = {
    id: claims["sub"],
    email: email,
    firstName: claims["first_name"],
    lastName: claims["last_name"],
    profileImageUrl: claims["profile_image_url"],
  };
  
  // Auto-assign admin role for designated admin emails
  if (isAdmin) {
    userData.role = "admin";
  } else if (claims["role"]) {
    userData.role = claims["role"];
  }
  
  await storage.upsertUser(userData);
}

export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  const config = await getOidcConfig();

  const verify: VerifyFunction = async (
    tokens: client.TokenEndpointResponse & client.TokenEndpointResponseHelpers,
    verified: passport.AuthenticateCallback
  ) => {
    const user = {};
    updateUserSession(user, tokens);
    await upsertUser(tokens.claims());
    verified(null, user);
  };

  for (const domain of process.env
    .REPLIT_DOMAINS!.split(",")) {
    const strategy = new Strategy(
      {
        name: `replitauth:${domain}`,
        config,
        scope: "openid email profile offline_access",
        callbackURL: `https://${domain}/api/callback`,
      },
      verify,
    );
    passport.use(strategy);
  }

  passport.serializeUser((user: Express.User, cb) => cb(null, user));
  passport.deserializeUser((user: Express.User, cb) => cb(null, user));

  // Cookie-based redirect solution that survives OAuth flow
  const COOKIE_SECRET = process.env.SESSION_SECRET || 'fallback-secret';
  const REDIRECT_COOKIE_NAME = 'battles_redirect';

  function signRedirectUrl(url: string): string {
    const timestamp = Date.now().toString();
    const payload = `${url}:${timestamp}`;
    const signature = crypto
      .createHmac('sha256', COOKIE_SECRET)
      .update(payload)
      .digest('hex');
    return `${payload}:${signature}`;
  }

  function verifyRedirectUrl(signedUrl: string): string | null {
    try {
      const parts = signedUrl.split(':');
      if (parts.length !== 3) return null;
      
      const [url, timestamp, signature] = parts;
      const payload = `${url}:${timestamp}`;
      const expectedSignature = crypto
        .createHmac('sha256', COOKIE_SECRET)
        .update(payload)
        .digest('hex');
      
      // Verify signature and check if not expired (30 minutes)
      if (signature !== expectedSignature) return null;
      if (Date.now() - parseInt(timestamp) > 30 * 60 * 1000) return null;
      
      return url;
    } catch {
      return null;
    }
  }

  app.get("/api/login", (req: any, res, next) => {
    const redirectTo = req.query.redirect as string;
    
    if (redirectTo) {
      // Store redirect URL in signed cookie that survives OAuth flow
      const signedRedirectUrl = signRedirectUrl(redirectTo);
      res.cookie(REDIRECT_COOKIE_NAME, signedRedirectUrl, {
        httpOnly: true,
        secure: true,
        maxAge: 30 * 60 * 1000, // 30 minutes
        sameSite: 'lax'
      });
      console.log('✅ Redirect URL written to signed cookie:', redirectTo);
    }
    
    passport.authenticate(`replitauth:${req.hostname}`, {
      prompt: "login consent",
      scope: ["openid", "email", "profile", "offline_access"],
    })(req, res, next);
  });

  app.get("/api/callback", (req: any, res, next) => {
    passport.authenticate(`replitauth:${req.hostname}`, {
      failureRedirect: "/api/login",
    })(req, res, (err?: any) => {
      if (err) {
        return next(err);
      }
      
      // Cookie-based redirect that survives OAuth flow
      let redirectTo = "/";
      
      // Read and verify signed cookie
      const signedRedirectUrl = req.cookies[REDIRECT_COOKIE_NAME];
      if (signedRedirectUrl) {
        const verifiedUrl = verifyRedirectUrl(signedRedirectUrl);
        if (verifiedUrl) {
          redirectTo = verifiedUrl;
          console.log('✅ Cookie/JWT verified during callback, redirecting to:', redirectTo);
        } else {
          console.log('❌ Cookie verification failed or expired');
        }
        
        // Clear the cookie after use
        res.clearCookie(REDIRECT_COOKIE_NAME);
      } else {
        console.log('❌ No redirect cookie found in callback');
      }
      
      console.log('✅ Correct redirect executed:', redirectTo);
      
      res.redirect(redirectTo);
    });
  });

  app.get("/api/logout", (req, res) => {
    req.logout(() => {
      res.redirect(
        client.buildEndSessionUrl(config, {
          client_id: process.env.REPL_ID!,
          post_logout_redirect_uri: `${req.protocol}://${req.hostname}`,
        }).href
      );
    });
  });
}

export const isAdmin: RequestHandler = async (req, res, next) => {
  const user = req.user as any;

  if (!req.isAuthenticated() || !user.expires_at) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const now = Math.floor(Date.now() / 1000);
  if (now > user.expires_at) {
    const refreshToken = user.refresh_token;
    if (!refreshToken) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    try {
      const config = await getOidcConfig();
      const tokenResponse = await client.refreshTokenGrant(config, refreshToken);
      updateUserSession(user, tokenResponse);
    } catch (error) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  }

  // Check if user has admin role
  const dbUser = await storage.getUser(user.claims.sub);
  if (!dbUser || dbUser.role !== 'admin') {
    return res.status(403).json({ message: "Admin access required" });
  }

  return next();
};

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  const user = req.user as any;

  if (!req.isAuthenticated() || !user.expires_at) {
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