# Test Plan: Authentication — the-internet.herokuapp.com

Scope: `/login` page and the `/secure` area it protects.
Explored live on 2026-07-18. Valid credentials: `tomsmith` / `SuperSecretPassword!`.

## Page facts (observed)

- `/login`: `#username`, `#password`, `button[type="submit"]`, flash banner `#flash`
- Successful login → 302 to `/secure`, flash `You logged into a secure area!`, logout link `a[href="/logout"]`
- Unauthenticated GET `/secure` → 302 back to `/login`, flash (with `error` class): `You must login to view the secure area!`

## Scenarios

| # | Scenario | Steps | Expected | Status |
|---|---|---|---|---|
| 1 | Valid login | goto /login → fill creds → submit | URL `/secure`, success flash | ✅ covered (`login.spec.ts` @smoke) |
| 2 | Invalid password | valid user, wrong password | stays `/login`, `Your password is invalid!` | ✅ covered (@smoke) |
| 3 | Invalid username | wrong user, valid password | stays `/login`, `Your username is invalid!` | ✅ covered (@regression) |
| 4 | Logout round-trip | login → click logout | back on `/login`, logout flash | ✅ covered (@regression) |
| 5 | Empty credentials | submit with both fields empty | stays `/login`, username error flash | ✅ covered (@regression) |
| 6 | **Auth guard: direct /secure access** | goto `/secure` while logged out | redirected to `/login`, flash `You must login to view the secure area!` with `error` class | ❌ **NEW — not covered** |
| 7 | **Session persists across reload** | login → reload `/secure` | still on `/secure`, logout link visible | ❌ **NEW — not covered** |

## Generation notes

- New tests go to `tests/auth/auth-guard.spec.ts`, tag `@regression`
- Reuse `LoginPage` POM (`pages/LoginPage.ts`) — has `flashMessage` and `logoutButton` locators
- Scenario 7 uses `page.reload()` after `loginPage.assertLoginSuccess()`
