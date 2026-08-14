# eboCom QA Agentic Solution

Automated regression test suite for **[eboCom](https://www.ebocom.com/)** — a Phoenix-based payments processing software company. Built with **Playwright + TypeScript** using the **Page Object Model (POM)** design pattern and structured for agentic execution by Claude Code.

---

## What this repo does

This repository tests every publicly reachable feature of `https://www.ebocom.com` without registering accounts, submitting live forms, or logging in. Coverage includes:

| Suite | Tag | What's tested |
|-------|-----|---------------|
| Smoke | `@smoke` | Site availability, HTTPS, page title, no JS errors |
| Navigation | `@navigation` | Nav links, mobile menu, logo home link, no 404s |
| Forms | `@forms` | Field presence, validation, accessibility (no submission) |
| Functional | `@functional` | Business features: hero CTA, services, accordions, video embeds |
| Visual | `@visual` | Screenshot regression at desktop/tablet/mobile |
| Responsive | `@responsive` | No horizontal overflow, readable font sizes, alt text, viewport meta |

---

## Prerequisites

| Tool | Version |
|------|---------|
| Node.js | 18+ |
| npm | 9+ |
| Git | any |

---

## Development environment setup

```bash
# 1. Clone the repo
git clone https://github.com/<org>/ebocom_QA_Agentic_Solution.git
cd ebocom_QA_Agentic_Solution

# 2. Install npm dependencies
npm install

# 3. Install Playwright browser binaries
npx playwright install --with-deps

# 4. (Optional) Copy the example env file for local overrides
cp .env.example .env
```

> **Windows users:** This project uses Git Bash or WSL for shell scripts. PowerShell is supported for npm scripts only.

---

## Running tests

```bash
npm test                    # Run the full suite (headless)
npm run test:smoke          # Smoke tests only (@smoke)
npm run test:navigation     # Navigation tests only (@navigation)
npm run test:forms          # Form tests only (@forms)
npm run test:visual         # Visual regression only (@visual)
npm run test:responsive     # Responsive layout only (@responsive)
npm run test:headed         # Run in headed (visible browser) mode
npm run report              # Open Playwright HTML report
npm run baseline            # Regenerate visual baselines after intentional design changes
npm run typecheck           # TypeScript type-check (no emit)
npm run lint                # ESLint
```

Override the target URL at runtime:

```bash
SITE_URL=https://staging.ebocom.com npm test
```

---

## Architecture

This project uses the **Page Object Model (POM)** pattern with **Object-Oriented Programming (OOP)** principles.

```
site.config.json            ← Site URL, flags, expected nav items
playwright.config.ts        ← Browser projects (desktop / tablet / mobile)
global-setup.ts             ← Reachability check before suite runs

src/
  pages/                    ← One class per page or section (extends BasePage)
    base.page.ts
    home.page.ts
    navigation.page.ts
    contact.page.ts
  fixtures/
    site.fixture.ts         ← Custom test fixtures (import test from here)
  utils/
    link-checker.ts
    visual-helper.ts
  types/
    site-config.types.ts

tests/
  smoke/                    ← @smoke
  navigation/               ← @navigation
  forms/                    ← @forms
  functional/               ← @functional
  visual/                   ← @visual
  responsive/               ← @responsive

.claude/
  agents/                   ← Claude Code subagent definitions
  commands/                 ← Slash commands (/analyze-site, /run-smoke, …)
  rules/                    ← Path-scoped instructions for Claude Code

.github/
  workflows/                ← CI pipelines
  ISSUE_TEMPLATE/           ← Bug and test-request templates
  copilot-instructions.md   ← GitHub Copilot context
  CONTRIBUTING.md
  pull_request_template.md
```

### POM rules (enforce in all PRs)

- Every page or section has its own class in `src/pages/` that `extends BasePage`
- Page class properties are `readonly Locator` typed fields
- Methods model user actions — no `expect()` inside page objects
- Tests import `{ test, expect }` from `@fixtures/site.fixture`, never from `@playwright/test` directly
- Never hardcode the base URL — always derive from `siteConfig.url`

---

## Configuration

`site.config.json` is the single source of truth for the target site.

```jsonc
{
  "name": "eboCom",
  "url": "https://www.ebocom.com",
  "hasContactForm": true,
  "expectedNavItems": [],   // populate after /analyze-site
  "skipVisual": false,
  "skipForms": false,
  "auth": { "required": false }
}
```

---

## Claude Code integration

This repo is optimized for [Claude Code](https://code.claude.com). Open any session from this directory and Claude will automatically load `CLAUDE.md`.

### Available slash commands

| Command | What it does |
|---------|-------------|
| `/analyze-site` | Crawl the live site and populate `site.config.json` |
| `/generate-full-suite` | Analyze site and generate a complete POM + test suite |
| `/run-smoke` | Run smoke tests and display a formatted pass/fail report |
| `/update-baseline` | Regenerate visual regression baselines |
| `/generate-report` | Parse results and display a structured test summary |

### Subagents

| Agent | When Claude delegates to it |
|-------|----------------------------|
| `site-analyzer` | Crawling the live site for structure and config |
| `test-generator` | Generating site-specific test files from config |

---

## Contributing

See [.github/CONTRIBUTING.md](.github/CONTRIBUTING.md) for the full guide.

Quick rules:

1. Run `npm run typecheck && npm run lint` before opening a PR
2. Every test must have at least one `@tag` (smoke, navigation, forms, functional, visual, responsive)
3. No form submissions — test interactions and validation only
4. No hardcoded URLs — use `siteConfig.url` or `baseURL` from Playwright config
5. Page assertions go in spec files, not in page object methods
6. After adding visual tests: run `npm run baseline` and commit the snapshot with your PR

---

## CI

Tests run automatically on every pull request and push to `main` via [GitHub Actions](.github/workflows/playwright.yml). Artifacts (HTML report + screenshots) are uploaded on failure.

---

## Tech stack

| Tool | Purpose |
|------|---------|
| [Playwright](https://playwright.dev/) | Browser automation (Chromium, Firefox, WebKit) |
| TypeScript (strict) | Typed test code |
| ESLint + @typescript-eslint | Lint |
| GitHub Actions | CI |
| Claude Code | Agentic test generation and maintenance |

---

*Company: eboCom · Phoenix, AZ · Founded 2000 · CEO: Mary Gerdts*
