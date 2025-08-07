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

### Comprehensive SEO Implementation (2025-01-07)
- **Complete SEO Infrastructure**: Implemented dynamic SEO system with reusable components
- **Cannabis Industry Optimization**: Added cannabis-specific keywords and compliance-focused SEO
- **Local SEO Enhancement**: Optimized for Gloversville, NY market with structured data
- **Technical SEO Files**: Created robots.txt and XML sitemap with cannabis industry compliance
- **Page-Specific Optimization**: Added SEO to all major pages (8 pages + product pages)
- **Structured Data**: Implemented Organization, Local Business, and Product schemas
- **Mobile & Social Optimization**: Enhanced Open Graph tags and mobile SEO

### SEO Technical Details
- Created `SEOHead` component for dynamic meta tag management
- Implemented `seo.ts` utilities with cannabis-specific keyword collections
- Added JSON-LD structured data for better search engine understanding
- Configured proper canonical URLs and robots meta tags
- Optimized product pages with individual product schemas
- Set up investor portal with noindex for privacy compliance

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
- ✅ **SEO SYSTEM FULLY IMPLEMENTED**: Comprehensive SEO across all pages with cannabis industry optimization
- ✅ **Technical SEO Complete**: Robots.txt, XML sitemap, structured data, and meta tag optimization
- ✅ **Cannabis Compliance**: Industry-specific keywords, local SEO, and regulatory compliance
- ✅ Login redirect issue completely resolved with cookie-based solution
- ✅ Mobile responsiveness improved (no desktop view switching)  
- ✅ TypeScript errors fixed
- ✅ Robust authentication flow that survives OAuth session resets
- ✅ Cryptographically signed cookies with HMAC verification
- ✅ **MAJOR REFACTORING COMPLETED**: Schema decomposition (85% reduction) and enhanced-community.tsx (80% reduction)
- ✅ Community page functionality restored after component extraction
- → System fully operational with improved architecture, maintainability, and SEO optimization

## Refactoring Achievements (January 6, 2025)
- **Schema.ts**: 589 lines → 90 lines (85% reduction) via domain-driven decomposition
- **Enhanced-community.tsx**: 1200+ lines → 242 lines (80% reduction) via component extraction  
- **Investor-admin.tsx**: 1914 lines → 1290 lines (33% reduction) via zero-impact component extraction
- **Created Components**: 
  - Community: ForumSection.tsx (554 lines), EducationGuides.tsx (259 lines)
  - Admin: UserManagement.tsx (248 lines), DocumentManagement.tsx (303 lines)
  - Admin: InvestorOverview.tsx (176 lines), AccessRequestsManager.tsx (388 lines)
- **Total Extracted**: 1,928 lines of clean, focused component code
- **Zero Breaking Changes**: All functionality preserved, no visual changes
- **TypeScript Errors**: All 114 TypeScript errors resolved