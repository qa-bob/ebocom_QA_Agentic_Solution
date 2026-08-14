/**
 * src/pages/about.page.ts
 *
 * About Us page — https://www.ebocom.com/about.html
 *
 * Site notes:
 *   - No <h1>; four <h2> sections: "About Us", "Our Mission", "Our Founder",
 *     "Industry Affiliations"
 *   - Contains founder profile photo (profile-gerdts.jpg)
 *   - Three external affiliate links: POST Integrations, ETA, PCI Security Standards Council
 *   - Intra-page TOC links at the top (about.html, about.html#f, about.html#ia)
 *   - Active nav: img[src='img/nav-about-mo.jpg']
 */

import { type Locator } from '@playwright/test';
import { BasePage } from '@pages/base.page';

export class AboutPage extends BasePage {
  /** All h2 section headings */
  readonly allH2s: Locator;
  /** "About Us" h2 */
  readonly aboutHeading: Locator;
  /** "Our Mission" h2 */
  readonly missionHeading: Locator;
  /** "Our Founder" h2 */
  readonly founderHeading: Locator;
  /** "Industry Affiliations" h2 */
  readonly affiliationsHeading: Locator;
  /** Founder profile photo */
  readonly founderPhoto: Locator;
  /** External link to POST Integrations */
  readonly postIntegrationsLink: Locator;
  /** External link to ETA (Electronic Transactions Association) */
  readonly etaLink: Locator;
  /** External link to PCI Security Standards Council */
  readonly pciCouncilLink: Locator;
  /** Active nav indicator for this page */
  readonly activeNavImage: Locator;

  constructor(page: import('@playwright/test').Page, config: import('@site-types/site-config.types').SiteConfig) {
    super(page, config);
    this.allH2s              = page.locator('h2');
    this.aboutHeading        = page.locator('h2').nth(0);
    this.missionHeading      = page.locator('h2').nth(1);
    this.founderHeading      = page.locator('h2').nth(2);
    this.affiliationsHeading = page.locator('h2').nth(3);
    this.founderPhoto        = page.locator("img[src='img/profile-gerdts.jpg']");
    this.postIntegrationsLink = page.locator("a[href*='postint.com']").first();
    this.etaLink             = page.locator("a[href*='electran.org']").first();
    this.pciCouncilLink      = page.locator("a[href*='pcisecuritystandards.org']").first();
    this.activeNavImage      = page.locator("img[src='img/nav-about-mo.jpg']");
  }

  override async navigate(): Promise<void> {
    const base = this.config.url.replace(/\/$/, '');
    await this.page.goto(`${base}/about.html`, { waitUntil: 'domcontentloaded' });
  }

  // ── Content helpers ──────────────────────────────────────────────────────────

  /** Returns the count of h2 sections (expect 4). */
  async getSectionCount(): Promise<number> {
    return this.allH2s.count();
  }

  /** Returns true if the active nav correctly highlights this page. */
  async isActiveInNav(): Promise<boolean> {
    return (await this.activeNavImage.count()) > 0;
  }
}
