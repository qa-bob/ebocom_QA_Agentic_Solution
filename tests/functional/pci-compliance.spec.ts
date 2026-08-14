/**
 * tests/functional/pci-compliance.spec.ts
 *
 * Functional tests for the PCI Compliance page (/pci.html).
 *
 * Page structure:
 *   - h2[0]: "PCI Compliance"
 *   - h2[1]: "PCI Certification"
 *   - Three external compliance links:
 *     - PCI Security Standards Council (pcisecuritystandards.org)
 *     - Visa CISP (usa.visa.com)
 *     - Discover Data Security (discovernetwork.com)
 *
 * Tag: @functional
 */

import { test, expect } from '@fixtures/site.fixture';

test.describe('PCI Compliance Page @functional', () => {
  test.beforeEach(async ({ pciPage }) => {
    await pciPage.navigate();
    await pciPage.waitForLoad();
  });

  test('PCI page loads and has the correct title @functional', async ({ pciPage }) => {
    const title = await pciPage.getTitle();
    expect(title).toContain('EboCom');
    expect(title.toLowerCase()).toContain('pci');
  });

  test('PCI page has 2 content sections @functional', async ({ pciPage }) => {
    const count = await pciPage.getSectionCount();
    expect(count, 'PCI page should have 2 h2 sections').toBe(2);
  });

  test('PCI page section headings have expected text @functional', async ({ pciPage }) => {
    const h1Text = await pciPage.complianceHeading.textContent();
    const h2Text = await pciPage.certificationHeading.textContent();

    expect(h1Text?.trim().toLowerCase()).toContain('pci');
    expect(h2Text?.trim().toLowerCase()).toContain('certif');
  });

  test('PCI Security Standards Council link is present @functional', async ({ pciPage }) => {
    await expect(
      pciPage.pciCouncilLink,
      'Link to PCI Security Standards Council should be present'
    ).toBeVisible();

    const href = await pciPage.pciCouncilLink.getAttribute('href');
    expect(href).toContain('pcisecuritystandards.org');
  });

  test('Visa CISP link is present @functional', async ({ pciPage }) => {
    await expect(
      pciPage.visaCispLink,
      'Link to Visa CISP program should be present'
    ).toBeVisible();

    const href = await pciPage.visaCispLink.getAttribute('href');
    expect(href).toContain('visa.com');
  });

  test('Discover Data Security link is present @functional', async ({ pciPage }) => {
    await expect(
      pciPage.discoverSecurityLink,
      'Link to Discover Data Security should be present'
    ).toBeVisible();

    const href = await pciPage.discoverSecurityLink.getAttribute('href');
    expect(href).toContain('discovernetwork.com');
  });

  test('PCI page has a Contact Us link @functional', async ({ pciPage }) => {
    await expect(
      pciPage.contactCTA,
      'PCI page should have a Contact Us link'
    ).toBeVisible();
  });

  test('PCI page nav marks PCI Compliance as active @functional', async ({ pciPage }) => {
    const isActive = await pciPage.isActiveInNav();
    expect(isActive, 'PCI page nav should display nav-pci-mo.jpg (active state)').toBeTruthy();
  });

  test('PCI page body contains compliance terminology @functional', async ({ pciPage }) => {
    const bodyText = (await pciPage.page.locator('body').textContent() ?? '').toLowerCase();
    const keywords = ['pci', 'compliance', 'security', 'payment card', 'certification'];
    const found = keywords.filter((kw) => bodyText.includes(kw));
    expect(
      found.length,
      `PCI page should contain compliance terms. Found: [${found.join(', ')}]`
    ).toBeGreaterThan(1);
  });
});
