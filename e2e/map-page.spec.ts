import { test, expect } from '@playwright/test';

test.describe('Map Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/map');
  });

  test('displays the map page with header', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /map/i })).toBeVisible();
  });

  test('shows venue map images', async ({ page }) => {
    const venueMapContainer = page.locator('[data-testid^="img-venue-map-"]').first();
    await expect(venueMapContainer).toBeVisible({ timeout: 15000 });
  });

  test('shows exhibitor map images', async ({ page }) => {
    const exhibitorMapContainer = page.locator('[data-testid^="img-exhibitor-map-"]').first();
    await expect(exhibitorMapContainer).toBeVisible({ timeout: 15000 });
  });

  test('displays key locations section', async ({ page }) => {
    await expect(page.getByText('Key Locations')).toBeVisible();
    await expect(page.getByTestId('location-1')).toBeVisible();
  });

  test('maps have proper alt text for accessibility', async ({ page }) => {
    const venueImg = page.locator('[data-testid^="img-venue-map-"]').first();
    await expect(venueImg).toBeVisible({ timeout: 15000 });
    await expect(venueImg).toHaveAttribute('alt', /.+/);
  });

  test('has notification button', async ({ page }) => {
    await expect(page.getByTestId('button-notifications')).toBeVisible();
  });
});
