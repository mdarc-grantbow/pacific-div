# Pacificon 2025 Attendee App

## Overview

The Pacificon 2025 Attendee App is a mobile-first conference companion application designed for amateur radio operators attending the Pacificon conference. The app provides essential conference information including session schedules, venue maps, vendor information, prize announcements, and user profiles. Built with a focus on information density and efficient navigation, it serves as a comprehensive guide for conference attendees to manage their experience.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript using Vite as the build tool

**Routing**: Wouter for lightweight client-side routing with five main routes:
- Schedule (`/`)
- Map (`/map`)
- Info (`/info`)
- Prizes (`/prizes`)
- Profile (`/profile`)

**State Management**: TanStack Query (React Query) for server state management with optimistic updates and automatic cache invalidation

**UI Component Library**: Radix UI primitives with shadcn/ui styling system
- Design system follows Material Design principles adapted for mobile
- Typography uses Roboto and Roboto Mono from Google Fonts
- Tailwind CSS with custom theme configuration for consistent spacing and colors
- Dark mode support with localStorage persistence

**Navigation Pattern**: Fixed bottom tab navigation for primary app sections, optimized for one-handed mobile use

**Design Principles**:
- Mobile-first responsive design
- Information-dense layouts with clear visual hierarchy
- Tab-based navigation for content organization
- Sticky headers for context retention

### Backend Architecture

**Server Framework**: Express.js with TypeScript running on Node.js

**Architecture Pattern**: RESTful API with PostgreSQL database (DatabaseStorage class) serving as the data layer

**API Endpoints**:
- Authentication: `/api/login`, `/api/logout`, `/api/callback`, `/api/auth/user`
- Sessions: `/api/sessions`, `/api/sessions/:id`
- Vendors: `/api/vendors`, `/api/vendors/:id`
- Door Prizes: `/api/door-prizes`
- T-Hunting: `/api/thunting/schedule`, `/api/thunting/winners`
- User Data: `/api/profile`, `/api/bookmarks`, `/api/survey-responses` (protected)
- Venue Information: `/api/radio-contacts`, `/api/venue-info`

**Development Setup**: Vite middleware integration for HMR in development with static file serving in production

**Data Models**:
- User profiles with amateur radio call signs and license information
- Conference sessions with scheduling, speaker, and category data
- Each conference has its own timezone field - all dates and times throughout the app are displayed in the conference's local timezone (not the user's timezone)

**Timezone Handling**:
- Conference dates/times are stored in UTC in the database
- The `timezone` field on each conference (e.g., 'America/Los_Angeles') determines how dates are displayed
- Use `formatDateInTimezone()` and `formatDateRangeInTimezone()` utilities from `client/src/lib/dateUtils.ts` for consistent date formatting
- This ensures attendees see correct local times regardless of their device's timezone setting
- Vendor booth information
- Prize tracking and claiming
- Radio contact frequencies and technical specifications
- Survey responses and user preferences
- Session bookmarking functionality

### External Dependencies

**Database**: PostgreSQL via Neon serverless driver (@neondatabase/serverless)
- Drizzle ORM for type-safe database queries and migrations
- Schema-first approach with Zod validation integration
- Connection pooling for serverless environments

**UI Libraries**:
- Radix UI for accessible component primitives
- Lucide React for consistent iconography
- date-fns for date manipulation
- embla-carousel-react for carousels
- cmdk for command palette functionality
- class-variance-authority and clsx for dynamic styling

**Form Management**: React Hook Form with Zod resolver for validation

**Styling**: 
- Tailwind CSS for utility-first styling
- PostCSS with Autoprefixer for browser compatibility
- Custom CSS variables for theming

**Build Tools**:
- Vite for fast development and optimized production builds
- esbuild for server bundling
- TypeScript for type safety across the stack

**Session Management**: connect-pg-simple for PostgreSQL-backed sessions stored in auth_sessions table

**Authentication**: Replit Auth via OpenID Connect (OIDC)
- Supports Google, GitHub, X, Apple, and email/password login
- Server-side session management with PostgreSQL storage
- Protected routes use isAuthenticated middleware
- Client-side useAuth hook and AuthContext for authentication state

**Guest Mode**:
- Users can browse Schedule, Map, Info, and Prizes pages without logging in
- Bookmarking, Profile, and Survey features require authentication
- Bottom navigation shows "Log In" button for guests (instead of Profile)
- Clicking bookmark as guest shows friendly "Login required" toast
- Profile page shows login prompt with dark mode toggle for guests
- API queries for user-specific data are conditionally disabled when not authenticated

**Development Tools**:
- Replit-specific plugins for cartographer and dev banner
- Runtime error modal for better debugging

**Fonts**: Google Fonts CDN for Roboto and Roboto Mono font families

**Database Implementation Notes**:
- The application uses Drizzle ORM with Neon PostgreSQL for persistent data storage
- DatabaseStorage class implements the IStorage interface with all CRUD operations
- Database seeding runs automatically when the sessions table is empty
- Bookmark uniqueness is enforced at the application level with existence checks before insert
- Survey responses use database-generated UUIDs
- auth_sessions table stores authentication sessions for Replit Auth
- Users table includes both Replit Auth fields (email, firstName, lastName, profileImageUrl) and ham radio profile fields (callSign, badgeNumber, licenseClass)

**Error Handling**:
- Database operations wrapped with retry logic (3 attempts with exponential backoff)
- Connection errors detected and classified for appropriate HTTP responses
- API routes return 503 status with retryable flag for temporary database unavailability
- Auth flow continues gracefully if user upsert fails (non-fatal)
- Health check endpoint (/api/health) reports database connection status
- Server startup handles auth and seeding failures without crashing