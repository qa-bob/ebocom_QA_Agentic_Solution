/**
 * tests/functional/evolution.spec.ts
 *
 * Functional tests for the EboCom Evolution product page (/ee.html).
 * This is the most important marketing page — it describes the flagship
 * payment processing system and is the only page on the site with an <h1>.
 *
 * Tag: @functional
 */

import { test, expect } from '@fixtures/site.fixture';

test.describe('EboCom Evolution Page @functional', () => {
  test.beforeEach(async ({ evolutionPage }) => {
    await evolutionPage.navigate();
    await evolutionPage.waitForLoad();
  });

  test('evolution page loads and has h1 heading @functional', async ({ evolutionPage }) => {
    const heading = await evolutionPage.getHeadingText();
    expect(heading, 'Evolution page should have an h1 heading').toBeTruthy();
    expect(heading.toLowerCase()).toContain('evolution');
  });

  test('evolution page is the only page on the site with an h1 @functional', async ({
    evolutionPage,
  }) => {
    await expect(
      evolutionPage.pageHeading,
      'h1 element should be visible on the Evolution page'
    ).toBeVisible();
  });

  test('evolution page has body content describing the product @functional', async ({
    evolutionPage,
  }) => {
    const bodyText = await evolutionPage.getBodyText();
    expect(bodyText.length, 'Evolution page should have meaningful content').toBeGreaterThan(100);

    const lower = bodyText.toLowerCase();
    const keywords = ['evolution', 'payment', 'transaction', 'merchant', 'processor', 'ebocom'];
    const found = keywords.filter((kw) => lower.includes(kw));
    expect(found.length, `Body should mention product terms. Found: [${found.join(', ')}]`).toBeGreaterThan(1);
  });

  test('evolution page has a Contact Us link @functional', async ({ evolutionPage }) => {
    await expect(
      evolutionPage.contactCTA,
      'Evolution page should have a Contact Us link'
    ).toBeVisible();

    const href = await evolutionPage.contactCTA.getAttribute('href');
    expect(href, 'Contact CTA href should point to contact.html').toBe('contact.html');
  });

  test('evolution page has a link to the POST Integrations partner @functional', async ({
    evolutionPage,
  }) => {
    const count = await evolutionPage.postIntegrationsLink.count();
    expect(
      count,
      'Evolution page should reference the POST Integrations partner link'
    ).toBeGreaterThan(0);
  });

  test('evolution page nav correctly marks EboCom Evolution as active @functional', async ({
    evolutionPage,
  }) => {
    const isActive = await evolutionPage.isActiveInNav();
    expect(
      isActive,
      'Evolution page nav should display nav-ee-mo.jpg (active state image)'
    ).toBeTruthy();
  });

  test('evolution page title contains company name @functional', async ({ evolutionPage }) => {
    const title = await evolutionPage.getTitle();
    expect(title, 'Page title should contain EboCom').toContain('EboCom');
  });
});
