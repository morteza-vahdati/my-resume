/**
 * Regenerates the README images. Not part of the normal suite — `specPattern`
 * only picks up cypress/e2e, so this runs on demand via `npm run screenshots`.
 *
 * It asserts before each shutter: a screenshot of a half-rendered page is worse
 * than no screenshot, and a blank or fontless PNG is exactly the kind of thing
 * that gets committed without anyone noticing.
 */

/** Everything the captured viewport contains has to have actually arrived. */
function settleHero() {
  cy.get("#hero h1").should("be.visible");
  cy.get("#hero img")
    .should("be.visible")
    .and(($img) => {
      const img = $img[0] as HTMLImageElement;
      expect(img.naturalWidth, "portrait decoded").to.be.greaterThan(0);
    });
  // Webfonts swap in late; capturing first bakes the fallback face into the PNG.
  cy.document().its("fonts.status").should("eq", "loaded");
  // Let the hero entrance transition and the typewriter land.
  cy.wait(1200);
}

describe("README screenshots", () => {
  it("captures the English home page in light mode", () => {
    cy.visitLocale("en", "", { theme: "light" });
    cy.get("html").should("not.have.class", "dark");
    settleHero();

    cy.screenshot("home-en-light", { capture: "viewport", overwrite: true });
  });

  it("captures the Persian home page in dark mode", () => {
    cy.visitLocale("fa", "", { theme: "dark" });
    cy.get("html").should("have.class", "dark");
    cy.get("html").should("have.attr", "dir", "rtl");
    settleHero();

    cy.screenshot("home-fa-dark", { capture: "viewport", overwrite: true });
  });
});
