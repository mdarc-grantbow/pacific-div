# Pacificon 2025 Attendee App

A mobile-first conference companion application designed for amateur radio operators attending the Pacificon conference (October 10-12, 2025) at the San Ramon Marriott.

## Features

- **Schedule Browser** - View forums and events organized by day with search functionality
- **Session Bookmarking** - Save sessions to your personal schedule (requires login)
- **Venue Maps** - Navigate the conference venue
- **Vendor Information** - Browse exhibitors and booth locations
- **Prize Announcements** - Stay updated on door prizes and drawings
- **T-Hunting Schedule** - Transmitter hunting event details and winners
- **Radio Contact Details** - Frequency information and technical specs
- **User Profiles** - Manage your ham radio operator information
- **Surveys** - Provide feedback on your conference experience

## Guest Mode

Browse Schedule, Map, Info, and Prizes pages without logging in. Bookmarking, Profile, and Survey features require authentication via Replit Auth.

## Tech Stack

### Frontend
- React with TypeScript
- Vite build tool
- Wouter for client-side routing
- TanStack Query for server state management
- Radix UI + shadcn/ui components
- Tailwind CSS with dark mode support

### Backend
- Express.js with TypeScript
- PostgreSQL database (Neon serverless)
- Drizzle ORM for type-safe database queries
- Replit Auth (OpenID Connect) supporting Google, GitHub, X, Apple, and email login

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   - `DATABASE_URL` - PostgreSQL connection string
   - `SESSION_SECRET` - Secret for session encryption
4. Push database schema:
   ```bash
   npm run db:push
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

The app will be available at `http://localhost:5000`

## Project Structure

```
client/
  src/
    components/     # UI components (BottomNav, ThemeToggle, etc.)
    pages/          # Route pages (Schedule, Map, Info, Prizes, Profile)
    hooks/          # Custom hooks (useAuth, useToast)
    lib/            # Utility functions and API client
    App.tsx         # Main app with routing
server/
  index.ts          # Server entry point
  routes.ts         # API endpoints
  storage.ts        # Database operations (DatabaseStorage)
  db.ts             # Database connection
  dbUtils.ts        # Database utilities with retry logic
  replitAuth.ts     # Replit Auth configuration
shared/
  schema.ts         # Drizzle schema and TypeScript types
```

## API Endpoints

### Public
- `GET /api/sessions` - Conference sessions
- `GET /api/sessions/:id` - Single session details
- `GET /api/vendors` - Vendor information
- `GET /api/vendors/:id` - Single vendor details
- `GET /api/door-prizes` - Prize listings
- `GET /api/thunting/schedule` - T-Hunting schedule
- `GET /api/thunting/winners` - T-Hunting winners
- `GET /api/radio-contacts` - Radio frequency contacts
- `GET /api/venue-info` - Venue information
- `GET /api/health` - Health check

### Authenticated
- `GET /api/auth/user` - Current user info
- `GET /api/bookmarks` - User bookmarks
- `POST /api/bookmarks/:sessionId` - Add bookmark
- `DELETE /api/bookmarks/:sessionId` - Remove bookmark
- `GET /api/profile` - User profile
- `GET /api/surveys` - User survey responses
- `POST /api/surveys/:surveyType` - Submit survey
- `GET /api/surveys/:surveyType/status` - Check survey completion

## License

This project is for the Pacificon amateur radio conference.
