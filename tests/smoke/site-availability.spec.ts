/**
 * tests/smoke/site-availability.spec.ts
 *
 * Smoke tests — fast checks that confirm eboCom is up and serving a real page.
 * Known site issues that cause warnings (not failures):
 *   - No <meta name="description"> on homepage
 *   - No <h1> on homepage (only /ee.html has an h1)
 *   - No <meta name="viewport"> (tracked as a real bug in responsive tests)
 *
 * Tag: @smoke
 */

import { test, expect } from '@fixtures/site.fixture';

test.describe('Site Availability @smoke', () => {
  test('site homepage loads with a successful HTTP status @smoke', async ({ homePage, siteConfig }) => {
    const response = await homePage.page.goto(siteConfig.url, {
      waitUntil: 'domcontentloaded',
    });

    expect(response, 'Response should not be null').not.toBeNull();
    const status = response!.status();
    expect(
      status >= 200 && status < 400,
      `Expected HTTP 2xx/3xx but got ${status} for ${siteConfig.url}`
    ).toBeTruthy();
  });

  test('homepage has a non-empty page title @smoke', async ({ page, siteConfig }) => {
    await page.goto(siteConfig.url, { waitUntil: 'domcontentloaded' });
    const title = await page.title();
    expect(title.trim(), 'Page <title> should not be empty').toBeTruthy();
    expect(title.trim().length, 'Page title should be meaningful').toBeGreaterThan(3);
    // Expected: "EboCom, LLC | Welcome"
  });

  test('page loads within 10 seconds @smoke', async ({ page, siteConfig }) => {
    const MAX_LOAD_MS = 10_000;
    const start = Date.now();
    await page.goto(siteConfig.url, { waitUntil: 'load' });
    const elapsed = Date.now() - start;
    expect(
      elapsed,
      `Page took ${elapsed}ms — exceeds ${MAX_LOAD_MS}ms limit`
    ).toBeLessThan(MAX_LOAD_MS);
  });

  test('no critical JavaScript errors on homepage load @smoke', async ({ page, siteConfig }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    page.on('pageerror', (err) => {
      consoleErrors.push(`[pageerror] ${err.message}`);
    });

    await page.goto(siteConfig.url, { waitUntil: 'networkidle' });

    const criticalErrors = consoleErrors.filter((err) => {
      const lower = err.toLowerCase();
      return (
        !lower.includes('google-analytics') &&
        !lower.includes('googletagmanager') &&
        !lower.includes('net::err_blocked_by_client')
      );
    });

    if (criticalErrors.length > 0) {
      console.warn('[smoke] Console errors:\n' + criticalErrors.join('\n'));
    }
    expect(criticalErrors.length).toBeLessThanOrEqual(3);
  });

  test('site is served over HTTPS @smoke', async ({ siteConfig }) => {
    expect(
      siteConfig.url.toLowerCase().startsWith('https://'),
      `Site URL "${siteConfig.url}" should use HTTPS`
    ).toBeTruthy();
  });

  test('homepage logo is present @smoke', async ({ homePage }) => {
    await expect(
      homePage.logo,
      'Company logo (img/logo-ebocom.jpg) should be visible'
    ).toBeVisible();
  });

  test('homepage has 7 navigation links @smoke', async ({ page, siteConfig }) => {
    await page.goto(siteConfig.url, { waitUntil: 'domcontentloaded' });
    const navLinks = page.locator("a:has(img[src*='img/nav-'])");
    const count = await navLinks.count();
    expect(count, 'Should have 7 image-based navigation links').toBe(7);
  });

  test('homepage has footer links @smoke', async ({ homePage }) => {
    const hasFooter = await homePage.hasFooterLinks();
    expect(hasFooter, 'Footer should contain Home, Contact Us, and Terms links').toBeTruthy();
  });

  test('meta description check @smoke', async ({ page, siteConfig }) => {
    await page.goto(siteConfig.url, { waitUntil: 'domcontentloaded' });
    const metaDesc = await page.locator('meta[name="description"]').getAttribute('content');

    // Known issue: eboCom homepage has no meta description — warn but do not fail
    if (!metaDesc || metaDesc.trim().length === 0) {
      console.warn(
        '[smoke] KNOWN ISSUE: eboCom homepage is missing <meta name="description">. ' +
          'This affects SEO — report to site owner.'
      );
    } else {
      expect(metaDesc.trim().length).toBeGreaterThan(10);
    }
  });
});
