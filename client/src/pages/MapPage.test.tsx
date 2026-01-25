import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import MapPage from './MapPage';

const { mockConference, mockImages } = vi.hoisted(() => {
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
      timezone: 'America/Los_Angeles',
      logoUrl: 'https://example.com/logo.png',
      faviconUrl: '/favicon.ico',
      primaryColor: '#1e40af',
      accentColor: '#f97316',
    },
    mockImages: [
      {
        id: 'img-1',
        conferenceId: 'test-conference-2025',
        imageType: 'venue-map',
        imagePath: 'venue_1764883580906.jpg',
        caption: 'Test Hotel Layout',
        displayOrder: 1,
      },
      {
        id: 'img-2',
        conferenceId: 'test-conference-2025',
        imageType: 'exhibitor-map',
        imagePath: 'exhibitors_1764883755395.png',
        caption: 'Test Exhibit Space Layout',
        displayOrder: 1,
      },
    ],
  };
});

vi.mock('wouter', () => ({
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

vi.mock('@/hooks/useConference', () => ({
  useConference: vi.fn(() => ({
    currentConference: mockConference,
    setCurrentConference: vi.fn(),
  })),
}));

vi.mock('@/components/ConferenceSelector', () => ({
  ConferenceSelectorDialog: () => <div data-testid="conference-selector">Conference Selector</div>,
}));

vi.mock('@tanstack/react-query', async (importOriginal) => {
  const actual = await importOriginal() as Record<string, unknown>;
  return {
    ...actual,
    useQuery: vi.fn(() => ({
      isLoading: false,
      data: mockImages,
      error: null,
    })),
  };
});

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

    expect(screen.getByText('Test Marriott')).toBeInTheDocument();
  });

  it('displays venue map image with caption from database', () => {
    render(<MapPage />);

    const venueMap = screen.getByTestId('img-venue-map-img-1');
    expect(venueMap).toBeInTheDocument();
    expect(venueMap).toHaveAttribute('alt', 'Test Hotel Layout');
    expect(screen.getByText('Test Hotel Layout')).toBeInTheDocument();
  });

  it('displays exhibitors map image with caption from database', () => {
    render(<MapPage />);

    const exhibitorsMap = screen.getByTestId('img-exhibitor-map-img-2');
    expect(exhibitorsMap).toBeInTheDocument();
    expect(exhibitorsMap).toHaveAttribute('alt', 'Test Exhibit Space Layout');
    expect(screen.getByText('Test Exhibit Space Layout')).toBeInTheDocument();
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

  it('matches snapshot', () => {
    const { asFragment } = render(<MapPage />);
    expect(asFragment()).toMatchSnapshot();
  });
});

describe('MapPage loading state', () => {
  it('shows skeleton loaders when loading', async () => {
    const { useQuery } = await import('@tanstack/react-query');
    vi.mocked(useQuery).mockReturnValue({
      isLoading: true,
      data: undefined,
      error: null,
    } as any);

    render(<MapPage />);

    expect(screen.getByText('Key Locations')).toBeInTheDocument();
  });
});

describe('MapPage with no images', () => {
  it('renders without map images when none exist', async () => {
    const { useQuery } = await import('@tanstack/react-query');
    vi.mocked(useQuery).mockReturnValue({
      isLoading: false,
      data: [],
      error: null,
    } as any);

    render(<MapPage />);

    expect(screen.getByText('Map')).toBeInTheDocument();
    expect(screen.getByText('Key Locations')).toBeInTheDocument();
    expect(screen.queryByTestId(/img-venue-map/)).not.toBeInTheDocument();
    expect(screen.queryByTestId(/img-exhibitor-map/)).not.toBeInTheDocument();
  });
});
