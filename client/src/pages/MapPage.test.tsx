import React from 'react';
import { render, screen } from '@testing-library/react';
import MapPage from './MapPage';
import { describe, it, expect, vi } from 'vitest';
import * as TanstackQuery from '@tanstack/react-query';

// Mock the entire module when querying for user
vi.mock('@tanstack/react-query', async (importOriginal) => {
  const actual = await importOriginal<typeof TanstackQuery>();
  return {
    ...actual,
    useQuery: vi.fn(),
  };
});

describe('MapPage Component', () => {
  it('renders without crashing and displays the map title', () => {
    render(<MapPage />);
    const mapTitleElement = screen.getByRole('heading', { name: 'Map' });
    expect(mapTitleElement).toBeInTheDocument();
  });
});

it('matches snapshot', () => {
  // Snapshot testing (optional) to detect unexpected UI changes
  const { asFragment } = render(<MapPage />);
  expect(asFragment()).toMatchSnapshot();
});
