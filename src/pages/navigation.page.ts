/**
 * src/pages/navigation.page.ts
 *
 * eboCom site navigation — image-based nav, no <nav> element, no id/class attributes.
 *
 * Site notes:
 *   - Nav links: <a href="page.html"><img src="img/nav-page.jpg" alt="Page Name"></a>
 *   - Active page indicator: the active nav image uses a "-mo" suffix
 *     e.g. nav-services-mo.jpg when on services.html
 *   - No mobile hamburger menu — site has no responsive design
 *   - hrefs are relative (e.g. "ee.html") — resolved against config.url for HEAD requests
 */

import { type Locator } from '@playwright/test';
import { BasePage } from '@pages/base.page';

export interface NavLinkInfo {
  text: string;
  href: string;
}

export interface LinkCheckResult {
  url: string;
  status: number;
  ok: boolean;
}

/** Expected nav items in display order */
export const EXPECTED_NAV_HREFS = [
  'ee.html',
  'about.html',
  'services.html',
  'pci.html',
  'awards.html',
  'media.html',
  'jobs.html',
] as const;

export class NavigationPage extends BasePage {
  // ── Nav detection ────────────────────────────────────────────────────────────

  /**
   * Locator for all navigation anchor elements.
   * Matches <a> tags that contain an <img> with a "nav-" src — this reliably
   * excludes the logo, footer links, and body content links.
   */
  private getNavLocator(): Locator {
    return this.page.locator("a:has(img[src*='img/nav-'])");
  }

  /** Returns true if at least one nav link is present on the page. */
  async isNavVisible(): Promise<boolean> {
    const count = await this.getNavLocator().count();
    return count > 0;
  }

  // ── Nav links ────────────────────────────────────────────────────────────────

  /**
   * Return all navigation links with their text (from img alt) and href.
   * Falls back to inferring text from the href filename if alt is empty.
   */
  async getNavLinks(): Promise<NavLinkInfo[]> {
    const links = this.getNavLocator();
    const count = await links.count();
    const results: NavLinkInfo[] = [];

    for (let i = 0; i < count; i++) {
      const link = links.nth(i);
      const href = (await link.getAttribute('href')) ?? '';
      if (!href || href.startsWith('javascript:') || href.startsWith('mailto:')) continue;

      // Alt text on the nav image is the nav item label
      const img = link.locator('img').first();
      const alt = ((await img.getAttribute('alt')) ?? '').trim();

      // Fallback: infer readable name from filename (e.g. "ee.html" → "EboCom Evolution")
      const inferredText = alt || href.replace('.html', '').replace(/-/g, ' ');
      results.push({ text: inferredText, href });
    }

    return results;
  }

  /**
   * Click a nav item by its href filename (e.g. 'services.html').
   * More reliable than text matching since nav text comes from image alt attributes.
   */
  async clickNavItemByHref(href: string): Promise<void> {
    const link = this.page.locator(`a[href='${href}']`).first();
    await link.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  // ── Active page detection ────────────────────────────────────────────────────

  /**
   * Returns the href of the currently active nav item.
   * The active page's nav image uses a "-mo" suffix (e.g. nav-ee-mo.jpg).
   */
  async getActiveNavHref(): Promise<string | null> {
    const activeImg = this.page.locator("img[src*='nav-'][src*='-mo.jpg']").first();
    if (await activeImg.count() === 0) return null;

    const parentLink = activeImg.locator('xpath=..');
    const href = await parentLink.getAttribute('href');
    return href ?? null;
  }

  // ── Mobile menu ──────────────────────────────────────────────────────────────

  /**
   * eboCom has no mobile hamburger menu — the site is a fixed-width static layout.
   * Always returns null.
   */
  async getMobileMenuToggle(): Promise<Locator | null> {
    return null;
  }

  async openMobileMenu(): Promise<void> {
    // No mobile menu on this site
  }

  // ── Link reachability ────────────────────────────────────────────────────────

  /**
   * Issue HEAD requests to all nav link hrefs and return status results.
   * Resolves relative hrefs (e.g. "ee.html") against config.url.
   */
  async checkAllNavLinksReachable(): Promise<LinkCheckResult[]> {
    const navLinks = await this.getNavLinks();
    const baseUrl = new URL(this.config.url);
    const results: LinkCheckResult[] = [];

    for (const link of navLinks) {
      let absoluteUrl: string;
      try {
        absoluteUrl = new URL(link.href, baseUrl).toString();
      } catch {
        results.push({ url: link.href, status: 0, ok: false });
        continue;
      }

      try {
        const response = await this.page.request.head(absoluteUrl, { timeout: 10_000 });
        results.push({ url: absoluteUrl, status: response.status(), ok: response.ok() });
      } catch {
        results.push({ url: absoluteUrl, status: 0, ok: false });
      }
    }

    return results;
  }

  // ── Footer links ─────────────────────────────────────────────────────────────

  /**
   * Returns true if the three expected footer links are present:
   * Home (index.html), Contact Us (contact.html), Terms & Conditions (terms.html).
   */
  async hasFooterLinks(): Promise<boolean> {
    const home    = await this.page.locator("a[href='index.html']").count();
    const contact = await this.page.locator("a[href='contact.html']").count();
    const terms   = await this.page.locator("a[href='terms.html']").count();
    return home > 0 && contact > 0 && terms > 0;
  }
}
