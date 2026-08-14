# Skills Reference — eboCom QA Agentic Solution

This file documents every Claude Code skill (slash command) available in this repository. Skills live in `.claude/commands/` and are invoked with `/skill-name` inside a Claude Code session.

---

## /analyze-site

**File:** `.claude/commands/analyze-site.md`

Crawl the live website at the URL in `site.config.json` and produce an updated, fully-populated config.

**When to use:**
- Onboarding this repo to a new target site
- Verifying `site.config.json` is still accurate after a site redesign
- Discovering what nav items, forms, and pages exist before writing tests

**What it does:**
1. Navigates to the site URL (follows redirects, dismisses cookie banners)
2. Extracts nav items, form presence, H1/meta content, CTA text
3. Checks for HTTPS, meta viewport, favicon
4. Outputs a completed `site.config.json` block + issues found

**Usage:**
```
/analyze-site
/analyze-site https://staging.ebocom.com
```

---

## /generate-full-suite

**File:** `.claude/commands/generate-full-suite.md`

Analyze the live website and generate a complete POM + test suite from scratch.

**When to use:**
- First-time setup for a new company site
- After a major site redesign that breaks existing selectors

**What it does:**
1. Runs `/analyze-site` to discover site structure
2. Creates/updates page object classes in `src/pages/`
3. Writes spec files in `tests/` with real selectors from the live HTML
4. Adds the new page to `src/fixtures/site.fixture.ts`
5. Runs `npx tsc --noEmit` to verify clean TypeScript

**Usage:**
```
/generate-full-suite
```

---

## /run-smoke

**File:** `.claude/commands/run-smoke.md`

Run the smoke test suite and display a formatted pass/fail summary.

**When to use:**
- Quick sanity check that the site is up before a full test run
- After deploying a site change
- In CI before running deeper suites

**What it does:**
1. Executes `npm run test:smoke`
2. Parses `test-results/results.json`
3. Displays a formatted table with pass/fail/warn per test
4. Suggests fixes for common failures

**Usage:**
```
/run-smoke
```

---

## /update-baseline

**File:** `.claude/commands/update-baseline.md`

Capture new visual regression baselines after intentional design changes.

**When to use:**
- The site had a planned visual update (rebrand, layout change)
- Visual tests are failing because the design changed intentionally
- Initial setup of visual regression for a site that has no baselines yet

**What it does:**
1. Runs `npm run baseline` (`playwright test --grep @visual --update-snapshots`)
2. Lists all updated snapshot files
3. Reminds you to review before committing

**Usage:**
```
/update-baseline
```

---

## /generate-report

**File:** `.claude/commands/generate-report.md`

Parse the last test run results and display a structured summary by suite.

**When to use:**
- After any test run to get a clear summary
- In CI to post results as a comment or artifact
- When investigating flaky tests

**What it does:**
1. Parses `test-results/results.json`
2. Displays a table with totals per suite
3. Lists all failed tests with error messages
4. Lists flaky tests and suggestions

**Usage:**
```
/generate-report
```

---

## Subagents (invoked automatically by Claude)

These are not slash commands — Claude delegates to them automatically when the task matches.

### site-analyzer

**File:** `.claude/agents/site-analyzer.md`

Crawls a live website and returns a structured site analysis. Used internally by `/analyze-site` and `/generate-full-suite`.

### test-generator

**File:** `.claude/agents/test-generator.md`

Reads a populated `site.config.json` and generates site-specific Playwright test files. Used internally by `/generate-full-suite`.

---

## Adding a new skill

1. Create `.claude/commands/<skill-name>.md`
2. Add frontmatter: `description:` (one sentence — how Claude decides when to invoke it)
3. Write the skill instructions in Markdown
4. Add an entry to this file (Skills.md)
5. Add the skill to the table in `CLAUDE.md`
