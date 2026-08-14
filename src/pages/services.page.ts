/**
 * src/pages/services.page.ts
 *
 * Services page — https://www.ebocom.com/services.html
 *
 * Site notes:
 *   - No <h1>; three <h2> sections: "Services", "Back-End Credit Card Processing",
 *     "Strategic Partners"
 *   - Bullet items implemented as <img src="img/blue-bullet.jpg"> (not <ul>/<li>)
 *   - Intra-page section anchors: #be (Back-End), #sp (Strategic Partners)
 *   - Strategic Partners lists card companies, front-end processors, gateways/middleware
 *   - Active nav: img[src='img/nav-services-mo.jpg']
 */

import { type Locator } from '@playwright/test';
import { BasePage } from '@pages/base.page';

export class ServicesPage extends BasePage {
  /** "Services" — first h2 */
  readonly servicesHeading: Locator;
  /** "Back-End Credit Card Processing" — second h2 */
  readonly backEndHeading: Locator;
  /** "Strategic Partners" — third h2 */
  readonly strategicPartnersHeading: Locator;
  /** All blue-bullet list-item images (count = number of service items) */
  readonly bulletItems: Locator;
  /** All h2 elements on the page */
  readonly allH2s: Locator;
  /** Active nav indicator for this page */
  readonly activeNavImage: Locator;
  /** Contact Us CTA link */
  readonly contactCTA: Locator;
  /** Intra-page link to Back-End section */
  readonly backEndAnchor: Locator;
  /** Intra-page link to Strategic Partners section */
  readonly strategicPartnersAnchor: Locator;

  constructor(page: import('@playwright/test').Page, config: import('@site-types/site-config.types').SiteConfig) {
    super(page, config);
    this.servicesHeading            = page.locator('h2').nth(0);
    this.backEndHeading             = page.locator('h2').nth(1);
    this.strategicPartnersHeading   = page.locator('h2').nth(2);
    this.bulletItems                = page.locator("img[src='img/blue-bullet.jpg']");
    this.allH2s                     = page.locator('h2');
    this.activeNavImage             = page.locator("img[src='img/nav-services-mo.jpg']");
    this.contactCTA                 = page.locator("a[href='contact.html']").first();
    this.backEndAnchor              = page.locator("a[href='services.html#be']");
    this.strategicPartnersAnchor    = page.locator("a[href='services.html#sp']");
  }

  override async navigate(): Promise<void> {
    const base = this.config.url.replace(/\/$/, '');
    await this.page.goto(`${base}/services.html`, { waitUntil: 'domcontentloaded' });
  }

  // ── Content helpers ──────────────────────────────────────────────────────────

  /** Returns the count of h2 sections on this page (expect 3). */
  async getSectionCount(): Promise<number> {
    return this.allH2s.count();
  }

  /** Returns the count of bullet-image list items. */
  async getBulletItemCount(): Promise<number> {
    return this.bulletItems.count();
  }

  /** Returns true if the active nav correctly highlights this page. */
  async isActiveInNav(): Promise<boolean> {
    return (await this.activeNavImage.count()) > 0;
  }
}
