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

---

## Project Structure

```
playwright-e2e/
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
│   │   └── login.spec.ts    # 5 auth tests — valid, invalid, logout, empty
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
4+ years in mobile and web test automation (Appium, Selenium, Playwright, Jenkins, BrowserStack)
[LinkedIn](https://linkedin.com/in/adem-garic-sdet-qa) · [GitHub](https://github.com/ademdeniz)
