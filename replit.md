# Battles Budz - Cannabis Business Website

## Overview

This is a full-stack web application for Battles Budz, a veteran-owned cannabis microbusiness in Gloversville, NY. The application serves as a marketing website with newsletter subscription and contact form functionality, built using modern web technologies with a focus on premium user experience and brand presentation.

## User Preferences

Preferred communication style: Simple, everyday language.

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
2. **Hero Section**: Full-screen landing with brand messaging
3. **Retail Section**: Product showcase with grid layout
4. **Services Section**: Vertically integrated business offerings
5. **About Section**: Founder story and company values
6. **Team Section**: Team member profiles
7. **Newsletter Section**: Email subscription with social media links
8. **Footer**: Contact information and site navigation

### Backend Services
1. **Newsletter Service**: Email subscription management with duplicate prevention
2. **Contact Service**: Contact form submission handling
3. **Storage Interface**: Abstracted storage layer supporting multiple implementations
4. **Validation**: Shared Zod schemas for data validation

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