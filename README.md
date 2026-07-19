# playwright-e2e

> Modern E2E test suite using Playwright and TypeScript — UI flows, API testing, and auth scenarios with Page Object Model, custom fixtures, parallel execution, and HTML reporting.

![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)
![Playwright](https://img.shields.io/badge/Playwright-1.43+-green?logo=playwright)
![CI](https://github.com/ademdeniz/playwright-e2e/actions/workflows/playwright.yml/badge.svg)
![License](https://img.shields.io/badge/license-MIT-lightgrey)

---

## What's Covered

| Layer | Tests | Tags |
|---|---|---|
| **Auth** | Valid login, invalid credentials, logout, empty fields | `@smoke` `@regression` |
| **Auth guard** | Unauthenticated `/secure` redirect, session persists across reload | `@regression` |
| **UI** | Dynamic loading, checkboxes, dropdowns | `@smoke` `@regression` |
| **API** | GET/POST/PUT/PATCH/DELETE + status codes + headers | `@smoke` `@regression` |

Target apps:
- UI: [the-internet.herokuapp.com](https://the-internet.herokuapp.com) — canonical Selenium/Playwright practice site
- API: [reqres.in](https://reqres.in) — free public REST API

---

## Key Features

- **Page Object Model** — typed POMs with Playwright locators, no brittle XPath strings
- **Custom fixtures** — pre-built POMs and an `authenticatedPage` fixture injected per test
- **Parallel execution** — `fullyParallel: true`, 4 workers in CI
- **Cross-browser** — Chromium, Firefox, WebKit + mobile viewports (in CI)
- **Auto-retry** — 2 retries in CI with trace + video captured on first retry
- **API testing** — uses Playwright's native `request` context, no extra libraries
- **HTML report** — full Playwright report with timeline, screenshots, traces, and videos
- **GitHub Actions** — smoke tests on every PR, full suite on merge to main
- **AI test agents** — Playwright's planner/generator/healer agents wired for Claude Code (see below)

---

## Project Structure

```
playwright-e2e/
├── .claude/agents/          # Playwright AI agents for Claude Code
│   ├── playwright-test-planner.md     # explores the app, writes test plans
│   ├── playwright-test-generator.md   # turns plans into verified specs
│   └── playwright-test-healer.md      # diagnoses + repairs failing tests
├── .mcp.json                # Playwright test MCP server used by the agents
├── specs/
│   └── login-plan.md        # AI-planned auth test plan (coverage map + gaps)
├── pages/
│   ├── BasePage.ts          # Shared navigation + assertion helpers
│   ├── LoginPage.ts         # Auth flow POM
│   ├── DynamicPage.ts       # Async loading POM
│   └── FormPage.ts          # Checkboxes + Dropdown POMs
├── fixtures/
│   └── index.ts             # Extended test fixtures — injects POMs + authenticatedPage
├── utils/
│   └── apiHelpers.ts        # Typed REST helpers wrapping Playwright request context
├── tests/
│   ├── auth/
│   │   ├── login.spec.ts        # 5 auth tests — valid, invalid, logout, empty
│   │   └── auth-guard.spec.ts   # 2 tests — /secure guard + session persistence
│   ├── ui/
│   │   └── dynamic.spec.ts  # 6 UI tests — loading, checkboxes, dropdown
│   └── api/
│       └── users.spec.ts    # 8 API tests — full CRUD + error cases
├── playwright.config.ts     # Multi-browser config, retries, reporters
└── .github/workflows/
    └── playwright.yml       # CI — smoke on PR, full suite on push
```

---

## Getting Started

```bash
git clone https://github.com/ademdeniz/playwright-e2e.git
cd playwright-e2e
npm install
npx playwright install chromium
```

---

## Running Tests

```bash
# All tests (headless Chromium)
npm test

# Smoke suite only
npm run test:smoke

# Regression suite
npm run test:regression

# API tests only
npm run test:api

# Headed mode (visible browser — good for debugging)
npm run test:headed

# Specific file
npx playwright test tests/auth/login.spec.ts

# Open HTML report
npm run report
```

---

## AI QA Agents

This repo is wired for **Playwright's official test agents** (v1.56+), which run
inside [Claude Code](https://claude.com/claude-code) as purpose-built subagents:

| Agent | Role |
|---|---|
| 🎭 **planner** | Explores the live app in a real browser and writes a human-reviewable test plan to `specs/*.md` — scenarios, steps, expected results |
| 🎭 **generator** | Turns a plan into `*.spec.ts` files, verifying every selector and assertion against the running app while it writes |
| 🎭 **healer** | Re-runs a failing test, inspects the live DOM at the failure point, distinguishes app bug vs. stale test, and patches the test until green |

Scaffolded with `npx playwright init-agents --loop=claude` — definitions live in
`.claude/agents/`, and `.mcp.json` registers the Playwright test MCP server they
drive. Open this repo in Claude Code and ask e.g. *"use the planner to map test
scenarios for the checkout flow"* or *"run the healer on the failing CI test"*.

The workflow that produced real results here: the planner mapped auth coverage
into [`specs/login-plan.md`](specs/login-plan.md) and found two gaps, the
generator wrote [`tests/auth/auth-guard.spec.ts`](tests/auth/auth-guard.spec.ts)
for them (both passing), and the healer-style pass uncovered a latent bug — a
hard-coded assertion message in `LoginPage` that made the invalid-password test
unable to ever pass.

This suite also pairs with **[playwright-mcp](https://github.com/ademdeniz/playwright-mcp)**
for the chat-driven flavor: a LibreChat agent executes these same scenarios in
plain English against a browser via MCP (see that repo's *QA Agent Setup*).

---

## Why Playwright Over Selenium

| | Playwright | Selenium |
|---|---|---|
| Auto-waiting | Built-in, no explicit waits needed | Manual `WebDriverWait` everywhere |
| Browser support | Chromium, Firefox, WebKit, mobile | Chrome, Firefox, Safari (via drivers) |
| API testing | Native `request` context | Separate library (RestAssured etc.) |
| Parallel execution | Per-test isolation out of the box | Complex Grid setup |
| Trace/Video | Built-in on failure | Manual setup |
| TypeScript | First-class support | Via bindings, awkward |

---

## Related Projects

- **[playwright-mcp](https://github.com/ademdeniz/playwright-mcp)** — MCP server giving Claude direct browser control via these same Playwright primitives
- **[self-healing-locator](https://github.com/ademdeniz/self-healing-locator)** — Selenium-based fallback locator engine (Java)
- **[jenkins-appium-pipeline](https://github.com/ademdeniz/jenkins-appium-pipeline)** — Jenkins CI/CD for mobile Appium tests

---

## What's Next

- [ ] Visual regression testing with `expect(page).toHaveScreenshot()`
- [ ] Auth state saved to `storageState.json` for session reuse across tests
- [ ] Allure reporter integration
- [ ] BrowserStack remote grid support

---

## Author

**Adem Garic** — SDET / QA Engineer
6+ years in mobile and web test automation (Appium, Selenium, Playwright, Jenkins, BrowserStack)
[LinkedIn](https://linkedin.com/in/adem-garic-sdet-qa) · [GitHub](https://github.com/ademdeniz)
