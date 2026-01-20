import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { useAuthContext } from "@/hooks/useAuth";
import { useConference } from "@/hooks/useConference";
import { describe, it, expect, vi } from 'vitest';
import LandingPage from './LandingPage';
import * as TanstackQuery from '@tanstack/react-query';

// Mock the entire module when querying for user
vi.mock('@tanstack/react-query', async (importOriginal) => {
    const actual = await importOriginal<typeof TanstackQuery>();
    return {
        ...actual,
        useQuery: vi.fn(),
    };
});

act(() => {

    describe('LandingPage', () => {
        it('renders the landing page correctly', () => {

            // Control the mock return value for this test
            vi.mocked(TanstackQuery.useQuery).mockReturnValue({
                isLoading: false,
                data: undefined,
                error: null,
            } as any);

            // Render the component
            render(<LandingPage />);

            // Assert that key elements or text are present
            // Replace 'About' with the actual heading or text used in your InfoPage
            const heading = screen.getByText(/Welcome/);
            expect(heading).toBeDefined();

            // Check for specific content or accessibility roles
            //expect(screen.getByRole('heading')).toBeDefined();
        });

        it('matches snapshot', () => {
            // Snapshot testing (optional) to detect unexpected UI changes
            const { asFragment } = render(<LandingPage />);
            expect(asFragment()).toMatchSnapshot();
        });
    });

})