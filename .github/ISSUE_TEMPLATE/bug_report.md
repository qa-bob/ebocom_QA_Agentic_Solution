---
name: Bug report
about: A test is failing, flaky, or selecting the wrong element
title: "[BUG] "
labels: bug
assignees: ''
---

## What happened

<!-- Paste the test failure output or describe the unexpected behavior -->

## Expected behavior

<!-- What the test should do -->

## How to reproduce

```bash
# Paste the exact command that reproduces the failure
npm run test:smoke
# or
npx playwright test tests/navigation/nav-links.spec.ts --project chromium-desktop
```

## Test file and line

<!-- e.g. tests/navigation/nav-links.spec.ts:55 -->

## Playwright report

<!-- Paste the relevant section from playwright-report or test-results/ -->

## Environment

- OS:
- Node version (`node -v`):
- Playwright version (`npx playwright --version`):
- Branch:
- `site.config.json` URL:

## Possible cause

<!-- Optional: your guess at root cause (selector change, timing, network, etc.) -->
