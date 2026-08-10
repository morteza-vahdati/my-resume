/** Matches the scroll-padding-top pair in globals.css. */
const OFFSET = { mobile: 56, desktop: 64 };

/** The nav lands a section under the fixed bar, not flush with the viewport top. */
function assertLandedUnderNavbar(id: string, offset: number) {
  cy.get(`#${id}`).then(($el) => {
    const top = $el[0].getBoundingClientRect().top;
    expect(top, `#${id} sits just under the navbar`).to.be.closeTo(offset, 4);
  });
}

describe("Section navigation", () => {
  beforeEach(() => {
    cy.visitLocale("en");
  });

  it("scrolls to a section and records the hash", () => {
    cy.contains("nav button", "Projects").click();
    cy.hash().should("eq", "#projects");
    cy.get("#projects").should("be.visible");
  });

  it("lands the section below the fixed navbar", () => {
    cy.contains("nav button", "About").click();
    // The scroll is animated; wait for it to settle before measuring.
    cy.wait(1200);
    assertLandedUnderNavbar("about", OFFSET.desktop);
  });

  it("returns to the top from the brand button", () => {
    cy.contains("nav button", "Contact").click();
    cy.wait(1200);
    cy.window().its("scrollY").should("be.greaterThan", 100);

    cy.get("nav button").first().click();
    cy.wait(1200);
    cy.window().its("scrollY").should("be.lessThan", 5);
  });

  it("honours a hash in the visited URL", () => {
    cy.visitLocale("en", "#experience");
    cy.wait(1200);
    assertLandedUnderNavbar("experience", OFFSET.desktop);
  });
});

describe("Section navigation (mobile)", () => {
  beforeEach(() => {
    cy.viewport(375, 667);
    cy.visitLocale("en");
  });

  it("uses the tighter mobile offset", () => {
    cy.get('[aria-label="Toggle menu"]').click();
    cy.get('[data-testid="mobile-menu"]').contains("About").click();
    cy.wait(1200);
    assertLandedUnderNavbar("about", OFFSET.mobile);
  });

  it("opens and closes the hamburger menu", () => {
    cy.get('[aria-label="Toggle menu"]')
      .should("be.visible")
      .and("have.attr", "aria-expanded", "false");

    cy.get('[aria-label="Toggle menu"]').click();
    cy.get('[data-testid="mobile-menu"]').should("be.visible");
    cy.get('[aria-label="Toggle menu"]').should(
      "have.attr",
      "aria-expanded",
      "true",
    );

    cy.get('[aria-label="Toggle menu"]').click();
    cy.get('[data-testid="mobile-menu"]').should("not.exist");
  });

  it("closes the menu after picking a section", () => {
    cy.get('[aria-label="Toggle menu"]').click();
    cy.get('[data-testid="mobile-menu"]').contains("Contact").click();
    cy.get('[data-testid="mobile-menu"]').should("not.exist");
    cy.hash().should("eq", "#contact");
  });
});

describe("404 navigation", () => {
  /** cy.visit treats a 404 status as a failure unless told otherwise. */
  const notFound = { failOnStatusCode: false };

  it("goes home from the 404 page", () => {
    cy.visitLocale("en", "/no-such-page", notFound);
    cy.contains("a", "Back to Home").click();
    cy.location("pathname").should("eq", "/en");
    cy.get("#hero").should("exist");
  });

  it("reaches the contact section from the 404 page", () => {
    cy.visitLocale("en", "/no-such-page", notFound);
    cy.contains("a", "Contact me").click();
    cy.location("pathname").should("eq", "/en");
    cy.get("#contact").should("exist");
  });
});
