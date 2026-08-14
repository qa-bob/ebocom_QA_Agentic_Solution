/**
 * src/pages/contact.page.ts
 *
 * eboCom Contact Us page — https://www.ebocom.com/contact.html
 *
 * Site notes:
 *   - No HTML form — contact is via mailto: links only
 *   - hasContactForm: false, skipForms: true in site.config.json
 *   - Two email addresses: info@ebocom.net (general) and jobs@ebocom.net (careers)
 *   - Contains corporate headquarters address (Phoenix, AZ)
 *   - Only page on the site with a semantic <footer> element
 *   - URL: /contact.html (not /contact — /contact returns 404)
 */

import { type Locator } from '@playwright/test';
import { BasePage } from '@pages/base.page';

export interface ContactEmailInfo {
  address: string;
  href: string;
}

export class ContactPage extends BasePage {
  /** Primary "Contact Us" heading (h2) */
  readonly heading: Locator;
  /** General inquiries mailto link */
  readonly generalEmailLink: Locator;
  /** Career inquiries mailto link */
  readonly careerEmailLink: Locator;
  /** Semantic footer (unique to this page — other pages use bare <p>) */
  readonly footer: Locator;
  /** Corporate Headquarters h3 */
  readonly headquartersHeading: Locator;

  constructor(page: import('@playwright/test').Page, config: import('@site-types/site-config.types').SiteConfig) {
    super(page, config);
    this.heading             = page.locator('h2').first();
    this.generalEmailLink    = page.locator("a[href='mailto:info@ebocom.net']");
    this.careerEmailLink     = page.locator("a[href='mailto:jobs@ebocom.net']");
    this.footer              = page.locator('footer');
    this.headquartersHeading = page.locator('h3').first();
  }

  override async navigate(): Promise<void> {
    const base = this.config.url.replace(/\/$/, '');
    await this.page.goto(`${base}/contact.html`, { waitUntil: 'domcontentloaded' });
  }

  // ── Content helpers ──────────────────────────────────────────────────────────

  /** Returns the heading text ("Contact Us") */
  async getHeadingText(): Promise<string> {
    return (await this.heading.textContent())?.trim() ?? '';
  }

  /** Returns the general inquiries email address text. */
  async getGeneralEmail(): Promise<string> {
    return (await this.generalEmailLink.textContent())?.trim() ?? '';
  }

  /** Returns the careers email address text. */
  async getCareerEmail(): Promise<string> {
    return (await this.careerEmailLink.textContent())?.trim() ?? '';
  }

  /** Returns all mailto: links on the page as { address, href } objects. */
  async getEmailLinks(): Promise<ContactEmailInfo[]> {
    const mailtoLinks = this.page.locator("a[href^='mailto:']");
    const count = await mailtoLinks.count();
    const results: ContactEmailInfo[] = [];

    for (let i = 0; i < count; i++) {
      const link = mailtoLinks.nth(i);
      const href = (await link.getAttribute('href')) ?? '';
      const address = href.replace('mailto:', '').trim();
      results.push({ address, href });
    }

    return results;
  }

  // ── Legacy form interface (returns safe no-op values since no form exists) ───

  /** Always returns null — eboCom contact page has no HTML form. */
  async findContactForm(): Promise<Locator | null> {
    return null;
  }

  /** Always returns false — no form present. */
  async hasEmailField(): Promise<boolean> {
    return false;
  }

  /** Always returns false — no form present. */
  async hasSubmitButton(): Promise<boolean> {
    return false;
  }

  /** Always returns false — no form present. */
  async hasNameField(): Promise<boolean> {
    return false;
  }

  /** Always returns an empty array — no form present. */
  async getFormFields(): Promise<Array<{ name: string; type: string }>> {
    return [];
  }
}

// Re-export as ContactFormPage for backwards compatibility with existing specs
export { ContactPage as ContactFormPage };
