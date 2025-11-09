# Pacificon Attendee App Design Guidelines

## Design Approach
**Selected System:** Material Design adapted for mobile-first conference navigation
**Rationale:** Information-dense utility app requiring clear hierarchy, efficient navigation, and practical functionality for technical users (ham radio operators) accessing schedules, frequencies, and real-time updates on-the-go.

## Core Design Principles
- Mobile-first optimization for one-handed conference navigation
- Information density with clear visual hierarchy
- Quick access patterns for time-sensitive content (schedules, notifications, frequencies)
- Tab-based navigation for major sections

## Typography
**Font Family:** Roboto (via Google Fonts CDN)
- **Headers:** Roboto Medium (500) - 24px (h1), 20px (h2), 18px (h3)
- **Body Text:** Roboto Regular (400) - 16px
- **Labels/Meta:** Roboto Regular (400) - 14px
- **Frequency/Technical Data:** Roboto Mono Regular - 14px (for radio frequencies, call signs)
- **Line Height:** 1.5 for body, 1.2 for headers

## Layout System
**Spacing Units:** Tailwind spacing of 2, 4, 6, and 8 (as in p-2, m-4, gap-6, py-8)
- Card padding: p-4 or p-6
- Section spacing: py-8 or py-12
- Component gaps: gap-4 or gap-6
- Icon-text spacing: gap-2

**Container Strategy:**
- Mobile: Full-width with px-4 padding
- Max-width: max-w-4xl for optimal readability
- Bottom navigation bar: Fixed position with safe area padding

## Navigation Architecture

**Bottom Tab Bar (Fixed):**
- Schedule | Map | Info | Prizes | Profile
- Icons from Heroicons (outline style)
- Active state with filled icons and indicator
- Height: 16 units with safe area consideration

**Top App Bar:**
- Conference logo/name left-aligned
- Search icon and notification bell right-aligned
- Sticky positioning for context retention

## Component Library

### Schedule Components
**Day Selector Tabs:** Horizontal scrollable chips (Friday/Saturday/Sunday)
**Session Cards:**
- Time badge (left-aligned, prominent)
- Session title (bold, 18px)
- Speaker name and room location (14px, subdued)
- Bookmark icon (top-right corner)
- Tap area: Full card
- Border-left accent for bookmarked sessions

### Prize Winner Components
**Winner Announcement Card:**
- Badge number/Call sign (large, prominent)
- Prize description
- Timestamp
- Animated entry for new winners
- "Claimed" status indicator

**Notification Banner:**
- Full-width, top-positioned
- Celebratory message for winners
- Dismiss button
- Slide-down animation

### T-Hunting Components
**Schedule List:**
- Start time and location
- Hunt number/identifier
- Difficulty level badge
- Registration status indicator

**Leaderboard:**
- Rank number (large)
- Call sign
- Completion time
- Prize indicator for winners

### Essential Info Sections
**Radio Contact Cards:**
- Frequency (large, monospace font)
- Label (Talk-in/Simplex/QRP)
- Additional notes (offset, CTCSS, etc.)
- Copy-to-clipboard action

**Venue Info Cards:**
- Icon + heading
- Address/details with map link
- Hours/schedule information

### Map Component
**Interactive Venue Map:**
- SVG-based floor plan
- Labeled zones (Registration, Forums, Vendors, W1AW/6 Station)
- Legend with icons
- Pinch-to-zoom enabled
- "You are here" indicator option

### Vendor Directory
**Vendor Cards (Grid):**
- Vendor name
- Booth number badge
- Category tags
- Brief description
- Tap to expand for full details

### Search Interface
**Search Bar:**
- Prominent at top of relevant screens
- Placeholder: "Search sessions, speakers, vendors..."
- Filter chips below (Sessions/Speakers/Vendors/All)
- Results as cards matching respective types

## Spacing & Layout Patterns

**Card Layouts:**
- Consistent rounded corners: rounded-lg
- Shadow: shadow-md for elevation
- Internal padding: p-4 or p-6
- Card-to-card spacing: gap-4 in vertical lists

**List Items:**
- Dividers between items (1px, subtle)
- Minimum tap target: 44px height
- Left-aligned primary content
- Right-aligned metadata/actions

## Interactive Elements

**Buttons:**
- Primary: Filled, rounded-lg, px-6 py-3
- Secondary: Outlined, same sizing
- Icon buttons: 40px × 40px tap area
- No custom hover states (system handles)

**Status Indicators:**
- Badges: Small rounded-full pills
- Dots: 8px circles for live/active states
- Border accents: 4px left border for highlights

## Notification System
- Push notification permission prompt on first launch
- In-app notification center accessible from bell icon
- Badge count on bell icon
- Notification types: Door prizes, T-hunting updates, schedule changes

## Images
No large hero image required. This is a utility app focused on functional design.

**Icon Usage:**
- Heroicons (outline for inactive, solid for active states)
- 24px standard size, 20px for compact contexts
- Conference logo in top bar (height: 32px)

## Special Considerations
- Offline capability messaging for schedule viewing
- Real-time update indicators for prize announcements
- Quick access floating action button for "My Schedule"
- Accessible contrast ratios for outdoor readability
- Large tap targets for ease of use while walking