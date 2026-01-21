import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ProfilePage from './ProfilePage';
import { useAuthContext } from '@/hooks/useAuth';
import { useConference } from '@/hooks/useConference';
//import { User } from '../../../shared/schema';
//import { useQuery, useMutation } from '@tanstack/react-query';

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
  Conference: {},
}));

// Mock the useAuth hook
vi.mock('@/hooks/useAuth', () => ({
  useAuthContext: vi.fn(() => ({
    isAuthenticated: false,
    isLoading: false,
    user: undefined,
  })),
}));

// Mock the toast hook
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
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
      data: [],
      error: null,
    })),
    useMutation: vi.fn(() => ({
      mutate: vi.fn(),
      isLoading: false,
    })),
  };
});

// Mock queryClient
vi.mock('@/lib/queryClient', () => ({
  apiRequest: vi.fn(),
  queryClient: {
    invalidateQueries: vi.fn(),
  },
}));

describe('ProfilePage - Unauthenticated', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useAuthContext).mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      user: undefined,
    });
  });

  it('renders the profile page correctly for unauthenticated users', () => {
    render(<ProfilePage />);

    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByTestId('button-notifications')).toBeInTheDocument();
    expect(screen.getByTestId('conference-selector')).toBeInTheDocument();
  });

  it('displays sign in prompt for unauthenticated users', () => {
    render(<ProfilePage />);

    expect(screen.getByText('Sign in to access your profile')).toBeInTheDocument();
    expect(screen.getByText(/Log in to save your bookmarks/)).toBeInTheDocument();
  });

  it('displays login button for unauthenticated users', () => {
    render(<ProfilePage />);

    const loginButton = screen.getByTestId('button-login-profile');
    expect(loginButton).toBeInTheDocument();
    expect(loginButton).toHaveAttribute('href', '/api/login');
  });

  it('displays dark mode toggle for unauthenticated users', () => {
    render(<ProfilePage />);

    expect(screen.getByTestId('switch-dark-mode')).toBeInTheDocument();
    expect(screen.getByText('Dark Mode')).toBeInTheDocument();
  });

  it('matches snapshot for unauthenticated users', () => {
    const { asFragment } = render(<ProfilePage />);
    expect(asFragment()).toMatchSnapshot();
  });
});

describe('ProfilePage - Authenticated', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useAuthContext).mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      user: mockUserProfile,
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
        data: undefined,
        isLoading: false,
        error: null,
      };
    });
  });

  it('renders the profile page correctly for authenticated users', () => {
    render(<ProfilePage />);

    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByTestId('conference-selector')).toBeInTheDocument();
  });

  it('displays user profile information', () => {
    render(<ProfilePage />);

    expect(screen.getByTestId('text-callsign')).toHaveTextContent('W1ABC');
    expect(screen.getByTestId('text-name')).toHaveTextContent('Test User');
    expect(screen.getByText(/Badge #123/)).toBeInTheDocument();
    expect(screen.getByText(/Extra Class/)).toBeInTheDocument();
  });

  it('displays settings section', () => {
    render(<ProfilePage />);

    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByTestId('switch-dark-mode')).toBeInTheDocument();
    expect(screen.getByTestId('switch-notifications')).toBeInTheDocument();
  });

  it('displays logout button', () => {
    render(<ProfilePage />);

    const logoutButton = screen.getByTestId('button-logout');
    expect(logoutButton).toBeInTheDocument();
    expect(logoutButton).toHaveTextContent('Logout');
  });

  it('displays feedback section', () => {
    render(<ProfilePage />);

    expect(screen.getByText('Provide Feedback')).toBeInTheDocument();
    expect(screen.getByText(/Help us improve/)).toBeInTheDocument();
  });

  it('displays all survey categories', () => {
    render(<ProfilePage />);

    expect(screen.getByTestId('survey-attendee')).toBeInTheDocument();
    expect(screen.getByTestId('survey-exhibitor')).toBeInTheDocument();
    expect(screen.getByTestId('survey-speaker')).toBeInTheDocument();
    expect(screen.getByTestId('survey-volunteer')).toBeInTheDocument();
    expect(screen.getByTestId('survey-staff')).toBeInTheDocument();

    expect(screen.getByText('Attendee Feedback')).toBeInTheDocument();
    expect(screen.getByText('Exhibitor Feedback')).toBeInTheDocument();
    expect(screen.getByText('Speaker Feedback')).toBeInTheDocument();
    expect(screen.getByText('Volunteer Feedback')).toBeInTheDocument();
    expect(screen.getByText('Staff Feedback')).toBeInTheDocument();
  });

  it('displays registration link when user is not registered', () => {
    render(<ProfilePage />);

    expect(screen.getByTestId('link-attendee-registration')).toBeInTheDocument();
  });

  it('hides registration link when user is registered', () => {
    const { useQuery } = require('@tanstack/react-query');
    vi.mocked(useQuery).mockImplementation(({ queryKey }: any) => {
      if (queryKey[0] === '/api/profile') {
        return {
          data: { ...mockUserProfile, isRegistered: true },
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

    render(<ProfilePage />);

    expect(screen.queryByTestId('link-attendee-registration')).not.toBeInTheDocument();
  });

  it('matches snapshot for authenticated users', () => {
    const { asFragment } = render(<ProfilePage />);
    expect(asFragment()).toMatchSnapshot();
  });
});

describe('ProfilePage with custom conference', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useAuthContext).mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      user: undefined,
    });
  });

  it('handles missing conference gracefully', () => {
    vi.mocked(useConference).mockReturnValue({
      currentConference: null,
      setCurrentConference: vi.fn(),
    });

    render(<ProfilePage />);

    // Should still render without crashing
    expect(screen.getByText('Profile')).toBeInTheDocument();
  });
});
