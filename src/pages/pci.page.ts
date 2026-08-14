/**
 * src/pages/pci.page.ts
 *
 * PCI Compliance page — https://www.ebocom.com/pci.html
 *
 * Site notes:
 *   - No <h1>; two <h2> sections: "PCI Compliance", "PCI Certification"
 *   - Contains three external compliance resource links:
 *     - PCI Security Standards Council (pcisecuritystandards.org)
 *     - Visa CISP program (usa.visa.com)
 *     - Discover Data Security (discovernetwork.com)
 *   - Active nav: img[src='img/nav-pci-mo.jpg']
 */

import { type Locator } from '@playwright/test';
import { BasePage } from '@pages/base.page';

export class PciPage extends BasePage {
  /** All h2 headings */
  readonly allH2s: Locator;
  /** "PCI Compliance" h2 */
  readonly complianceHeading: Locator;
  /** "PCI Certification" h2 */
  readonly certificationHeading: Locator;
  /** External link to PCI Security Standards Council */
  readonly pciCouncilLink: Locator;
  /** External link to Visa CISP page */
  readonly visaCispLink: Locator;
  /** External link to Discover Data Security page */
  readonly discoverSecurityLink: Locator;
  /** Contact Us CTA */
  readonly contactCTA: Locator;
  /** Active nav indicator for this page */
  readonly activeNavImage: Locator;

  constructor(page: import('@playwright/test').Page, config: import('@site-types/site-config.types').SiteConfig) {
    super(page, config);
    this.allH2s                = page.locator('h2');
    this.complianceHeading     = page.locator('h2').nth(0);
    this.certificationHeading  = page.locator('h2').nth(1);
    this.pciCouncilLink        = page.locator("a[href*='pcisecuritystandards.org']").first();
    this.visaCispLink          = page.locator("a[href*='visa.com']").first();
    this.discoverSecurityLink  = page.locator("a[href*='discovernetwork.com']").first();
    this.contactCTA            = page.locator("a[href='contact.html']").first();
    this.activeNavImage        = page.locator("img[src='img/nav-pci-mo.jpg']");
  }

  override async navigate(): Promise<void> {
    const base = this.config.url.replace(/\/$/, '');
    await this.page.goto(`${base}/pci.html`, { waitUntil: 'domcontentloaded' });
  }

  // ── Content helpers ──────────────────────────────────────────────────────────

  /** Returns the count of h2 sections (expect 2). */
  async getSectionCount(): Promise<number> {
    return this.allH2s.count();
  }

  /** Returns true if the active nav correctly highlights this page. */
  async isActiveInNav(): Promise<boolean> {
    return (await this.activeNavImage.count()) > 0;
  }
}
