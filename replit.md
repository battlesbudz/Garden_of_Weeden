# Battles Budz - Cannabis Business Website

## Overview

This is a full-stack web application for Battles Budz, a veteran-owned cannabis microbusiness in Gloversville, NY. The application serves as a premium cannabis tourism and retail website featuring black and yellow branding, event booking for the consumption lounge, product showcase including Cosmic Chewz and Freedom Fog Vapes, and comprehensive educational content platform. Built for both investor presentations and consumer engagement as a tourism destination.

## Recent Changes (July 16, 2025)

- ✓ **COMPLETED: Consolidated Investor Portal System with Tiered Access**
  - Unified all investor-related pages into single investor-portal with proper tiered access control
  - Removed duplicate investor pages (/investors now redirects to /investor-portal)
  - Implemented public access (overview, about, media tabs) vs authenticated access (dashboard, documents, financials, updates)
  - Fixed tab overlap issues and duplicate content sections
  - Added modal login system for seamless authentication flow
  - Professional black and gold design with responsive layout for all device types
  - Improved text visibility and contrast for better readability on dark backgrounds
  - Both /investors and /investor-portal routes use same component with proper tiered access control

## Previous Changes (July 14, 2025)

- ✓ **COMPLETED: Interactive User Guide & Age Verification System**
  - Implemented simple 21+ age verification popup (NY law compliance) with yes/no buttons
  - Created comprehensive quick start modal with scrollable content and proper navigation
  - Added interactive tour system with step-by-step highlights of key features
  - Integrated persistent help button for ongoing user support and guide access
  - Fixed navigation issues: quick start properly closes, "Book Experience" scrolls to events section
  - Age verification goes directly to homepage instead of forcing quick start
- ✓ **COMPLETED: Social Media Integration**
  - Added real Instagram link (@battles_budz)
  - Connected Facebook business profile
  - Integrated Twitter (@BattlesBudz) and LinkedIn (Justin Battles) profiles
  - All social links open in new tabs with proper security attributes
- ✓ **COMPLETED: Legal Compliance Updates**
  - Added official OCM microbusiness license number (OCMMICR-2023-000258) to footer disclaimer
  - Updated business entity name to "Battles Budz LLC" for legal accuracy
  - Enhanced legal disclaimer with proper license classification
- ✓ **COMPLETED: Gamified User Engagement System**
  - Built complete points and achievements system with database backend
  - Created interactive UI components for user stats, achievements panel, and leaderboards
  - Added "Rewards" tab to community page with full gamification features
  - Integrated automatic point rewards for forum participation (posts, comments, likes)
- ✓ Fixed CSV export and resume download functionality in admin portal using server-side endpoints
- ✓ Resolved browser security restrictions that were blocking client-side downloads  
- ✓ Cleaned database of test data while preserving legitimate business data
- ✓ Enhanced admin dashboard with working download features for both CSV exports and resume files
- ✓ **NEW: Developed comprehensive cannabis tourism education platform**
  - Created dedicated education page (/education) with searchable guides and categories
  - Enhanced education section on homepage with tourism-focused content
  - Added navigation links for education platform access
  - Focused content on New York cannabis tourism, safety, legal guidelines, and consumption lounge etiquette
- ✓ **URGENT FIXES COMPLETED:**
  - Updated ALL contact information site-wide to real business details (battlesbudz@gmail.com, 904-415-7635)
  - Fixed education center guide links to use email contact system instead of broken placeholder links
  - Fixed "Book your experience" links on education page to properly navigate to events section
  - Connected education guides to real contact method via email requests

## User Preferences

Preferred communication style: Simple, everyday language.
Brand colors: Black and yellow only
Focus: Premium cannabis tourism experience for consumers and compelling investor presentation

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized production builds
- **Routing**: Wouter for lightweight client-side routing
- **Styling**: Tailwind CSS with custom CSS variables for brand colors
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **State Management**: TanStack Query (React Query) for server state management
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful endpoints for newsletter and contact submissions
- **Middleware**: Custom logging, JSON parsing, and error handling
- **Development**: Hot module replacement via Vite integration

### Data Storage
- **ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (configured for Neon serverless)
- **Schema**: Shared TypeScript schema definitions with Zod validation
- **Development Storage**: In-memory storage implementation for development
- **Migrations**: Drizzle Kit for database schema management

## Key Components

### Frontend Components
1. **Navigation**: Fixed navigation with smooth scrolling and mobile menu
2. **Hero Section**: Full-screen landing with brand messaging and authentic founder story
3. **Retail Section**: Product showcase featuring actual products (Cosmic Chewz, Freedom Fog Vapes, Battle Brew Sweet Tea, Heirloom Flower)
4. **Services Section**: Vertically integrated business offerings
5. **About Section**: Authentic founder story based on Justin's actual military and cannabis journey
6. **Team Section**: Justin and Andrea profiles with accurate backgrounds
7. **Events Section**: Premium lounge event booking system with forms for private tastings, educational workshops, and group tours
8. **Education Section**: Cannabis education blog content and resource categories
9. **Newsletter Section**: Email subscription with social media links
10. **Footer**: Contact information and site navigation

### Backend Services
1. **Newsletter Service**: Email subscription management with duplicate prevention
2. **Contact Service**: Contact form submission handling
3. **Event Booking Service**: Premium lounge event booking with comprehensive form validation
4. **Storage Interface**: Abstracted storage layer supporting multiple implementations
5. **Validation**: Shared Zod schemas for data validation including event bookings

### UI System
- **Design System**: shadcn/ui with custom Battles Budz branding (gold and black theme)
- **Typography**: Inter and Playfair Display fonts
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints
- **Accessibility**: ARIA labels and semantic HTML throughout

## Data Flow

1. **Client Interactions**: Users interact with React components
2. **Form Submissions**: React Hook Form handles validation using Zod schemas
3. **API Calls**: TanStack Query manages HTTP requests to Express endpoints
4. **Server Processing**: Express routes validate data and call storage methods
5. **Data Persistence**: Storage layer abstracts database operations
6. **Response Handling**: Success/error states managed by React Query and toast notifications

## External Dependencies

### Frontend Dependencies
- **UI Framework**: React, React DOM
- **Routing**: wouter
- **State Management**: @tanstack/react-query
- **Form Handling**: react-hook-form, @hookform/resolvers
- **Validation**: zod, drizzle-zod
- **UI Components**: @radix-ui/* components, lucide-react icons
- **Styling**: tailwindcss, class-variance-authority, clsx
- **Date Handling**: date-fns

### Backend Dependencies
- **Server**: express
- **Database**: drizzle-orm, @neondatabase/serverless
- **Session**: connect-pg-simple
- **Utilities**: nanoid

### Development Dependencies
- **Build Tools**: vite, @vitejs/plugin-react, esbuild
- **TypeScript**: tsx for development execution
- **Database Tools**: drizzle-kit
- **Linting/Formatting**: Standard TypeScript configuration

## Deployment Strategy

### Development
- **Local Development**: Vite dev server with Express backend
- **Hot Reload**: Vite HMR for frontend, tsx watch mode for backend
- **Environment**: NODE_ENV=development with comprehensive logging

### Production Build
- **Frontend**: Vite builds optimized static assets to `dist/public`
- **Backend**: esbuild bundles server code to `dist/index.js`
- **Assets**: Static files served by Express in production
- **Environment Variables**: DATABASE_URL required for PostgreSQL connection

### Database Setup
- **Schema Management**: Drizzle migrations in `./migrations` directory
- **Schema Push**: `npm run db:push` for development schema updates
- **Configuration**: `drizzle.config.ts` with PostgreSQL dialect

### Architecture Decisions

1. **Monorepo Structure**: Single repository with shared types and validation schemas
2. **Type Safety**: End-to-end TypeScript with shared interfaces
3. **Validation Strategy**: Single source of truth using Zod schemas
4. **Storage Abstraction**: Interface-based storage layer for flexibility
5. **Development Experience**: Hot reload and comprehensive error handling
6. **Brand Focus**: Custom CSS variables and component styling for cannabis industry branding
7. **SEO Optimization**: Semantic HTML, meta tags, and accessibility features