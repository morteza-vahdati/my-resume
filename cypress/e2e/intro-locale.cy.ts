/** LoadingScreen keeps the overlay up for MIN_VISIBLE + FADE_OUT. */
const INTRO_MS = 4000 + 1200;

const LANG_TOGGLE = '[aria-label="Change language"]';
const THEME_TOGGLE = '[aria-label="Toggle dark/light mode"]';

/** 404 answers a 404 status, which cy.visit treats as a failure by default. */
const notFound = { failOnStatusCode: false };

describe("Intro screen", () => {
  it("plays on the first visit of a session, then reveals the page", () => {
    cy.visitWithIntro("en");
    cy.get("#intro-screen").should("be.visible");
    cy.get("#intro-screen", { timeout: INTRO_MS + 2000 }).should("not.exist");
    cy.get("#hero h1").should("be.visible");
  });

  it("covers the page before hydration, not after", () => {
    // The cover has to be in the server HTML: mounting it only after hydration
    // is what let a frame of real content flash before the overlay appeared.
    cy.request("/en").its("body").should("include", 'id="intro-boot"');
    cy.request("/en").its("body").should("include", "intro-pending");
  });

  it("does not replay on a second visit in the same session", () => {
    cy.visitWithIntro("en");
    cy.get("#intro-screen", { timeout: INTRO_MS + 2000 }).should("not.exist");

    // Same tab, same origin: sessionStorage still carries the flag, so the
    // inline script must not arm the cover this time.
    cy.visit("/en#about");
    cy.get("html").should("not.have.class", "intro-pending");
    cy.get("#intro-screen").should("not.exist");
  });

  it("locks scrolling while the overlay is up", () => {
    cy.visitWithIntro("en");
    cy.get("#intro-screen").should("be.visible");
    cy.get("body").should("have.css", "overflow", "hidden");

    cy.get("#intro-screen", { timeout: INTRO_MS + 2000 }).should("not.exist");
    cy.get("body").should("not.have.css", "overflow", "hidden");
  });
});

describe("Language toggle", () => {
  it("replays the intro over the whole page while switching", () => {
    cy.visitLocale("en");
    cy.get(LANG_TOGGLE).click();

    // The reported bug: the overlay never appeared on a language switch.
    cy.get("#intro-screen").should("be.visible");
    cy.get("#intro-screen").should(($el) => {
      const el = $el[0];
      const rect = el.getBoundingClientRect();
      const root = el.ownerDocument.documentElement;
      // `scrollbar-gutter: stable` reserves a strip that sits on the left under
      // RTL, so after an en -> fa switch the cover starts a scrollbar-width in.
      // Allow for that rather than demanding a flush 0.
      const gutter = el.ownerDocument.defaultView!.innerWidth - root.clientWidth;
      expect(rect.top, "covers from the top").to.eq(0);
      expect(rect.left, "covers from the left").to.be.at.most(gutter + 1);
      expect(rect.width, "covers the full width").to.be.gte(root.clientWidth);
      expect(rect.height, "covers the full height").to.be.gte(
        root.clientHeight,
      );
    });

    cy.location("pathname").should("eq", "/fa");
    cy.get("#intro-screen", { timeout: INTRO_MS + 2000 }).should("not.exist");
    cy.get("html").should("have.attr", "dir", "rtl");
  });

  it("updates lang and dir without a full reload", () => {
    cy.visitLocale("fa");
    cy.get(LANG_TOGGLE).click();
    cy.location("pathname").should("eq", "/en");
    cy.get("html", { timeout: INTRO_MS + 2000 }).should(
      "have.attr",
      "dir",
      "ltr",
    );
    cy.get("html").should("have.attr", "lang", "en");
  });

  it("keeps the reader on the section they were reading", () => {
    cy.visitLocale("en", "#projects");
    cy.waitForScrollEnd();
    cy.get(LANG_TOGGLE).click();
    cy.location("pathname").should("eq", "/fa");
    cy.hash().should("eq", "#projects");
  });

  it("persists the choice in a cookie", () => {
    cy.visitLocale("en");
    cy.get(LANG_TOGGLE).click();
    cy.location("pathname").should("eq", "/fa");
    cy.getCookie("locale").should("have.property", "value", "fa");
  });

  it("works on the 404 page", () => {
    cy.visitLocale("en", "/no-such-page", notFound);

    // Stamp the window: a full document load would wipe this. The 404 sits
    // outside the [locale] tree, so a router navigation there reloads the page
    // instead of transitioning — the switch has to happen in client state.
    cy.window().then((win) => {
      (win as unknown as { __sameDocument?: boolean }).__sameDocument = true;
    });

    cy.get(LANG_TOGGLE).click();

    cy.get("#intro-screen").should("be.visible");
    cy.location("pathname").should("eq", "/fa/no-such-page");
    cy.contains("صفحه‌ای که به دنبال آن هستید یافت نشد").should("be.visible");
    cy.get("html").should("have.attr", "dir", "rtl");
    cy.getCookie("locale").should("have.property", "value", "fa");

    cy.window().should((win) => {
      const stamp = (win as unknown as { __sameDocument?: boolean }).__sameDocument;
      expect(stamp, "switched without reloading the document").to.eq(true);
    });
  });

  it("switches back and forth on the 404 without reloading", () => {
    cy.visitLocale("fa", "/no-such-page", notFound);
    cy.get(LANG_TOGGLE).click();
    cy.location("pathname").should("eq", "/en/no-such-page");
    cy.contains("Page not found").should("be.visible");

    // The overlay covers the toggle until it lifts; clicking through it would
    // only pass with {force: true}, which would stop testing what a user can do.
    cy.get("#intro-screen", { timeout: INTRO_MS + 2000 }).should("not.exist");

    cy.get(LANG_TOGGLE).click();
    cy.location("pathname").should("eq", "/fa/no-such-page");
    cy.get("html").should("have.attr", "dir", "rtl");
  });
});

describe("Theme toggle", () => {
  beforeEach(() => {
    // Pin the starting theme: the toggle follows the OS preference otherwise,
    // and the machine running the suite is not ours to assume.
    cy.visitLocale("en", "", { theme: "light" });
  });

  it("switches to dark and keeps it across a reload", () => {
    cy.get("html").should("not.have.class", "dark");
    cy.get(THEME_TOGGLE).click();
    cy.get("html").should("have.class", "dark");

    // next-themes writes the choice to localStorage, which survives the reload.
    cy.visitLocale("en");
    cy.get("html").should("have.class", "dark");
  });

  it("survives a language switch", () => {
    cy.get(THEME_TOGGLE).click();
    cy.get("html").should("have.class", "dark");

    cy.get(LANG_TOGGLE).click();
    cy.location("pathname").should("eq", "/fa");
    cy.get("html").should("have.class", "dark");
  });
});
