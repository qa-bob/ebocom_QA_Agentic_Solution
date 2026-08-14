# AGENTS.md — eboCom QA Agentic Solution

> This file guides AI coding assistants (GitHub Copilot, Cursor, Windsurf, OpenAI Codex, etc.) on how to work in this repository.
> **Claude Code users:** Claude reads `CLAUDE.md` instead. `CLAUDE.md` imports this file.

---

## Repository purpose

This repository is a **Playwright + TypeScript regression test suite** for `https://www.ebocom.com` (a B2B payments processing software company). It uses the **Page Object Model (POM)** design pattern and **OOP** principles.

---

## What this repo tests

- Site availability, HTTPS, page title, console errors (smoke)
- Navigation links, mobile menu, logo, 404 detection (navigation)
- Contact form fields, validation, accessibility — **never submitting** (forms)
- Business features: hero CTA, services, accordions, video embeds (functional)
- Screenshot comparison at 3 viewport sizes (visual regression)
- Responsive layout: horizontal overflow, font sizes, alt text (responsive)

---

## Key constraints

- **Never submit any form** — test field interactions and browser validation only
- **Never create accounts** or enter real credentials
- **Never hardcode the base URL** — use `siteConfig.url` or the `baseURL` from `playwright.config.ts`
- **No `expect()` calls inside page objects** — assertions belong in spec files
- **No `page.waitForTimeout()` longer than 500ms** — use Playwright's auto-waiting or `waitForSelector`
- **No `any` type** without an explicit comment explaining why

---

## Architecture

```
src/
  pages/          ← Page Object classes (extend BasePage)
  fixtures/       ← Custom Playwright fixtures (import test from here)
  utils/          ← Shared helpers
  types/          ← TypeScript interfaces

tests/
  smoke/          ← @smoke tag
  navigation/     ← @navigation tag
  forms/          ← @forms tag
  functional/     ← @functional tag
  visual/         ← @visual tag
  responsive/     ← @responsive tag
```

---

## Page Object Model rules

Every page or major section must have its own class in `src/pages/`:

```typescript
import { type Locator } from '@playwright/test';
import { BasePage } from '@pages/base.page';

export class ExamplePage extends BasePage {
  // Locators are readonly properties
  readonly heroHeading: Locator;
  readonly ctaButton: Locator;

  constructor(page: Page, config: SiteConfig) {
    super(page, config);
    this.heroHeading = page.locator('h1').first();
    this.ctaButton = page.getByRole('link', { name: /get started/i });
  }

  // Methods model user actions, not assertions
  async clickCTA(): Promise<void> {
    await this.ctaButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }
}
```

---

## Test file conventions

```typescript
// Always import from the custom fixture, not from @playwright/test
import { test, expect } from '@fixtures/site.fixture';

test.describe('Feature Name @tag', () => {
  test('descriptive test name @tag', async ({ homePage, siteConfig }) => {
    // Use page objects, not raw page.locator() in test bodies
    const heading = await homePage.getMainHeading();
    expect(heading).toBeTruthy();
  });
});
```

Test tags: `@smoke` | `@navigation` | `@forms` | `@functional` | `@visual` | `@responsive`

---

## TypeScript path aliases

| Alias | Resolves to |
|-------|-------------|
| `@pages/*` | `src/pages/*` |
| `@fixtures/*` | `src/fixtures/*` |
| `@utils/*` | `src/utils/*` |
| `@site-types/*` | `src/types/*` |

---

## Configuration file

`site.config.json` at the project root controls the target site, feature flags, and expected nav items. **Always read this file before generating or modifying tests.**

---

## Running tests

```bash
npm test                    # Full suite
npm run test:smoke          # Smoke only
npm run test:navigation     # Navigation only
npm run test:forms          # Forms only
npm run test:visual         # Visual regression only
npm run test:responsive     # Responsive only
npm run baseline            # Update visual snapshots
npm run typecheck           # TypeScript check (run before PR)
npm run lint                # ESLint (run before PR)
```

---

## What AI agents should NOT do

- Submit, click submit on, or programmatically POST any form
- Create user accounts or enter credentials
- Hardcode `https://www.ebocom.com` — derive from config
- Put assertions (`expect`) inside page object methods
- Generate tests for pages that require authentication (auth.required is false)
- Use `page.waitForTimeout()` for timing hacks — use proper Playwright waits
- Generate files outside the established directory structure
- Use `any` type implicitly

---

## Before finishing any code change

1. Run `npm run typecheck` — must pass with zero errors
2. Run `npm run lint` — must pass with zero errors
3. Ensure every new test has at least one valid tag
4. If adding visual tests: document that `npm run baseline` must be run first
