# Last-Mile Delivery Intelligence Platform

## Overview

An AI-powered delivery optimization platform designed for last-mile logistics operations. The system provides real-time ETA predictions, delivery anomaly detection, and operational intelligence for quick commerce platforms, courier services, and logistics providers. Built with a focus on data clarity and operational efficiency, the platform enables delivery teams to reduce failed deliveries, improve on-time rates, and make data-driven decisions through real-time monitoring and predictive analytics.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- **Framework:** React 18 with TypeScript
- **Routing:** Wouter (lightweight client-side routing)
- **State Management:** TanStack Query (React Query) for server state
- **UI Framework:** Shadcn/ui components built on Radix UI primitives
- **Styling:** Tailwind CSS with custom design system
- **Build Tool:** Vite

**Design Philosophy:**
The frontend follows a professional data dashboard approach inspired by Linear, Vercel, and Stripe dashboards. The design prioritizes clarity over decoration with zero decorative elements - no gradients, no emojis, no unnecessary visual flourish. Every pixel serves a functional purpose for mission-critical operations.

**Key Design Decisions:**
- Light/dark mode support with HSL-based color system
- Professional color palette optimized for data visibility
- Status-driven color coding (success: green, warning: amber, error: red, info: blue)
- Typography: Inter font family with specific weights for hierarchy
- Responsive design with mobile breakpoint at 768px

**Component Architecture:**
- Reusable UI components in `/client/src/components/ui/` (Shadcn components)
- Feature components in `/client/src/components/` (AlertCard, CourierCard, DeliveryMap, etc.)
- Page-level components in `/client/src/pages/` (Dashboard, Analytics, Couriers, Tracking)
- Custom hooks in `/client/src/hooks/`

### Backend Architecture

**Technology Stack:**
- **Runtime:** Node.js with TypeScript
- **Framework:** Express.js
- **Database ORM:** Drizzle ORM
- **Database:** PostgreSQL (via Neon serverless)
- **Build Tool:** esbuild for production, tsx for development

**API Structure:**
RESTful API with resource-based endpoints:
- `/api/couriers` - Courier management
- `/api/deliveries` - Delivery operations
- `/api/anomalies` - Anomaly detection and alerts
- `/api/zones` - Geographic zone management
- `/api/metrics` - Performance metrics
- `/api/eta-predictions` - ETA prediction data

**Data Layer:**
- Type-safe schema definitions in `/shared/schema.ts` using Drizzle ORM
- Zod validation schemas generated from Drizzle schemas
- Storage abstraction layer in `/server/storage.ts`
- Shared types between frontend and backend via `/shared` directory

### Database Schema

**Core Entities:**
1. **Users** - Authentication and user management
2. **Couriers** - Delivery personnel with GPS location, status, and performance metrics
3. **Deliveries** - Order tracking with customer info, addresses, ETA, and status
4. **Anomalies** - Delivery exceptions and alerts with severity levels and resolution tracking
5. **Zones** - Geographic areas for delay hotspot analysis
6. **Performance Metrics** - Historical performance data for analytics
7. **ETA Predictions** - AI-powered delivery time predictions with confidence scores

**Key Schema Decisions:**
- UUID-based primary keys for scalability
- Real numbers for GPS coordinates (lat/lng)
- Text-based status fields for flexibility
- Timestamp tracking for delivery events
- Normalized zone data for geographic analysis

### Real-time Features

**Map Integration:**
- Mapbox GL JS for interactive maps
- Real-time courier location visualization
- Route tracking and deviation detection
- Geographic zone overlay for hotspot analysis

**Data Updates:**
- React Query with configurable refetch intervals
- Optimistic updates for better UX
- Error boundary handling
- Toast notifications for user feedback

## External Dependencies

### Third-Party Services

**Mapbox:**
- **Purpose:** Interactive mapping and geolocation services
- **Usage:** Courier tracking, route visualization, delivery zone mapping
- **Configuration:** Requires `VITE_MAPBOX_TOKEN` environment variable

**Neon Database:**
- **Purpose:** Serverless PostgreSQL database
- **Usage:** Primary data storage for all application data
- **Configuration:** Requires `DATABASE_URL` environment variable

### Key npm Packages

**UI & Styling:**
- `@radix-ui/*` - Accessible UI primitives (20+ components)
- `tailwindcss` - Utility-first CSS framework
- `class-variance-authority` - Component variant management
- `lucide-react` - Icon library

**Data & State Management:**
- `@tanstack/react-query` - Server state management
- `drizzle-orm` - TypeScript ORM
- `@neondatabase/serverless` - Neon database driver
- `zod` - Schema validation
- `react-hook-form` - Form state management

**Charting & Visualization:**
- `recharts` - Data visualization library
- `mapbox-gl` - Map rendering

**Development Tools:**
- `vite` - Build tool and dev server
- `typescript` - Type safety
- `tsx` - TypeScript execution
- `esbuild` - Production bundler

### Environment Variables

Required configuration:
- `DATABASE_URL` - PostgreSQL connection string
- `VITE_MAPBOX_TOKEN` - Mapbox API access token
- `NODE_ENV` - Environment mode (development/production)

### Build & Deployment

**Development:**
- Frontend: Vite dev server with HMR
- Backend: tsx with automatic restart
- Database: Drizzle Kit for schema management

**Production:**
- Frontend: Static build to `dist/public`
- Backend: ESM bundle to `dist/index.js`
- Single server serves both static assets and API