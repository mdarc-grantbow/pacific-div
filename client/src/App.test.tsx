import React from 'react';
import { render, screen, act } from '@testing-library/react';
import App from '../src/App';
import { test, describe, it, expect } from 'vitest';

act(() => {
    describe('App', () => {
        it('renders correctly', () => {
            const { container } = render(<App />);
            // Assert that the app component is in the document
            screen.debug();
            //console.log(JSON.stringify(container)); // TypeError: Converting circular structure to JSON
            const found = container.querySelector("svg");
            //!(found === null) &&   // this will get rid of the problem but make the test pass when it should not.
            expect(found.classList.toString()).toContain("animate-spin");  // it started loading conferences instead
        });

        it('matches snapshot', () => {
            // Snapshot testing (optional) to detect unexpected UI changes
            const { asFragment } = render(<App />);
            expect(asFragment()).toMatchSnapshot();
        });
    });
})
