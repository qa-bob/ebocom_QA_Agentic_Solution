/**
 * tests/functional/homepage-features.spec.ts
 *
 * Functional tests for the eboCom homepage.
 *
 * Known site characteristics (not test bugs):
 *   - No <h1> on homepage — only /ee.html has an h1
 *   - No CTAs or conversion buttons — text-only marketing copy
 *   - No <meta name="description">
 *   - Navigation is image-based
 *
 * Tag: @functional
 */

import { test, expect } from '@fixtures/site.fixture';

test.describe('Homepage Content @functional', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.waitForLoad();
  });

  test('homepage logo is visible @functional', async ({ homePage }) => {
    await expect(homePage.logo, 'eboCom logo should be visible').toBeVisible();
  });

  test('homepage has body text content describing the company @functional', async ({ homePage }) => {
    const heroText = await homePage.getHeroText();
    expect(heroText.length, 'Homepage should have introductory text').toBeGreaterThan(20);
  });

  test('homepage body mentions payment or electronic transactions @functional', async ({
    page,
    siteConfig,
  }) => {
    await page.goto(siteConfig.url, { waitUntil: 'domcontentloaded' });
    const bodyText = (await page.locator('body').textContent() ?? '').toLowerCase();

    const keywords = ['payment', 'transaction', 'electronic', 'merchant', 'processor', 'ebocom'];
    const found = keywords.filter((kw) => bodyText.includes(kw));

    expect(
      found.length,
      `Homepage body should mention payments/company terms. Found: [${found.join(', ')}]`
    ).toBeGreaterThan(0);
  });

  test('homepage has 7 navigation links @functional', async ({ page, siteConfig }) => {
    await page.goto(siteConfig.url, { waitUntil: 'domcontentloaded' });
    const navLinks = page.locator("a:has(img[src*='img/nav-'])");
    await expect(navLinks).toHaveCount(7);
  });

  test('homepage footer links are present and visible @functional', async ({ homePage }) => {
    const hasFooter = await homePage.hasFooterLinks();
    expect(hasFooter, 'Footer should have Home, Contact Us, and Terms links').toBeTruthy();
  });

  test('Contact Us link is present and points to contact.html @functional', async ({
    page,
    siteConfig,
  }) => {
    await page.goto(siteConfig.url, { waitUntil: 'domcontentloaded' });
    const contactLinks = page.locator("a[href='contact.html']");
    const count = await contactLinks.count();
    expect(count, 'At least one Contact Us link should be on the homepage').toBeGreaterThan(0);
  });

  test('homepage has no h1 — known accessibility gap (soft assertion) @functional', async ({
    page,
    siteConfig,
  }) => {
    await page.goto(siteConfig.url, { waitUntil: 'domcontentloaded' });
    const h1Count = await page.locator('h1').count();

    // This is a KNOWN SITE BUG — the homepage has no <h1>
    // Test documents the issue rather than passing silently
    if (h1Count === 0) {
      console.warn(
        '[functional] KNOWN ISSUE: eboCom homepage has no <h1> element. ' +
          'This is a WCAG 2.1 accessibility failure and an SEO gap. ' +
          'Only /ee.html has an h1 ("EboCom Evolution").'
      );
    }

    // Soft: expect 0 (documenting the current broken state)
    // Change this assertion to toBeGreaterThan(0) once the site is fixed
    expect(h1Count, 'Homepage is missing <h1> — site accessibility issue').toBe(0);
  });

  test('all nav images load without 404 @functional', async ({ page, siteConfig }) => {
    await page.goto(siteConfig.url, { waitUntil: 'domcontentloaded' });
    const navImages = page.locator("img[src*='img/nav-']");
    const count = await navImages.count();

    expect(count, 'Should have nav images').toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const src = await navImages.nth(i).getAttribute('src');
      if (!src) continue;
      const naturalWidth = await navImages.nth(i).evaluate<number>(
        (img) => (img as HTMLImageElement).naturalWidth
      );
      expect(
        naturalWidth,
        `Nav image "${src}" failed to load (naturalWidth = 0)`
      ).toBeGreaterThan(0);
    }
  });
});
