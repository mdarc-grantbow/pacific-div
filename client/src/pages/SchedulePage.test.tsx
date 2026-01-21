import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import SchedulePage from './SchedulePage';
import { useAuthContext } from '@/hooks/useAuth';
import { useConference, useConferencesList } from '@/hooks/useConference';

// Use vi.hoisted to define mock data and mock functions
const { mockConference, mockUserProfile, mockSessions, mockUseQuery } = vi.hoisted(() => {
  const mockForumSession = {
    id: 'session-1',
    conferenceId: 'test-conference-2025',
    title: 'Test Forum Session',
    speaker: 'John Doe',
    speakerBio: 'A great speaker',
    abstract: 'An interesting topic',
    room: 'Room A',
    day: 'Saturday',
    startTime: '9:00 am',
    endTime: '10:00 am',
    category: 'forum',
    imageUrl: null,
  };
  const mockEventSession = {
    id: 'session-2',
    conferenceId: 'test-conference-2025',
    title: 'Test Event Session',
    speaker: 'Jane Smith',
    speakerBio: 'Another speaker',
    abstract: 'Another topic',
    room: 'Room B',
    day: 'Saturday',
    startTime: '10:00 am',
    endTime: '11:00 am',
    category: 'event',
    imageUrl: null,
  };
  return {
    mockSessions: { forums: [mockForumSession], events: [mockEventSession] },
    mockConference: {
      id: 'test-conference-2025',
      name: 'Test Conference',
      year: 2025,
      location: 'Test Marriott',
      startDate: '2025-10-10',
      endDate: '2025-10-12',
      slug: 'test-conference-2025',
      division: 'Test Division',
      isActive: true,
      gridSquare: 'CM87us',
      gps: '37.7629351,-121.9674592',
      locationAddress: '123 Test Street, Test City, CA 12345',
      logoUrl: 'https://example.com/logo.png',
      faviconUrl: '/favicon.ico',
      primaryColor: '#1e40af',
      accentColor: '#f97316',
    },
    mockUserProfile: {
      callSign: 'W1ABC',
      name: 'Test User',
      badgeNumber: '123',
      licenseClass: 'Extra',
      isRegistered: false,
    },
    mockUseQuery: vi.fn(() => ({
      isLoading: false,
      data: [],
      error: null,
    })),
  };
});

// Mock wouter
vi.mock('wouter', () => ({
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

// Mock the useConference hook
vi.mock('@/hooks/useConference', () => ({
  useConference: vi.fn(() => ({
    currentConference: mockConference,
    setCurrentConference: vi.fn(),
  })),
}));

// Mock the useAuth hook
vi.mock('@/hooks/useAuth', () => ({
  useAuthContext: vi.fn(() => ({
    isAuthenticated: false,
    isLoading: false,
    user: null,
  })),
}));

// Mock the toast hook
vi.mock('@/hooks/useToast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

// Mock DaySelector component
vi.mock('@/components/DaySelector', () => ({
  default: ({ selectedDay, onSelectDay }: any) => (
    <div data-testid="day-selector">
      Day Selector: {selectedDay}
    </div>
  ),
}));

// Mock the ConferenceSelector component
vi.mock('@/components/ConferenceSelector', () => ({
  ConferenceSelectorDialog: () => <div data-testid="conference-selector">Conference Selector</div>,
}));

// Mock TanStack Query
vi.mock('@tanstack/react-query', async (importOriginal) => {
  const actual = await importOriginal() as Record<string, unknown>;
  return {
    ...actual,
    useQuery: mockUseQuery,
    useMutation: vi.fn(() => ({
      mutate: vi.fn(),
      isLoading: false,
    })),
  };
});

// Configure default mock implementation for useQuery
mockUseQuery.mockImplementation(({ queryKey }: any) => {
  if (queryKey[0] === '/api/profile') {
    return {
      data: mockUserProfile,
      isLoading: false,
      error: null,
    };
  }
  // Handle session queries: ['/api/conferences', slug, 'sessions', category, day]
  if (queryKey[0] === '/api/conferences' && queryKey[2] === 'sessions') {
    const category = queryKey[3];
    if (category === 'forum') {
      return {
        data: mockSessions.forums,
        isLoading: false,
        error: null,
      };
    }
    if (category === 'event') {
      return {
        data: mockSessions.events,
        isLoading: false,
        error: null,
      };
    }
  }
  if (queryKey[0] === '/api/conferences') {
    return {
      data: [mockConference],
      isLoading: false,
      error: null,
    };
  }
  if (queryKey[0] === '/api/surveys') {
    return {
      data: [],
      isLoading: false,
      error: null,
    };
  }
  // Default: return empty bookmarks for /api/bookmarks query
  return {
    data: [],
    isLoading: false,
    error: null,
  };
});

// Mock queryClient
vi.mock('@/lib/queryClient', () => ({
  apiRequest: vi.fn(),
  queryClient: {
    invalidateQueries: vi.fn(),
  },
}));

describe('SchedulePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the schedule page correctly', () => {
    render(<SchedulePage />);

    expect(screen.getByText('Schedule')).toBeInTheDocument();
    expect(screen.getByTestId('button-notifications')).toBeInTheDocument();
    expect(screen.getByTestId('conference-selector')).toBeInTheDocument();
  });

  it('displays search input', () => {
    render(<SchedulePage />);

    const searchInput = screen.getByTestId('input-search');
    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toHaveAttribute('placeholder', 'Search forums, events...');
  });

  it('displays day selector', () => {
    render(<SchedulePage />);

    expect(screen.getByTestId('day-selector')).toBeInTheDocument();
  });

  it('displays all three tabs', () => {
    render(<SchedulePage />);

    expect(screen.getByTestId('tab-all')).toBeInTheDocument();
    expect(screen.getByTestId('tab-forums')).toBeInTheDocument();
    expect(screen.getByTestId('tab-events')).toBeInTheDocument();
  });

  it('displays tab labels correctly', () => {
    render(<SchedulePage />);

    expect(screen.getByTestId('tab-all')).toHaveTextContent('All');
    expect(screen.getByTestId('tab-forums')).toHaveTextContent('Forums');
    expect(screen.getByTestId('tab-events')).toHaveTextContent('Events');
  });

  it('handles missing conference gracefully', () => {
    vi.mocked(useConference).mockReturnValue({
      currentConference: null,
      setCurrentConference: vi.fn(),
    });

    render(<SchedulePage />);

    // Should still render without crashing
    expect(screen.getByText('Schedule')).toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const { asFragment } = render(<SchedulePage />);
    expect(asFragment()).toMatchSnapshot();
  });
});

describe('SchedulePage with custom conference', () => {
  it('displays custom conference data', () => {
    const customConference = {
      ...mockConference,
      name: 'Custom Conference',
      year: 2026,
      slug: 'custom-conference-2026',
    };

    vi.mocked(useConference).mockReturnValue({
      currentConference: customConference,
      setCurrentConference: vi.fn(),
    });

    render(<SchedulePage />);

    // Page should render with custom conference
    expect(screen.getByText('Schedule')).toBeInTheDocument();
  });
});

describe('SchedulePage with authenticated user', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useAuthContext).mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      user: mockUserProfile,
    });
  });

  it('renders correctly when authenticated', () => {
    render(<SchedulePage />);

    expect(screen.getByText('Schedule')).toBeInTheDocument();
    expect(screen.getByTestId('input-search')).toBeInTheDocument();
  });
});