## What changed

<!-- 1-3 bullet points describing the change -->

-

## Why

<!-- Why this change is needed (bug fix, new coverage, selector update, etc.) -->

## Test suites affected

<!-- Check all that apply -->

- [ ] `@smoke`
- [ ] `@navigation`
- [ ] `@forms`
- [ ] `@functional`
- [ ] `@visual`
- [ ] `@responsive`

## Pre-merge checklist

- [ ] `npm run typecheck` passes with zero errors
- [ ] `npm run lint` passes with zero errors
- [ ] All new tests have at least one `@tag`
- [ ] No form submissions in any test
- [ ] No hardcoded URLs (always uses `siteConfig.url` or `baseURL`)
- [ ] No `expect()` calls inside page object methods
- [ ] Visual baselines updated and committed (`npm run baseline`) if `@visual` tests changed
- [ ] New page objects are registered in `src/fixtures/site.fixture.ts`
