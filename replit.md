# Battles Budz - Cannabis Business Website

## Overview
Battles Budz is a full-stack web application for a veteran-owned cannabis microbusiness. It functions as a premium cannabis tourism and retail website, featuring black and yellow branding. Key capabilities include event booking for a consumption lounge, product showcases (e.g., Cosmic Chewz, Freedom Fog Vapes), and a comprehensive educational content platform. The site is designed for both investor presentations, including a secure investor access control system, and consumer engagement as a tourism destination. The business vision is to establish a strong brand presence in the cannabis tourism market with a focus on education and premium experiences.

## User Preferences
Preferred communication style: Simple, everyday language.
Brand colors: Black and yellow only
Focus: Premium cannabis tourism experience for consumers and compelling investor presentation

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Routing**: Wouter
- **Styling**: Tailwind CSS with custom CSS variables, enhanced by shadcn/ui component library (built on Radix UI)
- **State Management**: TanStack Query (React Query)
- **Form Handling**: React Hook Form with Zod validation
- **UI/UX Decisions**: Utilizes a mobile-first approach with Tailwind breakpoints. Incorporates massive hero and card header logos (128px-256px mobile, up to 256px desktop) for strong branding. Custom gold and black theme applied via shadcn/ui. Typography uses Inter and Playfair Display fonts. Accessibility is ensured through ARIA labels and semantic HTML.

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful endpoints
- **Middleware**: Custom logging, JSON parsing, error handling
- **Development**: Hot module replacement via Vite integration

### Data Storage
- **ORM**: Drizzle ORM
- **Database**: PostgreSQL (configured for Neon serverless)
- **Schema**: Shared TypeScript schema definitions with Zod validation
- **Migrations**: Drizzle Kit for database schema management

### System Design Choices
- **Monorepo Structure**: Single repository with shared types and validation schemas.
- **Type Safety**: End-to-end TypeScript with shared interfaces.
- **Validation Strategy**: Single source of truth using Zod schemas.
- **Storage Abstraction**: Interface-based storage layer for flexibility.
- **Development Experience**: Hot reload and comprehensive error handling.
- **SEO Optimization**: Semantic HTML, meta tags, and accessibility features.

### Key Features
- **Secure Investor Access Control System**: Comprehensive investor access request system with admin approval, database schema for requests, admin panel, and email notifications. Tiered access restricts sensitive financial data to approved investors.
- **Nike-Style Branding**: Massive, bold logos and strategic placement for memorable brand recognition.
- **Business Document Integration**: Secure handling of legal documents with privacy controls.
- **Mobile Responsiveness**: Optimized layout and readability for mobile devices.
- **Font Readability**: Consistent text styling for improved contrast and accessibility.
- **Bidirectional Investor Messaging System**: Secure in-portal messaging with conversation history, status tracking, and admin reply system.
- **Consolidated Investor Portal**: Unified investor-related pages with tiered access control (public vs. authenticated).
- **Age Verification System**: 21+ age verification popup for legal compliance.
- **Social Media Integration**: Links to real business profiles on Instagram, Facebook, Twitter, and LinkedIn.
- **Legal Compliance**: Inclusion of official OCM microbusiness license number and updated business entity name.
- **Cannabis Tourism Education Platform**: Dedicated education page with searchable guides focusing on NY cannabis tourism, safety, and lounge etiquette.

## External Dependencies

### Frontend Dependencies
- **UI Framework**: React
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