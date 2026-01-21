import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import VenuePage from './VenuePage';
import { useAuthContext } from '@/hooks/useAuth';

// Use vi.hoisted to define mock data
const { mockConference, mockRadioContacts, mockVenueInfo, mockVendors, mockUserProfile } = vi.hoisted(() => {
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
    mockRadioContacts: [
      {
        id: '1',
        conferenceSlug: 'test-conference-2025',
        name: 'Test Net',
        frequency: '146.520',
        description: 'Test repeater network',
        category: 'repeater',
        createdAt: '2025-01-01',
      },
      {
        id: '2',
        conferenceSlug: 'test-conference-2025',
        name: 'Emergency Contact',
        frequency: '146.940',
        description: 'Emergency communications',
        category: 'emergency',
        createdAt: '2025-01-01',
      },
    ],
    mockVenueInfo: [
      {
        id: '1',
        conferenceSlug: 'test-conference-2025',
        title: 'Parking',
        content: 'Free parking available',
        category: 'general',
        icon: 'parking',
        createdAt: '2025-01-01',
      },
      {
        id: '2',
        conferenceSlug: 'test-conference-2025',
        title: 'WiFi',
        content: 'Free WiFi: TestConf2025',
        category: 'general',
        icon: 'wifi',
        createdAt: '2025-01-01',
      },
    ],
    mockVendors: [
      {
        id: '1',
        conferenceSlug: 'test-conference-2025',
        name: 'Test Vendor',
        description: 'Radio equipment supplier',
        boothNumber: 'A1',
        website: 'https://testvendor.com',
        category: 'equipment',
        createdAt: '2025-01-01',
      },
      {
        id: '2',
        conferenceSlug: 'test-conference-2025',
        name: 'Another Vendor',
        description: 'Antenna manufacturer',
        boothNumber: 'B2',
        category: 'equipment',
        createdAt: '2025-01-01',
      },
    ],
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
  useConferences: vi.fn(() => ({
    conferences: [mockConference],
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
vi.mock('@/components/RadioContactCard', () => ({
  default: ({ contact }: any) => (
    <div data-testid={`radio-contact-${contact.id}`}>
      {contact.name} - {contact.frequency}
    </div>
  ),
}));

vi.mock('@/components/VenueInfoCard', () => ({
  default: ({ info }: any) => (
    <div data-testid={`venue-info-${info.id}`}>
      {info.title}: {info.content}
    </div>
  ),
}));

vi.mock('@/components/VendorCard', () => ({
  default: ({ vendor }: any) => (
    <div data-testid={`vendor-${vendor.id}`}>
      {vendor.name} - Booth {vendor.boothNumber}
    </div>
  ),
}));

// Mock the image import
vi.mock('@assets/exhibitors_1764883755395.png', () => ({
  default: 'mocked-exhibitors-map.png',
}));

// Mock TanStack Query
vi.mock('@tanstack/react-query', async (importOriginal) => {
  const actual = await importOriginal() as Record<string, unknown>;
  return {
    ...actual,
    useQuery: vi.fn(() => ({
      isLoading: false,
      data: undefined,
      error: null,
    })),
  };
});

describe('VenuePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the venue page correctly', () => {
    render(<VenuePage />);

    expect(screen.getByText('Venue')).toBeInTheDocument();
    expect(screen.getByTestId('button-notifications')).toBeInTheDocument();
    expect(screen.getByTestId('conference-selector')).toBeInTheDocument();
  });

  it('displays all three tabs', () => {
    render(<VenuePage />);

    expect(screen.getByTestId('tab-venue')).toBeInTheDocument();
    expect(screen.getByTestId('tab-vendors')).toBeInTheDocument();
    expect(screen.getByTestId('tab-radio')).toBeInTheDocument();
  });

  it('displays directions card with conference details', () => {
    render(<VenuePage />);

    expect(screen.getByTestId('card-directions')).toBeInTheDocument();
    expect(screen.getByText('Test Marriott')).toBeInTheDocument();
    expect(screen.getByText('123 Test Street, Test City, CA 12345')).toBeInTheDocument();
    expect(screen.getByText(/37.7629351,-121.9674592/)).toBeInTheDocument();
    expect(screen.getByText(/CM87us/)).toBeInTheDocument();
  });

  it('displays map iframe', () => {
    render(<VenuePage />);

    const iframe = screen.getByTestId('map-iframe');
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute('title', 'San Ramon Marriott Map');
  });

  it('displays external links for parking and hotel', () => {
    render(<VenuePage />);

    expect(screen.getByTestId('link-parking')).toHaveAttribute('href', 'https://www.pacificon.org/resources/parking');
    expect(screen.getByTestId('link-hotel-website')).toHaveAttribute('href', 'https://www.marriott.com/en-us/hotels/oaksr-san-ramon-marriott/overview/');
  });

  it('matches snapshot', () => {
    const { asFragment } = render(<VenuePage />);
    expect(asFragment()).toMatchSnapshot();
  });
});

describe('VenuePage with authenticated user', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useAuthContext).mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      user: mockUserProfile,
    });
  });

  it('renders correctly when authenticated', () => {
    render(<VenuePage />);

    expect(screen.getByText('Venue')).toBeInTheDocument();
  });
});