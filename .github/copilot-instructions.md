# GitHub Copilot Instructions — eboCom QA Suite

This repository is a **Playwright + TypeScript regression test suite** for `https://www.ebocom.com` using the **Page Object Model (POM)** pattern.

## Project constraints

- **Never submit a form** in any test — test field interactions and validation only
- **Never hardcode the site URL** — always read from `siteConfig.url` (loaded from `site.config.json`)
- **No `expect()` inside page object methods** — assertions belong in spec files only
- **No `page.waitForTimeout()` over 500ms** — use Playwright's built-in auto-waiting
- TypeScript strict mode is on — no implicit `any`

## Where things live

| What you're writing | Where it goes |
|---------------------|---------------|
| Page selectors + actions | `src/pages/<name>.page.ts` extending `BasePage` |
| Test fixtures | `src/fixtures/site.fixture.ts` |
| Smoke tests | `tests/smoke/` |
| Navigation tests | `tests/navigation/` |
| Form tests | `tests/forms/` |
| Business feature tests | `tests/functional/` |
| Visual regression | `tests/visual/` |
| Responsive layout | `tests/responsive/` |

## How to import in test files

```typescript
// Always use the custom fixture — not @playwright/test directly
import { test, expect } from '@fixtures/site.fixture';
```

## Path aliases

| Alias | Path |
|-------|------|
| `@pages/*` | `src/pages/*` |
| `@fixtures/*` | `src/fixtures/*` |
| `@utils/*` | `src/utils/*` |
| `@types/*` | `src/types/*` |

## Tagging — every test needs a tag

`@smoke` | `@navigation` | `@forms` | `@functional` | `@visual` | `@responsive`

## Page object pattern

```typescript
import { type Page, type Locator } from '@playwright/test';
import { BasePage } from '@pages/base.page';
import type { SiteConfig } from '@types/site-config.types';

export class MyPage extends BasePage {
  readonly heading: Locator;

  constructor(page: Page, config: SiteConfig) {
    super(page, config);
    this.heading = page.locator('h1').first();
  }

  async clickCTA(): Promise<void> {
    await page.getByRole('link', { name: /get started/i }).click();
  }
}
```

## Running tests

```bash
npm test                 # All tests
npm run test:smoke       # Smoke only
npm run typecheck        # TypeScript check
npm run lint             # ESLint
```
