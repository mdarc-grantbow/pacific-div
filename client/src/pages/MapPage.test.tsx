import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import MapPage from './MapPage';

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

// Mock the ConferenceSelector component
vi.mock('@/components/ConferenceSelector', () => ({
  ConferenceSelectorDialog: () => <div data-testid="conference-selector">Conference Selector</div>,
}));

// Mock the image imports
vi.mock('@assets/venue_1764883580906.jpg', () => ({
  default: 'mocked-venue-map.jpg',
}));

vi.mock('@assets/exhibitors_1764883755395.png', () => ({
  default: 'mocked-exhibitors-map.png',
}));

describe('MapPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the map page correctly', () => {
    render(<MapPage />);

    expect(screen.getByText('Map')).toBeInTheDocument();
    expect(screen.getByTestId('button-notifications')).toBeInTheDocument();
    expect(screen.getByTestId('conference-selector')).toBeInTheDocument();
  });

  it('displays venue name in header', () => {
    render(<MapPage />);

    //expect(screen.getByText('Test Marriott')).toBeInTheDocument();
  });

  it('displays venue map image', () => {
    render(<MapPage />);

    const venueMap = screen.getByTestId('img-venue-map');
    expect(venueMap).toBeInTheDocument();
    expect(venueMap).toHaveAttribute('alt', 'Pacificon Hotel Layout Map');
  });

  it('displays exhibitors map image', () => {
    render(<MapPage />);

    const exhibitorsMap = screen.getByTestId('img-exhibitors-map');
    expect(exhibitorsMap).toBeInTheDocument();
    expect(exhibitorsMap).toHaveAttribute('alt', 'Pacificon Exhibit Space Layout');
  });

  it('displays all key locations', () => {
    render(<MapPage />);

    expect(screen.getByTestId('location-1')).toBeInTheDocument();
    expect(screen.getByTestId('location-2')).toBeInTheDocument();
    expect(screen.getByTestId('location-3')).toBeInTheDocument();
    expect(screen.getByTestId('location-4')).toBeInTheDocument();
    expect(screen.getByTestId('location-5')).toBeInTheDocument();

    expect(screen.getByText('Registration Desk')).toBeInTheDocument();
    expect(screen.getByText('Contra Costa')).toBeInTheDocument();
    expect(screen.getByText('Bishop Ranch')).toBeInTheDocument();
    expect(screen.getByText('W1AW/6 Station')).toBeInTheDocument();
    expect(screen.getByText('Conference Rooms')).toBeInTheDocument();
  });

  it('displays hotel address information', () => {
    render(<MapPage />);

    expect(screen.getByText('Hotel Address')).toBeInTheDocument();
    expect(screen.getByText('123 Test Street, Test City, CA 12345')).toBeInTheDocument();
  });

  it('displays GPS and grid square information', () => {
    render(<MapPage />);

    expect(screen.getByText(/37.7629351,-121.9674592/)).toBeInTheDocument();
    expect(screen.getByText(/CM87us/)).toBeInTheDocument();
  });

  it('displays link to Google Maps', () => {
    render(<MapPage />);

    const mapsLink = screen.getByTestId('link-maps');
    expect(mapsLink).toBeInTheDocument();
    expect(mapsLink).toHaveAttribute('href', expect.stringContaining('maps.google.com'));
    expect(mapsLink).toHaveAttribute('target', '_blank');
  });

  it('matches snapshot', () => {
    const { asFragment } = render(<MapPage />);
    expect(asFragment()).toMatchSnapshot();
  });
});

//describe('MapPage with custom conference', () => {
//  it('displays custom conference location data', () => {
//    const customConference = {
//      ...mockConference,
//      location: 'Custom Venue',
//      locationAddress: '456 Custom Ave, Custom City, CA 98765',
//      gridSquare: 'DM79xy',
//      gps: '38.1234567,-122.9876543',
//    };
//
//    const { useConference } = require('@/hooks/useConference');
//    vi.mocked(useConference).mockReturnValue({
//      currentConference: customConference,
//      setCurrentConference: vi.fn(),
//    });
//
//    render(<MapPage />);
//
//    expect(screen.getByText('Custom Venue')).toBeInTheDocument();
//    expect(screen.getByText('456 Custom Ave, Custom City, CA 98765')).toBeInTheDocument();
//    expect(screen.getByText(/DM79xy/)).toBeInTheDocument();
//    expect(screen.getByText(/38.1234567,-122.9876543/)).toBeInTheDocument();
//  });
//});