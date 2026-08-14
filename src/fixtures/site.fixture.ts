/**
 * src/fixtures/site.fixture.ts
 *
 * Extends Playwright's base `test` with pre-constructed page objects and the
 * loaded site config.  All test files should import {test, expect} from here
 * instead of from '@playwright/test' directly.
 *
 * Usage in test files:
 *   import { test, expect } from '@fixtures/site.fixture';
 */

import { test as base, expect } from '@playwright/test';
import { loadSiteConfig, type SiteConfig } from '@site-types/site-config.types';
import { HomePage } from '@pages/home.page';
import { NavigationPage } from '@pages/navigation.page';
import { ContactPage, ContactFormPage } from '@pages/contact.page';
import { EvolutionPage } from '@pages/evolution.page';
import { ServicesPage } from '@pages/services.page';
import { AboutPage } from '@pages/about.page';
import { PciPage } from '@pages/pci.page';

// ── Fixture type definitions ─────────────────────────────────────────────────

export interface Fixtures {
  /** Fully resolved site configuration loaded from site.config.json */
  siteConfig: SiteConfig;
  /** Pre-navigated HomePage page object */
  homePage: HomePage;
  /** NavigationPage page object (does not auto-navigate) */
  navigationPage: NavigationPage;
  /** ContactPage page object for /contact.html (does not auto-navigate) */
  contactPage: ContactPage;
  /** EboCom Evolution product page (/ee.html) — does not auto-navigate */
  evolutionPage: EvolutionPage;
  /** Services page (/services.html) — does not auto-navigate */
  servicesPage: ServicesPage;
  /** About Us page (/about.html) — does not auto-navigate */
  aboutPage: AboutPage;
  /** PCI Compliance page (/pci.html) — does not auto-navigate */
  pciPage: PciPage;
}

// ── Extended test object ─────────────────────────────────────────────────────

export const test = base.extend<Fixtures>({
  /**
   * siteConfig — loaded once per worker from site.config.json.
   * Shared across all fixtures in the same test.
   */
  siteConfig: async ({}, use) => {
    const config = loadSiteConfig();
    await use(config);
  },

  /**
   * homePage — constructs HomePage and navigates to the site root.
   * Waits for domcontentloaded before handing control to the test.
   */
  homePage: async ({ page, siteConfig }, use) => {
    const homePage = new HomePage(page, siteConfig);
    await homePage.navigate();
    await use(homePage);
  },

  /**
   * navigationPage — constructs NavigationPage without navigating.
   * Tests should call navigate() or navigate to the desired page first.
   */
  navigationPage: async ({ page, siteConfig }, use) => {
    const navigationPage = new NavigationPage(page, siteConfig);
    await use(navigationPage);
  },

  /**
   * contactPage — constructs ContactPage for /contact.html without navigating.
   * Tests should call contactPage.navigate() first.
   * NOTE: eboCom has no HTML form — contact is via mailto: links only.
   */
  contactPage: async ({ page, siteConfig }, use) => {
    const contactPage = new ContactPage(page, siteConfig);
    await use(contactPage);
  },

  /**
   * evolutionPage — constructs EvolutionPage for /ee.html without navigating.
   */
  evolutionPage: async ({ page, siteConfig }, use) => {
    const evolutionPage = new EvolutionPage(page, siteConfig);
    await use(evolutionPage);
  },

  /**
   * servicesPage — constructs ServicesPage for /services.html without navigating.
   */
  servicesPage: async ({ page, siteConfig }, use) => {
    const servicesPage = new ServicesPage(page, siteConfig);
    await use(servicesPage);
  },

  /**
   * aboutPage — constructs AboutPage for /about.html without navigating.
   */
  aboutPage: async ({ page, siteConfig }, use) => {
    const aboutPage = new AboutPage(page, siteConfig);
    await use(aboutPage);
  },

  /**
   * pciPage — constructs PciPage for /pci.html without navigating.
   */
  pciPage: async ({ page, siteConfig }, use) => {
    const pciPage = new PciPage(page, siteConfig);
    await use(pciPage);
  },
});

// Re-export expect so tests only need one import source
export { expect };

// Re-export ContactFormPage alias for backwards compatibility
export { ContactFormPage };
