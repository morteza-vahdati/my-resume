<div align="center">

# Morteza Vahdati — Resume

A bilingual (English / Persian) single-page resume site, built with the Next.js App Router.

**[English](README.md) · [فارسی](README.fa.md)**

</div>

---

<div align="center">

|                  Light — English                  |                 Dark — Persian                  |
| :-----------------------------------------------: | :---------------------------------------------: |
| ![English, light mode](screenshots/home-en-light.png) | ![Persian, dark mode](screenshots/home-fa-dark.png) |

</div>

---

## About

A personal resume site that treats Persian as a first-class language rather than a translation layer. The layout mirrors to RTL, the type switches to a local IRANSans face, and project dates convert from Gregorian to Shamsi — all from a single JSON file.

## Features

- **Bilingual (en / fa)** — locale-prefixed routes, `Accept-Language` negotiation, and a cookie that remembers the choice
- **True RTL** — direction, layout mirroring, and a font swap, not just `dir="rtl"`
- **Light / dark theme** — follows the OS by default, persists once chosen
- **Content as data** — every résumé field lives in one JSON file; components never hardcode content
- **Contact form** — layered anti-spam guards (origin, honeypot, timing, per-IP rate limit) with bilingual errors
- **SEO** — canonical and hreflang tags, sitemap, robots, web manifest, and Person JSON-LD, all derived from the same data
- **Tested end to end** — 65 Cypress specs covering navigation, both locales, the form, the API guards, and the SEO output

## Tech stack

| Area       | Choice                                        |
| ---------- | --------------------------------------------- |
| Framework  | Next.js 14 (App Router), React 18             |
| Language   | TypeScript (strict)                           |
| Styling    | Tailwind CSS, CSS variables, `next-themes`    |
| Animation  | Framer Motion                                 |
| i18n       | Negotiator + `@formatjs/intl-localematcher`   |
| Mail       | Nodemailer (SMTP, optional)                   |
| Testing    | Cypress (E2E)                                 |

## Getting started

```bash
npm install
cp .env.example .env    # optional: SMTP settings for the contact form
npm run dev             # http://localhost:3000
```

The app redirects `/` to `/en` or `/fa` based on your cookie, then your browser's language.

## Scripts

```bash
npm run dev            # dev server on :3000
npm run build          # production build (also typechecks)
npm run lint           # ESLint
npm run cypress:open   # interactive E2E
npm run cypress:run    # headless E2E — needs a running server
npm run screenshots    # regenerate the README images
```

## Environment

All variables are optional. Without SMTP the contact form still accepts submissions and reports `emailSent: false` rather than showing the visitor an error they can't act on.

| Variable                              | Purpose                                                    |
| ------------------------------------- | ---------------------------------------------------------- |
| `SITE_URL`                            | Canonical/hreflang base, sitemap and robots domain, accepted form origin, and the Cypress base URL |
| `SMTP_HOST` `SMTP_PORT` `SMTP_USER` `SMTP_PASS` | Mail transport                                   |
| `FROM_EMAIL` `CONTACT_TO`             | Sender and recipient for contact messages                   |

> `SITE_URL` should be the real public domain in production — a local value there ships `localhost` URLs to search engines.

## Editing the content

Everything visible on the page comes from [data/resume.json](data/resume.json), as `{ en, fa }` pairs:

```jsonc
{
  "personal": {
    "name": { "en": "Morteza Vahdati", "fa": "مرتضی وحدتی" },
    "role": { "en": "Web Developer", "fa": "برنامه‌نویس وب" }
  }
}
```

TypeScript types are derived from the JSON itself, so adding a field updates the types — there is no separate schema to keep in sync.

## Testing

Cypress runs against a live server, so start one first:

```bash
npm run build && npm run start   # or npm run dev
npm run cypress:run
```

| Spec                | Covers                                          |
| ------------------- | ----------------------------------------------- |
| `home.cy.ts`        | section rendering, `lang`/`dir`, 404 chrome      |
| `navigation.cy.ts`  | scrolling, scroll offset, mobile menu           |
| `intro-locale.cy.ts`| intro overlay, language toggle, theme toggle    |
| `contact.cy.ts`     | form validation and submit, both locales        |
| `api.cy.ts`         | contact API guards                              |
| `seo.cy.ts`         | sitemap, robots, manifest, JSON-LD, headers     |

Contact submissions are stubbed — leaving them live would mail the site owner on every run.

## Deployment

Deploys to [Vercel](https://vercel.com) with no extra configuration. Set the environment variables in the project settings, `SITE_URL` above all.

## License

Personal project. The code is free to learn from; the résumé content and photography are not.
