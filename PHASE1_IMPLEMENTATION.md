# Phase 1 Implementation: Multi-Conference Support

## Overview
Phase 1 enables a single deployment to support multiple conferences while maintaining backward compatibility with existing API endpoints.

## Database Changes

### New Table: `conferences`
```sql
CREATE TABLE conferences (
  id VARCHAR PRIMARY KEY,
  name TEXT NOT NULL,
  year INTEGER NOT NULL,
  location TEXT NOT NULL,
  startDate TIMESTAMP NOT NULL,
  endDate TIMESTAMP NOT NULL,
  slug VARCHAR UNIQUE NOT NULL,
  isActive BOOLEAN DEFAULT true,
  createdAt TIMESTAMP DEFAULT NOW()
);
```

### Updated Tables
The following tables now include a `conferenceId` foreign key:
- **sessions** - Associates sessions with specific conferences
- **vendors** - Associates vendors with specific conferences  
- **doorPrizes** - Associates prizes with specific conferences
- **bookmarks** - Scopes user bookmarks per conference

## Backend Changes

### New API Endpoints

#### Conferences
- `GET /api/conferences` - List all active conferences
- `GET /api/conferences/:slug` - Get conference details by slug

#### Conference-Scoped Endpoints
- `GET /api/conferences/:conferenceSlug/sessions` - Sessions for a specific conference
- `GET /api/conferences/:conferenceSlug/vendors` - Vendors for a specific conference
- `GET /api/conferences/:conferenceSlug/door-prizes` - Door prizes for a specific conference

#### Backward Compatible Endpoints
- `GET /api/sessions` - Still works (returns all sessions)
- `GET /api/vendors` - Still works (returns all vendors)
- `GET /api/door-prizes` - Still works (returns all prizes)

### Storage Layer Updates
All database methods now support optional `conferenceId` filtering:
- `getSessions(conferenceId?: string)`
- `getVendors(conferenceId?: string)`
- `getDoorPrizes(conferenceId?: string)`
- `getUserBookmarks(userId: string, conferenceId?: string)`
- `addBookmark(userId, conferenceId, sessionId)`
- `removeBookmark(userId, conferenceId, sessionId)`

New methods for conference management:
- `getConferences()` - Get all active conferences
- `getConferenceBySlug(slug)` - Get conference by slug
- `createConference(conference)` - Create a new conference

### Database Seeding
The seed function now:
1. Creates a default "Pacificon 2025" conference
2. Associates all existing sessions, vendors, and prizes with this conference
3. Allows adding more conferences later

## Frontend Changes

### New Context: ConferenceContext
File: [client/src/hooks/useConference.ts](client/src/hooks/useConference.ts)
- Stores the currently selected conference
- Provides `useConference()` hook for accessing conference data throughout the app
- Conference selection persists in localStorage

### New Component: ConferenceSelector
File: [client/src/components/ConferenceSelector.tsx](client/src/components/ConferenceSelector.tsx)
- Displays available conferences on app startup
- Fetches list from `/api/conferences`
- Allows user to select which conference to view
- Shows conference name, dates, and location

### Updated App.tsx
Changes to [client/src/App.tsx](client/src/App.tsx):
1. Added `ConferenceContext.Provider` wrapper
2. Added conference selection logic (shows selector if no conference selected)
3. Stores selected conference in localStorage for persistence
4. ConferenceContext available to all child components

## User Experience Flow

1. **First Visit**: User sees ConferenceSelector with all active conferences
2. **Conference Selection**: User taps a conference card to select it
3. **Persistent Selection**: Selected conference saved to localStorage
4. **Conference Change**: Add a "Change Conference" button in LandingPage or profile to return to selector
5. **App Navigation**: All pages now work within selected conference context

## Migration Guide

### For Existing Data
1. Run database migration to add new columns and tables
2. Existing data remains accessible via backward-compatible endpoints
3. Run seed function to assign all data to "Pacificon 2025" conference

### For Frontend Integration
Pages need to be updated to:
1. Import and use `useConference()` hook
2. Update API calls to include conference ID when needed
3. Example:
```typescript
const { currentConference } = useConference();

// Option 1: Use conference-scoped endpoint
const response = await fetch(`/api/conferences/${currentConference.slug}/sessions`);

// Option 2: Use legacy endpoint (works for all conferences)
const response = await fetch(`/api/sessions`);
```

## Next Steps (Phase 2)

Future phases can add:
- Conference-specific branding and styling
- URL routing with conference slugs (e.g., `/pacificon-2025/schedule`)
- Cross-conference user attendance tracking
- Conference administration dashboard
- Separate deployments per conference
