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
- **Updated login flow**: Changed "Sign In to Portal" button to redirect to `/login` instead of `/api/login` and properly set `sessionStorage` redirect URL
- **Improved mobile responsiveness**: Added proper viewport handling and responsive design fixes
- **Fixed TypeScript errors**: Added proper type annotations for API responses in investor portal

### Technical Details
- Modified `client/src/pages/investor-portal.tsx` to set `redirectAfterLogin` in sessionStorage before redirecting to login
- Enhanced `client/src/hooks/useAuth.ts` with proper login mutation and TypeScript types
- Fixed API response typing for investor access checks and document queries

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
- ✅ Login redirect issue resolved
- ✅ Mobile responsiveness improved  
- ✅ TypeScript errors fixed
- → Next: Continue enhancing user experience based on feedback