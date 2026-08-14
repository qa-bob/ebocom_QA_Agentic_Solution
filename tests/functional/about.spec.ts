/**
 * tests/functional/about.spec.ts
 *
 * Functional tests for the About Us page (/about.html).
 *
 * Page structure:
 *   - h2[0]: "About Us"
 *   - h2[1]: "Our Mission"
 *   - h2[2]: "Our Founder" (Mary Gerdts, CEO/Founder)
 *   - h2[3]: "Industry Affiliations"
 *   - Founder photo: img/profile-gerdts.jpg
 *   - External affiliate links: POST Integrations, ETA, PCI Security Standards Council
 *
 * Tag: @functional
 */

import { test, expect } from '@fixtures/site.fixture';

test.describe('About Us Page @functional', () => {
  test.beforeEach(async ({ aboutPage }) => {
    await aboutPage.navigate();
    await aboutPage.waitForLoad();
  });

  test('about page loads and has the correct title @functional', async ({ aboutPage }) => {
    const title = await aboutPage.getTitle();
    expect(title).toContain('EboCom');
    expect(title.toLowerCase()).toContain('about');
  });

  test('about page has 4 content sections @functional', async ({ aboutPage }) => {
    const count = await aboutPage.getSectionCount();
    expect(count, 'About page should have 4 h2 sections').toBe(4);
  });

  test('about page h2 sections have expected headings @functional', async ({ aboutPage }) => {
    const aboutText = await aboutPage.aboutHeading.textContent();
    const missionText = await aboutPage.missionHeading.textContent();
    const founderText = await aboutPage.founderHeading.textContent();
    const affiliationsText = await aboutPage.affiliationsHeading.textContent();

    expect(aboutText?.trim().toLowerCase()).toContain('about');
    expect(missionText?.trim().toLowerCase()).toContain('mission');
    expect(founderText?.trim().toLowerCase()).toContain('founder');
    expect(affiliationsText?.trim().toLowerCase()).toContain('affiliation');
  });

  test('founder profile photo is present @functional', async ({ aboutPage }) => {
    const photoCount = await aboutPage.founderPhoto.count();
    expect(photoCount, 'Founder profile photo (profile-gerdts.jpg) should be present').toBeGreaterThan(0);
  });

  test('industry affiliations section has external links @functional', async ({ aboutPage }) => {
    // POST Integrations
    const postCount = await aboutPage.postIntegrationsLink.count();
    expect(postCount, 'POST Integrations partner link should be present').toBeGreaterThan(0);

    // Electronic Transactions Association
    const etaCount = await aboutPage.etaLink.count();
    expect(etaCount, 'ETA (Electronic Transactions Association) link should be present').toBeGreaterThan(0);

    // PCI Security Standards Council
    const pciCount = await aboutPage.pciCouncilLink.count();
    expect(pciCount, 'PCI Security Standards Council link should be present').toBeGreaterThan(0);
  });

  test('about page nav marks About Us as active @functional', async ({ aboutPage }) => {
    const isActive = await aboutPage.isActiveInNav();
    expect(isActive, 'About page nav should display nav-about-mo.jpg (active state)').toBeTruthy();
  });

  test('about page body mentions the company founder @functional', async ({ aboutPage }) => {
    const bodyText = (await aboutPage.page.locator('body').textContent() ?? '').toLowerCase();
    expect(
      bodyText,
      'About page should mention the company founder'
    ).toContain('gerdts');
  });

  test('about page body mentions company mission or payment focus @functional', async ({
    aboutPage,
  }) => {
    const bodyText = (await aboutPage.page.locator('body').textContent() ?? '').toLowerCase();
    const keywords = ['mission', 'payment', 'merchant', 'processor', 'electronic'];
    const found = keywords.filter((kw) => bodyText.includes(kw));
    expect(
      found.length,
      `About page should describe company mission. Found: [${found.join(', ')}]`
    ).toBeGreaterThan(0);
  });
});
