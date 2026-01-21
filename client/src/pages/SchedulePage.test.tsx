import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import SchedulePage from './SchedulePage';
import { useAuthContext } from '@/hooks/useAuth';
import { useConference, useConferencesList } from '@/hooks/useConference';

// Use vi.hoisted to define mock data
const { mockConference, mockUserProfile } = vi.hoisted(() => {
  return {
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
      id: '1',
      firstName: 'test',
      lastName: 'user',
      email: 'test@example.com',
      callSign: 'W1ABC',
      badgeNumber: '123',
      licenseClass: 'Extra',
      isRegistered: false,
      profileImageUrl: null,
      createdAt: null,
      updatedAt: null,
    },
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
vi.mock('@/hooks/use-toast', () => ({
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
  const actual = await importOriginal();
  return {
    ...actual,
    useMutation: vi.fn(() => ({
      mutate: vi.fn(),
      isLoading: false,
    })),
  };
});

const { useQuery } = require('@tanstack/react-query');
vi.mocked(useQuery).mockImplementation(({ queryKey }: any) => {
  if (queryKey[0] === '/api/profile') {
    return {
      data: mockUserProfile,
      isLoading: false,
      error: null,
    };
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

    expect(screen.getByText('All')).toBeInTheDocument();
    expect(screen.getByText('Forums')).toBeInTheDocument();
    expect(screen.getByText('Events')).toBeInTheDocument();
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