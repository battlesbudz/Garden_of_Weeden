# Garden of Weeden Cannabis Platform

## Overview
Garden of Weeden is a veteran-owned cannabis microbusiness in Buffalo, New York, aiming to bring military precision to craft cannabis cultivation. This digital platform showcases the brand's "Enchanted Grit" identity, blending Wizard of Oz whimsy with authentic service-forged values. The platform emphasizes veteran ownership, Buffalo micro-terroir cultivation, and wellness advocacy, with a vision to become a leading example of compliant, high-quality craft cannabis in the New York market.

## User Preferences
- Focus on mobile-first responsive design
- **Garden of Weeden Brand Identity**: Veteran-owned, Buffalo-proud, Wizard of Oz aesthetic
- **Color Palette**: Evergreen/parchment/midnight (no longer gold/black)
- **Typography**: Wizard of Oz fonts for whimsical, enchanted feel
- **Voice**: "Enchanted Grit" - mythic + reverent + authentic
- Prioritize user experience and navigation flow
- Keep authentication secure but user-friendly
- Emphasize veteran ownership and Buffalo micro-terroir positioning

## System Architecture
The platform features a modern web stack designed for performance, scalability, and maintainability.

**UI/UX Decisions:**
- **Brand Identity**: "Enchanted Grit" combining Wizard of Oz whimsy with service-forged values.
- **Color Palette**: Evergreen Canopy (#245427), Parchment Glow (#F7F1DA), Midnight Grove (#1a1a1a), and Canopy Veil (#3A6A2B), derived from the brand logo.
- **Typography**: Yeseva One (headlines), Cormorant Garamond (subheadings), Work Sans (body), and Parisienne (decorative accents) for a whimsical feel.
- **Design System**: Custom CSS properties in HSL format with backward compatibility.
- **Accessibility**: 100% WCAG 2.1 Level AA compliant, including skip navigation, ARIA live regions and landmarks, enhanced focus management, appropriate touch target sizes, descriptive link context, and robust color contrast.
- **Regulatory Compliance**: Full 9 NYCRR Parts 128 & 129 compliance, including age verification, mandated health warnings, and license number display.

**Technical Implementations:**
- **Frontend**: React with Vite, TypeScript, Tailwind CSS, and shadcn/ui for componentry.
- **Backend**: Express.js.
- **Database**: PostgreSQL.
- **ORM**: Drizzle ORM for type-safe database interactions.
- **Authentication**: Replit Auth with session management for multi-tier access (customer, investor, admin) and OIDC flow.
- **State Management**: TanStack Query for server-side state.
- **Routing**: Wouter for client-side routing.
- **SEO**: Comprehensive and dynamic SEO system with reusable components, cannabis-specific keywords, local optimization, structured data (Organization, Local Business, Product schemas), and mobile/social optimization (Open Graph tags).

**System Design Choices:**
- **Mobile-First Design**: Ensures responsiveness and optimal viewing across all devices.
- **Modular Architecture**: Emphasized through refactoring efforts, leading to significant code reduction and improved maintainability.
- **Secure Authentication**: Robust authentication flow with cryptographically signed cookies and HMAC verification.
- **Regulatory Compliance**: Integrated OCM and WCAG compliance directly into the architecture.

## External Dependencies
- **Replit Auth**: For user authentication and session management.
- **PostgreSQL**: Relational database for data storage.
- **TanStack Query**: For managing and caching server state.
- **Tailwind CSS**: Utility-first CSS framework.
- **shadcn/ui**: UI component library.
- **Vite**: Frontend build tool.
- **Express.js**: Backend web application framework.
- **Drizzle ORM**: TypeScript ORM for PostgreSQL.
- **Wouter**: React-friendly routing library.