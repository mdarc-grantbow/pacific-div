import React from 'react';
import { render, screen } from '@testing-library/react';
import PrizesPage from './PrizesPage';
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

describe('PrizesPage Component', () => {
  it('renders without crashing and displays the prizes title', () => {
    render(<PrizesPage />);
    const prizesTitleElement = screen.getByRole('heading', { name: 'Prizes' });
    expect(prizesTitleElement).toBeInTheDocument();
  });
});

it('matches snapshot', () => {
  // Snapshot testing (optional) to detect unexpected UI changes
  const { asFragment } = render(<PrizesPage />);
  expect(asFragment()).toMatchSnapshot();
});
