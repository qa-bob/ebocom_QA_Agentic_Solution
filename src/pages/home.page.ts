/**
 * src/pages/home.page.ts
 *
 * eboCom homepage — https://www.ebocom.com/index.html
 *
 * Site notes:
 *   - No <h1> element on this page (SEO gap — tracked in issues)
 *   - No id or class attributes on any elements; selectors use img[src] and a[href]
 *   - Navigation is image-based: <a href="..."><img src="img/nav-*.jpg" alt="..."></a>
 *   - Footer is a bare <p> element, not a <footer> landmark
 */

import { type Locator } from '@playwright/test';
import { BasePage } from '@pages/base.page';

export class HomePage extends BasePage {
  /** Company logo image */
  readonly logo: Locator;
  /** Page banner / header image */
  readonly headerBanner: Locator;
  /** All body-level paragraphs (main content — no wrapper element) */
  readonly bodyParagraphs: Locator;
  /** All navigation anchor+image links */
  readonly navLinks: Locator;
  /** Footer: Home link */
  readonly footerHomeLink: Locator;
  /** Footer: Contact Us link */
  readonly footerContactLink: Locator;
  /** Footer: Terms & Conditions link */
  readonly footerTermsLink: Locator;

  override async navigate(): Promise<void> {
    await this.page.goto(this.config.url, { waitUntil: 'domcontentloaded' });
  }

  constructor(page: import('@playwright/test').Page, config: import('@site-types/site-config.types').SiteConfig) {
    super(page, config);
    this.logo           = page.locator("img[src='img/logo-ebocom.jpg']");
    this.headerBanner   = page.locator("img[src='img/pg-hdr.jpg']");
    this.bodyParagraphs = page.locator('body > p');
    this.navLinks       = page.locator("a:has(img[src*='img/nav-'])");
    this.footerHomeLink    = page.locator("a[href='index.html']").last();
    this.footerContactLink = page.locator("a[href='contact.html']").last();
    this.footerTermsLink   = page.locator("a[href='terms.html']");
  }

  // ── Load verification ───────────────────────────────────────────────────────

  async isLoaded(): Promise<boolean> {
    try {
      const logoVisible = await this.logo.isVisible();
      if (!logoVisible) return false;
      const navCount = await this.navLinks.count();
      return navCount >= 7;
    } catch {
      return false;
    }
  }

  // ── Headings ────────────────────────────────────────────────────────────────

  /**
   * Returns the first <h1> text, or empty string if none.
   * NOTE: The eboCom homepage has no <h1> — this method will return ''.
   */
  async getMainHeading(): Promise<string> {
    const h1 = this.page.locator('h1').first();
    if (await h1.count() > 0) {
      return (await h1.textContent())?.trim() ?? '';
    }
    return '';
  }

  // ── Content ─────────────────────────────────────────────────────────────────

  /** Returns the text of the first body paragraph (intro/tagline). */
  async getHeroText(): Promise<string> {
    const first = this.bodyParagraphs.first();
    if (await first.count() === 0) return '';
    return (await first.textContent())?.trim() ?? '';
  }

  /** Returns all <a href="contact.html"> links on the page (CTAs). */
  async getCTAButtons(): Promise<Locator[]> {
    return this.page.locator("a[href='contact.html']").all();
  }

  // ── Footer ───────────────────────────────────────────────────────────────────

  /** Returns true if all three footer links are present. */
  async hasFooterLinks(): Promise<boolean> {
    const homeCount    = await this.page.locator("a[href='index.html']").count();
    const contactCount = await this.page.locator("a[href='contact.html']").count();
    const termsCount   = await this.page.locator("a[href='terms.html']").count();
    return homeCount > 0 && contactCount > 0 && termsCount > 0;
  }
}
