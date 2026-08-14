# Contributing to the eboCom QA Suite

Thank you for contributing! This guide covers everything you need to know before opening a pull request.

---

## Setup

Follow the [README](../README.md#development-environment-setup) to install Node.js, npm dependencies, and Playwright browser binaries before you start.

---

## Branch naming

```
feat/add-pricing-page-tests
fix/contact-form-selector-broken
chore/update-playwright-version
docs/update-contributing-guide
```

---

## Before opening a PR

Run both checks and fix all errors:

```bash
npm run typecheck   # TypeScript — must exit 0
npm run lint        # ESLint — must exit 0
```

If you added or changed visual tests, also regenerate baselines and commit them:

```bash
npm run baseline
git add __snapshots__/
```

---

## Architecture rules

### Page Object Model

- Every page or major section → its own class in `src/pages/` that `extends BasePage`
- Locators are `readonly Locator` properties declared in the constructor
- Methods model user actions (click, fill, navigate) — no assertions
- `expect()` calls belong **only** in spec files

```typescript
// ✅ Good — locator on the class, action method returns void
export class PricingPage extends BasePage {
  readonly planCards: Locator;
  constructor(page: Page, config: SiteConfig) {
    super(page, config);
    this.planCards = page.locator('[class*="plan-card"]');
  }
  async clickFirstPlan(): Promise<void> {
    await this.planCards.first().click();
  }
}

// ❌ Wrong — assertion inside page object
async isVisible(): Promise<void> {
  await expect(this.planCards).toBeVisible(); // belongs in spec
}
```

### Tests

```typescript
// ✅ Always import from the fixture, not from @playwright/test
import { test, expect } from '@fixtures/site.fixture';

// ✅ Every test has at least one tag
test('pricing page loads @functional', async ({ page, siteConfig }) => { … });

// ✅ Derive URL from config
await page.goto(siteConfig.url + '/pricing');

// ❌ Never hardcode
await page.goto('https://www.ebocom.com/pricing');
```

### TypeScript

- Strict mode is on — no implicit `any`
- Use `@pages/*`, `@fixtures/*`, `@utils/*`, `@types/*` path aliases
- Prefer interfaces over type aliases for object shapes

---

## Prohibited in tests

| What | Why |
|------|-----|
| `form.submit()` or clicking submit | Never send real contact requests |
| `page.waitForTimeout(> 500)` | Timing hacks hide real race conditions |
| Hardcoded `https://www.ebocom.com` | Breaks staging/local overrides |
| `expect()` inside page objects | Violates POM — tests assert, objects act |
| Implicit `any` type | TypeScript strict mode, readability |
| Creating accounts / entering real credentials | Not permitted |

---

## Test tagging

Every test **must** include at least one of these tags in its title:

| Tag | Use for |
|-----|---------|
| `@smoke` | Basic load, title, HTTPS, console errors |
| `@navigation` | Nav links, menu, routing |
| `@forms` | Form fields, validation, accessibility |
| `@functional` | Business features (CTA, accordion, video, etc.) |
| `@visual` | Screenshot regression |
| `@responsive` | Viewport breakpoints, overflow, font size |

---

## Adding a new page object

1. Create `src/pages/<name>.page.ts` extending `BasePage`
2. Add it to `src/fixtures/site.fixture.ts` (declare type + extend)
3. Write spec(s) in the appropriate `tests/` subdirectory
4. Run `npm run typecheck` to confirm zero errors

---

## Visual regression

- Baselines are stored in `__snapshots__/` (tracked in git for this project — see `.gitignore`)
- Run `npm run baseline` after any intentional design change
- Always review screenshots visually before committing them
- Never commit auto-generated baselines without visual review

---

## PR checklist

Before marking your PR ready for review:

- [ ] `npm run typecheck` passes
- [ ] `npm run lint` passes
- [ ] All new tests have at least one valid tag
- [ ] No form submissions in any test
- [ ] No hardcoded URLs
- [ ] Visual baselines committed if visual tests changed
- [ ] PR description explains what changed and why

---

## Questions?

Open a GitHub Discussion or tag `@rosmall` in a PR comment.
