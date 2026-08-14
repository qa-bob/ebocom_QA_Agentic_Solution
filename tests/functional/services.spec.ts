/**
 * tests/functional/services.spec.ts
 *
 * Functional tests for the Services page (/services.html).
 *
 * Page structure:
 *   - h2[0]: "Services"
 *   - h2[1]: "Back-End Credit Card Processing"
 *   - h2[2]: "Strategic Partners"
 *   - Bullet items: <img src="img/blue-bullet.jpg"> (no <ul>/<li> elements)
 *   - Intra-page anchors: #be (Back-End), #sp (Strategic Partners)
 *   - Strategic Partners: Amex/Visa/MC, FDMS/Global Payments, GCS/Shift4
 *
 * Tag: @functional
 */

import { test, expect } from '@fixtures/site.fixture';

test.describe('Services Page @functional', () => {
  test.beforeEach(async ({ servicesPage }) => {
    await servicesPage.navigate();
    await servicesPage.waitForLoad();
  });

  test('services page loads and has the correct title @functional', async ({ servicesPage }) => {
    const title = await servicesPage.getTitle();
    expect(title).toContain('EboCom');
    expect(title.toLowerCase()).toContain('service');
  });

  test('services page has 3 content sections (h2 headings) @functional', async ({
    servicesPage,
  }) => {
    const count = await servicesPage.getSectionCount();
    expect(count, 'Services page should have 3 h2 sections').toBe(3);
  });

  test('services section headings have expected text @functional', async ({ servicesPage }) => {
    const h1Text = await servicesPage.servicesHeading.textContent();
    const h2Text = await servicesPage.backEndHeading.textContent();
    const h3Text = await servicesPage.strategicPartnersHeading.textContent();

    expect(h1Text?.trim().toLowerCase()).toContain('service');
    expect(h2Text?.trim().toLowerCase()).toContain('back');
    expect(h3Text?.trim().toLowerCase()).toContain('partner');
  });

  test('services page has bullet items listing services @functional', async ({ servicesPage }) => {
    const bulletCount = await servicesPage.getBulletItemCount();
    expect(
      bulletCount,
      'Services page should have at least 3 bullet items (img[src="img/blue-bullet.jpg"])'
    ).toBeGreaterThanOrEqual(3);
  });

  test('services page has intra-page section anchors @functional', async ({ servicesPage }) => {
    await expect(
      servicesPage.backEndAnchor,
      'Intra-page link to Back-End section should be present'
    ).toBeVisible();

    await expect(
      servicesPage.strategicPartnersAnchor,
      'Intra-page link to Strategic Partners section should be present'
    ).toBeVisible();
  });

  test('services page has a Contact Us link @functional', async ({ servicesPage }) => {
    await expect(
      servicesPage.contactCTA,
      'Services page should have a Contact Us link'
    ).toBeVisible();
  });

  test('services page nav marks Services as active @functional', async ({ servicesPage }) => {
    const isActive = await servicesPage.isActiveInNav();
    expect(
      isActive,
      'Services page nav should display nav-services-mo.jpg (active state)'
    ).toBeTruthy();
  });

  test('page body mentions card brands and payment partners @functional', async ({
    servicesPage,
  }) => {
    const bodyText = (await servicesPage.page.locator('body').textContent() ?? '').toLowerCase();

    const expectedTerms = ['visa', 'mastercard', 'amex'];
    const found = expectedTerms.filter((term) => bodyText.includes(term));

    expect(
      found.length,
      `Services page should mention card brands. Found: [${found.join(', ')}]`
    ).toBeGreaterThan(0);
  });
});
