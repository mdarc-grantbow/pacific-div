import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import LandingPage from './LandingPage';
import { useAuthContext } from '@/hooks/useAuth';

// Use vi.hoisted to define mock data that can be used in both mocks and tests
const { mockConference, mockUser } = vi.hoisted(() => {
  return {
    mockConference: {
      id: 'test-conference-2025',
      name: 'Test Conference',
      year: 2025,
      location: 'Test City, CA',
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
    mockUser: {
      id: '1',
      username: 'testuser',
      email: 'test@example.com',
    }
  };
});

// Mock wouter's Link component
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
  useConferenceContext: vi.fn(() => ({
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
  useAuth: vi.fn(() => ({
    isAuthenticated: false,
    isLoading: false,
    user: null,
  })),
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
    useQuery: vi.fn(() => ({
      isLoading: false,
      data: undefined,
      error: null,
    })),
  };
});

describe('LandingPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the landing page correctly', () => {
    render(<LandingPage />);

    // Check for welcome message with conference name
    expect(screen.getByTestId('text-hero-title')).toHaveTextContent('Welcome to Test Conference 2025');

    // Check for conference location and dates
    expect(screen.getByTestId('text-hero-description')).toHaveTextContent('Test City, CA');
  });

  it('displays all feature cards', () => {
    render(<LandingPage />);

    // Check that all 4 feature cards are present
    expect(screen.getByTestId('card-schedule')).toBeInTheDocument();
    expect(screen.getByTestId('card-map')).toBeInTheDocument();
    expect(screen.getByTestId('card-info')).toBeInTheDocument();
    expect(screen.getByTestId('card-prizes')).toBeInTheDocument();
  });

  it('displays conference logo when available', () => {
    render(<LandingPage />);

    const logo = screen.getByAltText('Test Conference');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', 'https://example.com/logo.png');
  });

  it('displays notifications button', () => {
    render(<LandingPage />);

    const notificationButton = screen.getByTestId('button-notifications');
    expect(notificationButton).toBeInTheDocument();
  });

  it('displays conference selector', () => {
    render(<LandingPage />);

    expect(screen.getByTestId('conference-selector')).toBeInTheDocument();
  });

  it('displays footer with division information', () => {
    render(<LandingPage />);

    expect(screen.getByText(/Test Conference is sponsored by ARRL Test Division Division member clubs/)).toBeInTheDocument();
  });

  it('displays authenticated user state', () => {
    // Mock authenticated user
    vi.mocked(useAuthContext).mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      user: mockUser,
    });

    render(<LandingPage />);

    // Page should still render normally
    expect(screen.getByTestId('text-hero-title')).toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const { asFragment } = render(<LandingPage />);
    expect(asFragment()).toMatchSnapshot();
  });
});
