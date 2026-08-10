const SECTIONS = [
  "hero",
  "about",
  "skills",
  "experience",
  "education",
  "projects",
  "contact",
];

const NAV_LABELS = {
  en: ["About", "Skills", "Experience", "Projects", "Contact"],
  fa: ["درباره من", "مهارت‌ها", "تجربه", "پروژه‌ها", "تماس"],
};

describe("Home (EN)", () => {
  beforeEach(() => {
    cy.visitLocale("en");
  });

  it("has a title and the document language", () => {
    cy.title().should("not.be.empty");
    cy.get("html").should("have.attr", "lang", "en");
    cy.get("html").should("have.attr", "dir", "ltr");
  });

  it("renders every section", () => {
    SECTIONS.forEach((id) => cy.get(`#${id}`).should("exist"));
  });

  it("renders the hero heading and portrait", () => {
    cy.get("#hero h1").should("be.visible");
    cy.get("#hero img").should("be.visible");
  });

  it("shows the desktop nav labels", () => {
    NAV_LABELS.en.forEach((label) => cy.contains("nav", label).should("be.visible"));
  });

  it("does not scroll horizontally", () => {
    cy.document().then((doc) => {
      expect(doc.documentElement.scrollWidth).to.be.closeTo(
        doc.documentElement.clientWidth,
        5,
      );
    });
  });
});

describe("Home (FA)", () => {
  beforeEach(() => {
    cy.visitLocale("fa");
  });

  it("renders right-to-left", () => {
    cy.get("html").should("have.attr", "lang", "fa");
    cy.get("html").should("have.attr", "dir", "rtl");
  });

  it("shows the Persian nav labels", () => {
    NAV_LABELS.fa.forEach((label) => cy.contains("nav", label).should("be.visible"));
  });

  it("renders every section", () => {
    SECTIONS.forEach((id) => cy.get(`#${id}`).should("exist"));
  });
});

describe("Not found", () => {
  /** cy.visit treats a 404 status as a failure unless told otherwise. */
  const notFound = { failOnStatusCode: false };

  it("returns 404 and still renders the chrome", () => {
    cy.request({ url: "/en/no-such-page", failOnStatusCode: false })
      .its("status")
      .should("eq", 404);

    cy.visitLocale("en", "/no-such-page", notFound);
    cy.contains("Page not found").should("be.visible");
    cy.get("nav").should("be.visible");
    cy.get("footer").should("exist");
  });

  it("keeps the locale of the requested path", () => {
    cy.visitLocale("fa", "/no-such-page", notFound);
    cy.get("html").should("have.attr", "dir", "rtl");
    cy.contains("صفحه‌ای که به دنبال آن هستید یافت نشد").should("be.visible");
  });
});
