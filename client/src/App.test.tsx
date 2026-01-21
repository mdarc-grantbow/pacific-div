import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Use vi.hoisted to define mock data that can be used in both mocks and tests
const { mockConference } = vi.hoisted(() => {
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
    }
  };
});

// Mock the useConference hook and contexts
vi.mock('@/hooks/useConference', () => {
  const React = require('react');

  return {
    useConference: vi.fn(() => ({
      currentConference: mockConference,
      setCurrentConference: vi.fn(),
    })),
    useConferencesList: vi.fn(() => ({
      conferencesList: [mockConference],
      setConferencesList: vi.fn(),
    })),
    useConferenceContext: vi.fn(() => ({
      currentConference: mockConference,
      setCurrentConference: vi.fn(),
    })),
    useConferencesListContext: vi.fn(() => ({
      conferencesList: [mockConference],
      setConferencesList: vi.fn(),
    })),
    ConferenceContext: React.createContext({
      currentConference: mockConference,
      setCurrentConference: vi.fn(),
    }),
    ConferencesListContext: React.createContext({
      conferencesList: [mockConference],
      setConferencesList: vi.fn(),
    }),
  };
});

// Mock the useAuth hook
vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    isAuthenticated: false,
    isLoading: false,
    user: null,
  }),
  AuthContext: React.createContext({
    isAuthenticated: false,
    isLoading: false,
    user: null,
  }),
}));

// Mock the toast hook
vi.mock('@/hooks/useToast', () => ({
  useToast: () => ({
    toasts: [],
    toast: vi.fn(),
    dismiss: vi.fn(),
  }),
}));

// Mock page components
vi.mock('@/pages/LandingPage', () => ({
  default: () => <div data-testid="landing-page">Landing Page</div>,
}));

vi.mock('@/pages/SchedulePage', () => ({
  default: () => <div>Schedule Page</div>,
}));

vi.mock('@/pages/MapPage', () => ({
  default: () => <div>Map Page</div>,
}));

vi.mock('@/pages/InfoPage', () => ({
  default: () => <div>Info Page</div>,
}));

vi.mock('@/pages/PrizesPage', () => ({
  default: () => <div>Prizes Page</div>,
}));

vi.mock('@/pages/ProfilePage', () => ({
  default: () => <div>Profile Page</div>,
}));

vi.mock('@/pages/AdminConference', () => ({
  default: () => <div>Admin Conference Page</div>,
}));

vi.mock('@/pages/not-found', () => ({
  default: () => <div>Not Found</div>,
}));

vi.mock('@/components/BottomNav', () => ({
  default: () => <div data-testid="bottom-nav">Bottom Nav</div>,
}));

// Setup localStorage mock
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('App', () => {
  beforeEach(() => {
    localStorageMock.clear();
    document.documentElement.classList.remove('dark');
  });

  it('renders the landing page at root path', () => {
    render(<App />);

    expect(screen.getByTestId('landing-page')).toBeInTheDocument();
    expect(screen.getByTestId('bottom-nav')).toBeInTheDocument();
  });

  it('applies dark theme from localStorage', () => {
    localStorageMock.setItem('theme', 'dark');

    render(<App />);

    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('does not apply dark theme when not in localStorage', () => {
    render(<App />);

    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('matches snapshot', () => {
    const { asFragment } = render(<App />);
    expect(asFragment()).toMatchSnapshot();
  });
});
