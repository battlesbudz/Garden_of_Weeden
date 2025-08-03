# Battles Budz Cannabis Platform

## Project Overview
A sophisticated cannabis industry digital platform designed to streamline investor engagement through a secure, role-based document management system.

## Architecture
- **Frontend**: React with Vite, TypeScript, Tailwind CSS, shadcn/ui components
- **Backend**: Express.js with PostgreSQL database
- **ORM**: Drizzle ORM with type-safe database operations
- **Authentication**: Replit Auth with session management
- **State Management**: TanStack Query for server state
- **Routing**: Wouter for client-side routing

## Recent Changes

### Login & Redirect Improvements (2025-01-03)
- **Fixed investor portal login redirect issue**: Users are now properly redirected back to the investor portal after login instead of being sent to homepage
- **Restored Replit Auth flow**: Fixed authentication to use proper Replit OAuth instead of custom login form
- **Improved mobile responsiveness**: Resolved desktop view switching issue after login - now maintains proper mobile view
- **Enhanced redirect mechanism**: Implemented dual-approach using OAuth state parameter and session storage for reliable redirects
- **Fixed TypeScript errors**: Added proper type annotations for API responses in investor portal

### Technical Details
- Restored `/api/login` endpoint with Replit Auth OAuth flow
- Added both routes `/investors` and `/investor-portal` for investor portal access
- Implemented OAuth state parameter encoding to preserve redirect URL across authentication flow
- Enhanced session storage backup mechanism for redirect persistence
- Fixed all TypeScript errors in authentication and investor portal components

## User Preferences
- Focus on mobile-first responsive design
- Maintain professional cannabis industry branding with gold/black color scheme
- Prioritize user experience and navigation flow
- Keep authentication secure but user-friendly

## Key Features
- Multi-tier authentication (customer, investor, admin)
- Investor portal with document access control
- Community forum with gamification
- E-commerce functionality
- Real-time updates and notifications
- Mobile-responsive design

## Development Guidelines
- Follow the fullstack_js development guidelines in the codebase
- Use TypeScript for type safety
- Implement proper error handling and loading states
- Maintain consistent UI/UX patterns
- Test on both desktop and mobile viewports

## Current Status
- ✅ Login redirect issue completely resolved with cookie-based solution
- ✅ Mobile responsiveness improved (no desktop view switching)  
- ✅ TypeScript errors fixed
- ✅ Robust authentication flow that survives OAuth session resets
- ✅ Cryptographically signed cookies with HMAC verification
- → System fully operational - investor portal login flow working perfectly