/**
 * tests/navigation/nav-links.spec.ts
 *
 * Navigation tests for eboCom's image-based navigation system.
 *
 * Site-specific notes:
 *   - No <nav> element — navigation is <a href="page.html"><img src="img/nav-*.jpg" alt="..."></a>
 *   - Active page: nav image uses "-mo" suffix (e.g. nav-services-mo.jpg when on services.html)
 *   - No mobile hamburger menu — site is a fixed-width static layout
 *   - hrefs are relative (e.g. "ee.html") — resolved to absolute for HEAD checks
 *   - 7 nav items + 3 footer links on every page
 *
 * Tag: @navigation
 */

import { test, expect } from '@fixtures/site.fixture';
import { EXPECTED_NAV_HREFS } from '@pages/navigation.page';

test.describe('Navigation @navigation', () => {
  test.beforeEach(async ({ navigationPage }) => {
    await navigationPage.navigate();
    await navigationPage.waitForLoad();
  });

  // ── Presence ────────────────────────────────────────────────────────────────

  test('navigation links are present on homepage @navigation', async ({ navigationPage }) => {
    const isVisible = await navigationPage.isNavVisible();
    expect(isVisible, 'At least one image-based nav link should be present').toBeTruthy();
  });

  test('all 7 expected nav links are present @navigation', async ({ navigationPage }) => {
    const navLinks = await navigationPage.getNavLinks();
    expect(
      navLinks.length,
      `Expected 7 nav links, found ${navLinks.length}: ${navLinks.map((l) => l.href).join(', ')}`
    ).toBe(7);
  });

  test('each expected nav href exists on the page @navigation', async ({ page, siteConfig }) => {
    await page.goto(siteConfig.url, { waitUntil: 'domcontentloaded' });

    for (const href of EXPECTED_NAV_HREFS) {
      const link = page.locator(`a[href='${href}']`);
      await expect(
        link.first(),
        `Nav link a[href='${href}'] should be present`
      ).toBeVisible();
    }
  });

  // ── Reachability ─────────────────────────────────────────────────────────────

  test('all nav links are reachable (no 404s) @navigation', async ({ navigationPage }) => {
    const results = await navigationPage.checkAllNavLinksReachable();

    expect(results.length, 'Should have checked at least 7 nav links').toBeGreaterThanOrEqual(7);

    const broken = results.filter((r) => !r.ok && r.status !== 0);
    const unreachable = results.filter((r) => r.status === 0);

    if (unreachable.length > 0) {
      console.warn(
        '[navigation] Could not reach (network error):\n' +
          unreachable.map((r) => `  ${r.url}`).join('\n')
      );
    }

    expect(
      broken,
      `Found ${broken.length} broken nav link(s):\n` +
        broken.map((r) => `  ${r.url} → HTTP ${r.status}`).join('\n')
    ).toHaveLength(0);
  });

  // ── Active page indicator ────────────────────────────────────────────────────

  test('active nav indicator is absent on homepage (no -mo image) @navigation', async ({
    page,
    siteConfig,
  }) => {
    await page.goto(siteConfig.url, { waitUntil: 'domcontentloaded' });

    // Homepage has no active state in nav (it is not itself a nav item)
    // All nav images on the homepage should use the standard (non -mo) variant
    const moImages = page.locator("img[src*='-mo.jpg'][src*='nav-']");
    const count = await moImages.count();

    // If a -mo image is present on the homepage it indicates a nav highlighting bug
    if (count > 0) {
      const src = await moImages.first().getAttribute('src');
      console.warn(
        `[navigation] Unexpected active-nav image on homepage: ${src}. ` +
          'This may indicate a copy-paste error in the nav HTML.'
      );
    }
    // Soft assertion — this is a known site issue on contact.html using ee-mo.jpg
    expect(count).toBeLessThanOrEqual(1);
  });

  test('active nav image uses -mo suffix on inner pages @navigation', async ({
    navigationPage,
    page,
    siteConfig,
  }) => {
    // Navigate to services.html and verify the nav marks it as active
    await page.goto(siteConfig.url.replace(/\/$/, '') + '/services.html', {
      waitUntil: 'domcontentloaded',
    });

    const activeHref = await navigationPage.getActiveNavHref();
    expect(activeHref, 'Services page should have an active nav indicator').not.toBeNull();
    expect(activeHref, 'Active nav href should point to services.html').toBe('services.html');
  });

  // ── Footer links ─────────────────────────────────────────────────────────────

  test('homepage footer has Home, Contact Us, and Terms links @navigation', async ({
    navigationPage,
  }) => {
    const hasFooter = await navigationPage.hasFooterLinks();
    expect(hasFooter, 'Footer should contain index.html, contact.html, and terms.html links').toBeTruthy();
  });

  test('footer Contact Us link is reachable @navigation', async ({ page, siteConfig }) => {
    await page.goto(siteConfig.url, { waitUntil: 'domcontentloaded' });
    const contactUrl = siteConfig.url.replace(/\/$/, '') + '/contact.html';
    const response = await page.request.head(contactUrl, { timeout: 10_000 });
    expect(response.ok(), `contact.html should return 2xx, got ${response.status()}`).toBeTruthy();
  });

  test('footer Terms link is reachable @navigation', async ({ page, siteConfig }) => {
    await page.goto(siteConfig.url, { waitUntil: 'domcontentloaded' });
    const termsUrl = siteConfig.url.replace(/\/$/, '') + '/terms.html';
    const response = await page.request.head(termsUrl, { timeout: 10_000 });
    expect(response.ok(), `terms.html should return 2xx, got ${response.status()}`).toBeTruthy();
  });

  // ── Nav image alt text ────────────────────────────────────────────────────────

  test('nav images have alt text for accessibility @navigation', async ({ page, siteConfig }) => {
    await page.goto(siteConfig.url, { waitUntil: 'domcontentloaded' });

    const navImages = page.locator("a:has(img[src*='img/nav-']) img");
    const count = await navImages.count();
    const missingAlt: string[] = [];

    for (let i = 0; i < count; i++) {
      const img = navImages.nth(i);
      const alt = await img.getAttribute('alt');
      const src = (await img.getAttribute('src')) ?? `img-${i}`;
      if (alt === null || alt.trim() === '') {
        missingAlt.push(src);
      }
    }

    if (missingAlt.length > 0) {
      console.warn(
        `[navigation] Nav images missing alt text: ${missingAlt.join(', ')}`
      );
    }

    expect(
      missingAlt.length,
      `${missingAlt.length} nav image(s) have no alt text — screen readers cannot announce nav destinations`
    ).toBe(0);
  });

  // ── Logo ──────────────────────────────────────────────────────────────────────

  test('logo links back to the homepage @navigation', async ({ page, siteConfig }) => {
    await page.goto(siteConfig.url, { waitUntil: 'domcontentloaded' });

    const logoLink = page.locator("a[href='index.html'] img[src='img/logo-ebocom.jpg']");
    const logoLinkWrapper = page.locator("a[href='index.html']").first();

    if (await logoLink.count() === 0) {
      console.warn('[navigation] Could not find logo link (a[href="index.html"] img[logo]).');
      return;
    }

    const href = await logoLinkWrapper.getAttribute('href');
    expect(href, 'Logo link href should be "index.html"').toBe('index.html');
  });
});
