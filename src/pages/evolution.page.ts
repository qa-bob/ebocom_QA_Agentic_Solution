/**
 * src/pages/evolution.page.ts
 *
 * EboCom Evolution product page — https://www.ebocom.com/ee.html
 *
 * Site notes:
 *   - The only page with a semantic <h1> element
 *   - Describes the EboCom Evolution payment processing system
 *   - Contains a link to an external partner: POST Integrations (postint.com)
 *   - Active nav: img[src='img/nav-ee-mo.jpg']
 */

import { type Locator } from '@playwright/test';
import { BasePage } from '@pages/base.page';

export class EvolutionPage extends BasePage {
  /** Primary h1 heading — unique to this page across the site */
  readonly pageHeading: Locator;
  /** Active nav indicator for this page */
  readonly activeNavImage: Locator;
  /** Body content paragraphs */
  readonly bodyParagraphs: Locator;
  /** Contact Us CTA link */
  readonly contactCTA: Locator;
  /** External partner link (POST Integrations) */
  readonly postIntegrationsLink: Locator;

  constructor(page: import('@playwright/test').Page, config: import('@site-types/site-config.types').SiteConfig) {
    super(page, config);
    this.pageHeading        = page.locator('h1').first();
    this.activeNavImage     = page.locator("img[src='img/nav-ee-mo.jpg']");
    this.bodyParagraphs     = page.locator('body > p');
    this.contactCTA         = page.locator("a[href='contact.html']").first();
    this.postIntegrationsLink = page.locator("a[href*='postint.com']").first();
  }

  override async navigate(): Promise<void> {
    const base = this.config.url.replace(/\/$/, '');
    await this.page.goto(`${base}/ee.html`, { waitUntil: 'domcontentloaded' });
  }

  // ── Content helpers ──────────────────────────────────────────────────────────

  /** Returns the h1 text ("EboCom Evolution"). */
  async getHeadingText(): Promise<string> {
    return (await this.pageHeading.textContent())?.trim() ?? '';
  }

  /** Returns the combined body text for content assertion. */
  async getBodyText(): Promise<string> {
    return (await this.page.locator('body').textContent())?.trim() ?? '';
  }

  /** Returns true if the active nav correctly highlights this page. */
  async isActiveInNav(): Promise<boolean> {
    return (await this.activeNavImage.count()) > 0;
  }
}
