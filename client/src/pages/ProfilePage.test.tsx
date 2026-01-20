import React from 'react';
import { render, screen } from '@testing-library/react';
import ProfilePage from './ProfilePage';
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

describe('ProfilePage Component', () => {
  it('renders without crashing and displays the profile title', () => {
    render(<ProfilePage />);
    const profileTitleElement = screen.getByRole('heading', { name: 'Profile' });
    expect(profileTitleElement).toBeInTheDocument();
  });
});

it('matches snapshot', () => {
  // Snapshot testing (optional) to detect unexpected UI changes
  const { asFragment } = render(<ProfilePage />);
  expect(asFragment()).toMatchSnapshot();
});
