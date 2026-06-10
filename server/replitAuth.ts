// Compatibility shim for older route modules that still import from ./replitAuth.
// The Replit-specific implementation required REPLIT_DOMAINS at module load time,
// which prevents Railway from starting. Keep this file as a stable import path
// while delegating to the provider-neutral auth implementation.
export { getSession, setupAuth, isAuthenticated, isAdmin } from "./auth";
