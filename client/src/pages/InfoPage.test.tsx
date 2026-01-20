import React from 'react';
//import react from '@vitejs/plugin-react';
//import App from '../../src/App';
import { render, screen, act } from '@testing-library/react';
//import { useAuthContext } from "@/hooks/useAuth";
//import { useConference } from "@/hooks/useConference";
import { describe, it, expect, vi } from 'vitest';
import InfoPage from './InfoPage';
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

    describe('InfoPage', () => {
        it('renders the information page correctly', () => {

            // Control the mock return value for this test
            vi.mocked(TanstackQuery.useQuery).mockReturnValue({
                isLoading: true,
                data: undefined,
                error: null,
            } as any);

            // Render the component
            render(<InfoPage />);

            // Assert that key elements or text are present
            // Replace 'About' with the actual heading or text used in your InfoPage
            const heading = screen.getByText(/Venue/);
            expect(heading).toBeDefined();

            // Check for specific content or accessibility roles
            //expect(screen.getByRole('heading')).toBeDefined();
        });

        it('matches snapshot', () => {
            // Snapshot testing (optional) to detect unexpected UI changes
            const { asFragment } = render(<InfoPage />);
            expect(asFragment()).toMatchSnapshot();
        });
    });

    //vi.mock('@hooks/useAuth', () => ({
    //    useAuthContext: {
    //        user: undefined,
    //        isLoading: false,
    //        isAuthenticated: false,
    //    },
    //))
    //test('renders the info page', () => {
    //    ////const mockUser = useAuthContext();
    //    vi.mocked(useAuthContext).mockReturnValue({
    //        user: undefined,
    //        isLoading: false,
    //        isAuthenticated: false,
    //    });
    //
    //    render(<InfoPage />);
    //    screen.debug();
    //});

    // first attempt without mock
    //describe('App', () => {
    //    it('renders correctly', () => {
    //        //const { container } = render(<App />);
    //        // Assert that the app component is in the document
    //        //screen.debug();
    //        //const found = container.querySelector("svg");
    //        //expect(found.classList.toString()).toContain("animate-spin");
    //    });
    //});

})