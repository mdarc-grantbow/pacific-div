import React from 'react';
import { render, screen } from '@testing-library/react';
import SchedulePage from './SchedulePage';
import { describe, it, expect } from 'vitest';
import * as TanstackQuery from '@tanstack/react-query';

describe('SchedulePage Component', () => {
  it('renders without crashing and displays the schedule title', () => {

    // Control the mock return value for this test
    //vi.mocked(TanstackQuery.useQuery).mockReturnValue({
    // calls /api/conferences/<slug>/sessions/*
    // calls /api/bookmarks/<slug>/*
    //} as any);

    //TanstackQuery.QueryClientProvider

    render(<SchedulePage />);
    const scheduleTitleElement = screen.getByRole('heading', { name: 'Schedule' });
    expect(scheduleTitleElement).toBeInTheDocument();
  });
});

it('matches snapshot', () => {
  // Snapshot testing (optional) to detect unexpected UI changes
  const { asFragment } = render(<SchedulePage />);
  expect(asFragment()).toMatchSnapshot();
});
