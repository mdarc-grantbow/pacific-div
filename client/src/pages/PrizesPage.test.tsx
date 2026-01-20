import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import PrizesPage from './PrizesPage';

// Mock the toast hook
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toasts: [],
    toast: vi.fn(),
    dismiss: vi.fn(),
  }),
}));

// Use vi.hoisted to define mock data
const { mockConference } = vi.hoisted(() => {
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

// Mock the ConferenceSelector component
vi.mock('@/components/ConferenceSelector', () => ({
  ConferenceSelectorDialog: () => <div data-testid="conference-selector">Conference Selector</div>,
}));

// Mock the card components
vi.mock('@/components/PrizeCard', () => ({
  default: ({ prize, isWinner }: any) => (
    <div data-testid={`prize-${prize.id}`}>
      {prize.description} - {isWinner ? 'Winner!' : 'Not winner'}
    </div>
  ),
}));

vi.mock('@/components/THuntingCard', () => ({
  default: ({ winner }: any) => (
    <div data-testid={`thunting-${winner.id}`}>
      {winner.callsign} - Place: {winner.place}
    </div>
  ),
}));

// Mock TanStack Query
vi.mock('@tanstack/react-query', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useQuery: vi.fn(() => ({
      isLoading: false,
      data: undefined,
      error: null,
    })),
  };
});

describe('PrizesPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the prizes page correctly', () => {
    render(<PrizesPage />);

    expect(screen.getByText('Prizes')).toBeInTheDocument();
    expect(screen.getByTestId('button-notifications')).toBeInTheDocument();
    expect(screen.getByTestId('conference-selector')).toBeInTheDocument();
  });

  it('displays all three tabs', () => {
    render(<PrizesPage />);

    expect(screen.getByTestId('tab-all-prizes')).toBeInTheDocument();
    expect(screen.getByTestId('tab-door-prizes')).toBeInTheDocument();
    expect(screen.getByTestId('tab-thunting')).toBeInTheDocument();
  });

  it('displays tab labels correctly', () => {
    render(<PrizesPage />);

    expect(screen.getByText('All Prizes')).toBeInTheDocument();
    expect(screen.getByText('Door Prizes')).toBeInTheDocument();
    expect(screen.getByText('T-Hunting')).toBeInTheDocument();
  });

  it('does not show congratulations alert when user has not won', () => {
    render(<PrizesPage />);

    expect(screen.queryByText(/Congratulations! You've won a prize!/)).not.toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const { asFragment } = render(<PrizesPage />);
    expect(asFragment()).toMatchSnapshot();
  });
});

//describe('PrizesPage with custom conference', () => {
//  it('displays custom conference data', () => {
//    const customConference = {
//      ...mockConference,
//      name: 'Custom Conference',
//      year: 2026,
//      division: 'Custom Division',
//      location: 'Custom Venue',
//    };
//
//    const { useConference } = require('@/hooks/useConference');
//    vi.mocked(useConference).mockReturnValue({
//      currentConference: customConference,
//      setCurrentConference: vi.fn(),
//    });
//
//    render(<PrizesPage />);
//
//    // Page should render with custom conference
//    expect(screen.getByText('Prizes')).toBeInTheDocument();
//  });
//});
