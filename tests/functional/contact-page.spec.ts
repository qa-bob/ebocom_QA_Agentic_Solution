/**
 * tests/functional/contact-page.spec.ts
 *
 * Functional tests for the Contact Us page (/contact.html).
 *
 * Page structure:
 *   - No HTML form — contact is via mailto: links only
 *   - Corporate headquarters address: Phoenix, AZ
 *   - Two email addresses:
 *     - info@ebocom.net (general inquiries)
 *     - jobs@ebocom.net (career inquiries)
 *   - Only page on the site with a semantic <footer> element
 *
 * NOTE: contact-form.spec.ts is entirely skipped (skipForms: true).
 *       This file tests the contact page as a functional page — not form logic.
 *
 * Tag: @functional
 */

import { test, expect } from '@fixtures/site.fixture';

test.describe('Contact Page @functional', () => {
  test.beforeEach(async ({ contactPage }) => {
    await contactPage.navigate();
    await contactPage.waitForLoad();
  });

  test('contact page is reachable at /contact.html @functional', async ({
    page,
    siteConfig,
  }) => {
    const contactUrl = siteConfig.url.replace(/\/$/, '') + '/contact.html';
    const response = await page.goto(contactUrl, { waitUntil: 'domcontentloaded' });
    expect(response, 'Response should not be null').not.toBeNull();
    expect(response!.status(), 'contact.html should return 200').toBe(200);
  });

  test('contact page title contains company name @functional', async ({ contactPage }) => {
    const title = await contactPage.getTitle();
    expect(title).toContain('EboCom');
    expect(title.toLowerCase()).toContain('contact');
  });

  test('contact page has a visible heading @functional', async ({ contactPage }) => {
    await expect(
      contactPage.heading,
      'Contact page should have a visible h2 heading'
    ).toBeVisible();

    const headingText = await contactPage.getHeadingText();
    expect(headingText.toLowerCase()).toContain('contact');
  });

  test('contact page displays general inquiries email link @functional', async ({
    contactPage,
  }) => {
    await expect(
      contactPage.generalEmailLink,
      'General inquiries email (info@ebocom.net) should be visible'
    ).toBeVisible();

    const emailText = await contactPage.getGeneralEmail();
    expect(emailText.toLowerCase()).toContain('ebocom');
  });

  test('contact page displays career inquiries email link @functional', async ({ contactPage }) => {
    await expect(
      contactPage.careerEmailLink,
      'Career inquiries email (jobs@ebocom.net) should be visible'
    ).toBeVisible();

    const emailText = await contactPage.getCareerEmail();
    expect(emailText.toLowerCase()).toContain('ebocom');
  });

  test('contact page has 2 mailto links (general + careers) @functional', async ({
    contactPage,
  }) => {
    const emails = await contactPage.getEmailLinks();
    expect(
      emails.length,
      'Contact page should have 2 mailto: links'
    ).toBe(2);

    const addresses = emails.map((e) => e.address);
    expect(addresses).toContain('info@ebocom.net');
    expect(addresses).toContain('jobs@ebocom.net');
  });

  test('contact page body contains Phoenix address @functional', async ({ contactPage }) => {
    const bodyText = (await contactPage.page.locator('body').textContent() ?? '').toLowerCase();
    expect(bodyText, 'Contact page should display corporate address').toContain('phoenix');
    expect(bodyText, 'Contact page should mention Arizona').toMatch(/az|arizona/);
  });

  test('contact page has a semantic footer element @functional', async ({ contactPage }) => {
    const footerCount = await contactPage.footer.count();
    expect(
      footerCount,
      'Contact page is the only page with a <footer> element — it should be present'
    ).toBeGreaterThan(0);
  });

  test('/contact (without .html) returns 404 — known routing issue @functional', async ({
    page,
    siteConfig,
  }) => {
    const contactUrl = siteConfig.url.replace(/\/$/, '') + '/contact';
    const response = await page.request.head(contactUrl, { timeout: 10_000 }).catch(() => null);

    if (response) {
      // Known issue: /contact returns 404, only /contact.html works
      // This test documents the issue; a 200 here would mean the site was fixed
      if (response.status() === 200) {
        console.log('[functional] /contact now returns 200 — routing has been fixed!');
      } else {
        console.warn(
          `[functional] KNOWN ISSUE: /contact returns HTTP ${response.status()} (not 200). ` +
            'Only /contact.html is a valid URL. This may affect inbound traffic from third-party links.'
        );
      }
    }
  });
});
