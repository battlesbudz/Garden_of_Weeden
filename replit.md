# Garden of Weeden Cannabis Platform

## Overview
Garden of Weeden is a veteran-owned cannabis microbusiness in Buffalo, New York, aiming to bring military precision to craft cannabis cultivation. This digital platform showcases the brand's "Enchanted Grit" identity, blending whimsical enchantment with authentic service-forged values. The platform emphasizes veteran ownership, Buffalo micro-terroir cultivation, and wellness advocacy, with a vision to become a leading example of compliant, high-quality craft cannabis in the New York market.

## User Preferences
- Focus on mobile-first responsive design
- **Garden of Weeden Brand Identity**: Veteran-owned, Buffalo-proud
- **Color Palette**: Evergreen/parchment/midnight (no longer gold/black)
- **Typography**: Whimsical, enchanted aesthetic with elegant serif and script fonts
- **Voice**: "Enchanted Grit" - mythic + reverent + authentic
- Prioritize user experience and navigation flow
- Keep authentication secure but user-friendly
- Emphasize veteran ownership and Buffalo micro-terroir positioning
- **Important**: "Wizard of Oz" is internal design inspiration ONLY - do NOT mention in customer-facing brand positioning

## System Architecture
The platform features a modern web stack designed for performance, scalability, and maintainability.

**UI/UX Decisions:**
- **Brand Identity**: "Enchanted Grit" combining whimsical enchantment with service-forged values.
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
- **Animations**: Framer Motion for scroll-triggered animations, parallax effects, and interactive transitions, with full prefers-reduced-motion support.

**Visual Enhancement Components (Phase 2):**
- **Interactive Components**:
  - AnimatedCounter: Scroll-triggered number animations with easing, reduced-motion support, and data-testid attributes
  - ImageComparison: Before/after slider with touch support and keyboard navigation
  - Lightbox/ImageGallery: Full-screen image viewer with keyboard controls and multi-image galleries
- **Visual Storytelling**:
  - GrowingProcessInfographic: 7-step cultivation journey visualization (Seed → Quality Control)
  - ServiceToSoilTimeline: Interactive veteran-to-cannabis-entrepreneur journey timeline
  - BuffaloMicroTerroirExplainer: Climate data visualization with interactive terroir factors and soil composition
- **Background Patterns & Textures**:
  - Cannabis leaf watermarks, military geometric patterns, topographic contours, and dots patterns
  - Organic section dividers: Wave, Mountain, Cloud, Leaf Flow, Angular, and Gradient Fade
- **Parallax & Depth Effects**:
  - ParallaxSection, ParallaxHero, and ParallaxLayers for multi-speed scroll effects
  - 7 gradient overlay types: Hero, Spotlight, Atmospheric, Vignette, Aurora, Mesh, and Striped
- **Product Components**:
  - InteractiveProductCard: 3D flip animation on hover, image cycling, strain-based color coding, and reduced-motion support

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

## Admin Dashboard Features

The admin dashboard (/admin) provides comprehensive site management for site owners without developer assistance:

**Tabs and Features:**
- **Brands**: CRUD management for brand listings with logos and descriptions
- **Products**: Product management with pricing, images, and brand associations
- **Subscribers**: Newsletter subscriber list with CSV export
- **Blog**: Full blog post management with draft/publish, categories, tags, and SEO fields
- **Homepage**: Edit homepage content (hero title, tagline, feature pillars, CTA buttons)
- **Media**: Upload and manage images with grid/list views and search
- **Users**: View registered users and manage admin roles
- **Settings**: Site-wide settings (business name, contact info, social links, hours)

**Interactive Tutorial System:**
- Step-by-step guided tour for new admins
- Progress tracking via localStorage
- Tooltips explaining each feature
- Can be restarted anytime via Help button

**Database Tables:**
- `site_settings`: Key-value store for configurable settings
- `media_items`: Tracks uploaded files (filename, url, mimeType, size)
- `blog_posts`: Blog content with draft/published states