# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev            # dev server on :3000
npm run build          # production build (run this to typecheck — tsconfig is noEmit)
npm run lint           # next lint (eslint-config-next core-web-vitals)
npm run cypress:open   # interactive E2E
npm run cypress:run    # headless E2E (needs a running server: npm run dev or start)
```

Run a single E2E spec, or one test inside it:

```bash
npx cypress run --spec cypress/e2e/navigation.cy.ts
npx cypress run --spec cypress/e2e/intro-locale.cy.ts   # add .only in the spec to narrow further
```

Cypress `baseUrl` comes from `SITE_URL` (defaults to `http://localhost:3000`), see [cypress.config.ts](cypress.config.ts). There is no unit test runner — all tests are Cypress E2E against a live server.

Env vars live in `.env` (see [.env.example](.env.example)). SMTP vars are optional: without them the contact API still returns `success: true` with `emailSent: false`. `SITE_URL` is not only the Cypress base: it is the canonical/hreflang base, the sitemap and robots domain, and the origin the contact API accepts posts from — a local value there ships localhost URLs into the SEO output.

### Test layout

Specs are split by concern, and shared setup lives in [cypress/support/e2e.ts](cypress/support/e2e.ts):

| Spec                                                 | Covers                                                   |
| ---------------------------------------------------- | -------------------------------------------------------- |
| [home.cy.ts](cypress/e2e/home.cy.ts)                 | section rendering, `lang`/`dir`, 404 chrome              |
| [navigation.cy.ts](cypress/e2e/navigation.cy.ts)     | nav scrolling, the scroll offset, mobile menu, 404 links |
| [intro-locale.cy.ts](cypress/e2e/intro-locale.cy.ts) | intro overlay, language toggle, theme toggle             |
| [contact.cy.ts](cypress/e2e/contact.cy.ts)           | form validation and submit, both locales                 |
| [api.cy.ts](cypress/e2e/api.cy.ts)                   | contact API guards via `cy.request`                      |
| [seo.cy.ts](cypress/e2e/seo.cy.ts)                   | sitemap, robots, manifest, JSON-LD, headers              |

Prefer the custom commands over raw `cy.visit`:

- `cy.visitLocale(locale, path?, { failOnStatusCode, theme })` marks the intro as already shown so tests do not wait on it. Pass `failOnStatusCode: false` for 404 paths, and `theme` to pin light/dark instead of inheriting the machine's OS preference.
- `cy.visitWithIntro(locale, path?)` clears the flag so the overlay plays, for tests that assert on it.
- `cy.waitForScrollEnd()` polls until the animated scroll stops, instead of guessing a duration.
- `cy.fillContactForm(overrides?)` fills name, email, message and a star rating.

Contact submits are stubbed with `cy.intercept` in [contact.cy.ts](cypress/e2e/contact.cy.ts). Leaving them unstubbed mails the site owner on every run when SMTP is configured.

## Architecture

Next.js 14 App Router, single-page bilingual (en/fa) resume site. TypeScript strict. Path aliases: `@/*` → `src/*`, `@data/*` → `data/*`.

### Content is data, not JSX

All resume content lives in [data/resume.json](data/resume.json) as `{ en, fa }` pairs. Never hardcode resume content in components. [src/lib/resume.ts](src/lib/resume.ts) is the only reader: `getPersonal`, `getExperience`, `getEducation`, `getCourses`, `getSkills`, `getProjects`, `getSeo` each take a `Locale` and return flattened, locale-resolved objects. Types are derived from the JSON (`ResumeData = typeof resumeData`), so editing the JSON changes the types — no separate schema to update. `getLocalizedText` falls back to `en`. `getProjects` converts Gregorian years to Shamsi for `fa`.

Short UI strings (nav labels, buttons, section headers) are inline ternaries on `locale` inside components, not in the JSON. Follow that pattern.

### Locale routing

[src/middleware.ts](src/middleware.ts) redirects locale-less paths to `/{locale}` using the `locale` cookie, then `Accept-Language` via Negotiator + `@formatjs/intl-localematcher`. For paths that already have a locale it injects an `x-locale` request header and syncs the cookie.

The layout is deliberately split in two:

- [src/app/layout.tsx](src/app/layout.tsx) is the root `<html>`. It is **not** under `[locale]` so that [src/app/not-found.tsx](src/app/not-found.tsx) renders for unmatched routes. It reads locale from the `x-locale` header, falling back to the cookie, to set the initial `lang`/`dir`. Because it sits above `[locale]`, it does not re-render on a client-side language switch — [LocaleHtmlSync.tsx](src/components/ui/LocaleHtmlSync.tsx) syncs `lang`/`dir` from the active route segment instead. `LoadingScreen` is mounted here too, for the same reason: under `[locale]` it would unmount mid-switch and the overlay would never play.
- [src/app/[locale]/layout.tsx](src/app/[locale]/layout.tsx) owns `generateMetadata` (from `getSeo`) and Speed Insights.

`/{locale}` is the only real page; everything else is a hash section on it. Navbar checks `isHome` and pushes `/{locale}#id` when it isn't.

### Intro screen and hash scrolling

Four pieces coordinate through window events and `sessionStorage.intro-shown`:

- An inline script in the root layout `<head>` adds `html.intro-pending` before paint, which reveals the static `#intro-boot` cover. That cover has to be in the server HTML — mounting the overlay only after hydration let a frame of real content flash first.
- [LoadingScreen.tsx](src/components/ui/LoadingScreen.tsx) plays once per session, or on the `intro:play` event, then fires `intro:done`.
- [LanguageToggle.tsx](src/components/ui/LanguageToggle.tsx) dispatches `intro:play` before `router.replace`, preserving the hash. It works on the 404 page too, which is why it must not depend on a `[locale]` route param for its current locale.
- [ScrollToHash.tsx](src/components/ui/ScrollToHash.tsx) positions instantly while the overlay is up and re-anchors on `intro:done`, since fonts and images that load under the cover shift the layout.

The same inline script kills native hash restoration on load. Programmatic scrolling goes through [src/lib/scroll.ts](src/lib/scroll.ts), which temporarily disables CSS `scroll-behavior: smooth` and reads the offset from `scroll-padding-top` — that value is responsive (56px mobile / 64px desktop), so read it rather than hardcoding a navbar height. Use `smoothScrollToElement` rather than `scrollIntoView` for nav-driven scrolling.

### Styling

Tailwind with `darkMode: "class"` via `next-themes` (`attribute="class"`, `enableSystem`). Semantic colors are HSL CSS variables in [src/app/globals.css](src/app/globals.css) — use `bg-background`, `text-foreground`, `border-border` instead of raw palette colors. `--primary` is the brand color; `--accent` is a quiet surface tint, not a highlight — reach for `text-primary`/`bg-primary` (or the `primary` variant on buttons/badges) for emphasis. A parallel `--primary-rgb` triplet feeds `rgba()` glows so they follow the theme. Glass surfaces come from [GlassCard.tsx](src/components/ui/GlassCard.tsx); button styles live as string maps in [buttonVariants.ts](src/components/ui/buttonVariants.ts) and are shared by `Button` and `LinkButton`. Entrance animations use [ScrollReveal.tsx](src/components/ui/ScrollReveal.tsx) (framer-motion `whileInView`, `once: true`).

Latin type is Archivo / Space Grotesk from Google Fonts; RTL swaps to the local IRANSans face registered in [src/lib/iransans-font.ts](src/lib/iransans-font.ts) and applied via `html[dir="rtl"]` rules. Icons are Font Awesome classes from the CDN (`<i className="fa-solid ..." />`), not a React icon package. Any new external host must also be added to the CSP in [next.config.mjs](next.config.mjs).

RTL handling is explicit per component (`isRtl` ternaries on layout/text-alignment classes), not purely `dir`-driven.

### Contact API

The route is split so each concern is testable on its own, and [route.ts](src/app/api/contact/route.ts) is only the guard ordering:

- [guards.ts](src/app/api/guards.ts) — `isAllowedOrigin` (host comparison against `SITE_URL`, allowing `*.vercel.app`), `getIp`, `checkRate` (in-memory per-IP `Map`, so it resets on cold start), `isTooFast`.
- [validate.ts](src/app/api/contact/validate.ts) — field validation, returning `{ errors, value }`.
- [mailer.ts](src/app/api/contact/mailer.ts) — `smtpConfigured` and `sendContactMail`.

Order matters: origin → honeypot → timing → rate limit → validation → send. The cheap checks run first so a bot never reaches the mail server. The timing check reads `elapsedMs`, a duration the client measures itself — an absolute timestamp would reject anyone whose device clock is skewed.

Messages are `{ en, fa }` pairs built by `msg()` in [src/lib/localized.ts](src/lib/localized.ts) and the client picks the locale; keep both languages when adding messages. Without SMTP configured the route answers `{ success: true, emailSent: false }`; if a _configured_ mail server rejects the message it answers 502 rather than claiming success.

### SEO

[src/app/sitemap.ts](src/app/sitemap.ts), [robots.ts](src/app/robots.ts), [manifest.ts](src/app/manifest.ts), and Person JSON-LD in [JsonLd.tsx](src/components/JsonLd.tsx) all derive from `resume.json` plus `siteConfig.url` ([src/lib/site-config.ts](src/lib/site-config.ts), normalizes `SITE_URL` and defaults to `https://mvahdati.ir`). The middleware matcher excludes these routes plus `api`, `images`, and `pdf`.
