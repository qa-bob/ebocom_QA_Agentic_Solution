---
paths:
  - "tests/**/*.spec.ts"
  - "src/pages/**/*.ts"
  - "src/fixtures/**/*.ts"
---

# Playwright Test Rules

These rules apply when writing or editing test files and page objects.

## Required

- Import `{ test, expect }` from `@fixtures/site.fixture`, never from `@playwright/test`
- Tag every `test()` call with at least one: `@smoke` `@navigation` `@forms` `@functional` `@visual` `@responsive`
- Derive URLs from `siteConfig.url` — never hardcode `https://www.ebocom.com`
- Use Playwright auto-waiting; avoid `page.waitForTimeout()` over 500ms
- Never call `form.submit()` or click a submit button that would POST data

## Page Object Model

- Page classes extend `BasePage` from `@pages/base.page`
- Locators are `readonly Locator` properties initialized in the constructor
- Methods model user actions (click, fill, navigate) and return `Promise<void>`
- No `expect()` calls inside page object methods

## TypeScript

- No implicit `any` — annotate every parameter and return type
- Use `@pages/*`, `@fixtures/*`, `@utils/*`, `@types/*` path aliases
- Run `npx tsc --noEmit` before finishing — must be zero errors
