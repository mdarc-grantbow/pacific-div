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
- Sessions: `/api/sessions`, `/api/sessions/:id`
- Vendors: `/api/vendors`, `/api/vendors/:id`
- Door Prizes: `/api/door-prizes`
- T-Hunting: `/api/thunting/schedule`, `/api/thunting/winners`
- User Data: `/api/profile`, `/api/bookmarks`, `/api/survey-responses`
- Venue Information: `/api/radio-contacts`, `/api/venue-info`

**Development Setup**: Vite middleware integration for HMR in development with static file serving in production

**Data Models**:
- User profiles with amateur radio call signs and license information
- Conference sessions with scheduling, speaker, and category data
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

**Session Management**: connect-pg-simple for PostgreSQL-backed sessions (though current implementation uses in-memory storage)

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