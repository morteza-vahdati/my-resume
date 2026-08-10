/// <reference types="cypress" />

// Framer Motion and the Font Awesome CDN both throw noise that has nothing to
// do with the behaviour under test.
Cypress.on("uncaught:exception", () => false);

export {};

declare global {
  namespace Cypress {
    interface Chainable {
      /** Visit a locale path with the intro overlay already dismissed. */
      visitLocale(
        locale: "en" | "fa",
        path?: string,
        options?: VisitLocaleOptions,
      ): Chainable<void>;
      /** Visit and let the intro screen play, for tests that assert on it. */
      visitWithIntro(locale: "en" | "fa", path?: string): Chainable<void>;
      fillContactForm(data?: Partial<ContactFormData>): Chainable<void>;
      /** Wait until the animated scroll stops moving, rather than guessing a duration. */
      waitForScrollEnd(): Chainable<void>;
    }
  }
}

export interface VisitLocaleOptions {
  /** Set false to visit a page that answers 404 — cy.visit fails on it otherwise. */
  failOnStatusCode?: boolean;
  /** Pin the theme so the test does not inherit the machine's OS preference. */
  theme?: "light" | "dark";
}

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
  rating: number;
}

const DEFAULT_FORM: ContactFormData = {
  name: "John Doe",
  email: "john@example.com",
  message: "Hello, this is a test message with enough characters.",
  rating: 5,
};

/**
 * The intro plays once per session and covers the page while it does. Marking
 * it shown before the app boots keeps every other test off an arbitrary wait.
 */
Cypress.Commands.add("visitLocale", (locale, path = "", options = {}) => {
  const { failOnStatusCode = true, theme } = options;
  cy.visit(`/${locale}${path}`, {
    failOnStatusCode,
    onBeforeLoad(win) {
      win.sessionStorage.setItem("intro-shown", "1");
      if (theme) win.localStorage.setItem("theme", theme);
    },
  });
});

Cypress.Commands.add("visitWithIntro", (locale, path = "") => {
  cy.visit(`/${locale}${path}`, {
    onBeforeLoad(win) {
      win.sessionStorage.removeItem("intro-shown");
    },
  });
});

/** Stars render in reverse DOM order under RTL, so pick them by label, not index. */
/**
 * src/lib/scroll.ts animates over ~900ms. Polling for two identical readings is
 * steadier than a fixed wait: it returns as soon as the scroll lands and still
 * holds up if the animation is slower on a loaded machine.
 */
Cypress.Commands.add("waitForScrollEnd", () => {
  let last = -1;
  const poll = (): void => {
    cy.window().then((win) => {
      const y = Math.round(win.scrollY);
      if (y === last) return;
      last = y;
      cy.wait(120, { log: false });
      poll();
    });
  };
  poll();
});

Cypress.Commands.add("fillContactForm", (data = {}) => {
  const { name, email, message, rating } = { ...DEFAULT_FORM, ...data };
  cy.get("#contact input[autocomplete='name']").clear().type(name);
  cy.get("#contact input[autocomplete='email']").clear().type(email);
  cy.get("#contact textarea").clear().type(message);
  cy.get(`#contact button[aria-label='${rating} star${rating > 1 ? "s" : ""}']`).click({
    force: true,
  });
});
