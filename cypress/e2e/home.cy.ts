describe("Homepage (EN)", () => {
  beforeEach(() => {
    cy.on("uncaught:exception", () => false)
    cy.visit("/en")
  })

  it("loads with correct title", () => {
    cy.title().should("not.be.empty")
  })

  it("shows all nav items", () => {
    const items = ["About", "Skills", "Experience", "Projects", "Contact"]
    items.forEach((item) => {
      cy.contains(item).should("be.visible")
    })
  })

  it("scrolls to section on nav click", () => {
    cy.contains("About").click()
    cy.get("#about").should("be.visible")
  })

  it("renders the hero section", () => {
    cy.get("#hero").should("exist")
    cy.get("#hero").within(() => {
      cy.get("h1").should("be.visible")
    })
  })

  it("has a working language toggle", () => {
    cy.get('[aria-label="Change language"]').click()
    cy.url().should("include", "/fa")
    cy.title().should("not.be.empty")
  })

  it("renders all sections", () => {
    const sections = ["about", "skills", "experience", "education", "projects", "contact"]
    sections.forEach((id) => {
      cy.get(`#${id}`).should("exist")
    })
  })
})

describe("Homepage (FA)", () => {
  beforeEach(() => {
    cy.on("uncaught:exception", () => false)
    cy.visit("/fa")
  })

  it("loads with RTL direction", () => {
    cy.get("html").should("have.attr", "dir", "rtl")
  })

  it("shows Persian nav labels", () => {
    const items = ["درباره من", "مهارت‌ها", "تجربه", "پروژه‌ها", "تماس"]
    items.forEach((item) => {
      cy.contains(item).should("be.visible")
    })
  })
})

describe("Responsive: Mobile (375px)", () => {
  beforeEach(() => {
    cy.on("uncaught:exception", () => false)
    cy.viewport(375, 667)
    cy.visit("/en")
  })

  it("shows hamburger menu", () => {
    cy.get('[aria-label="Toggle menu"]').should("be.visible")
    cy.get("ul").should("not.be.visible")
  })

  it("mobile menu opens and closes", () => {
    cy.get('[aria-label="Toggle menu"]').click()
    cy.get(".fixed.top-\\[64px\\]").should("be.visible")
    cy.get(".fixed.top-\\[64px\\]").within(() => {
      cy.contains("About").should("be.visible")
      cy.contains("Projects").should("be.visible")
    })
    cy.get('[aria-label="Toggle menu"]').click()
    cy.get(".fixed.top-\\[64px\\]").should("not.exist")
  })

  it("hero image is visible", () => {
    cy.get("#hero img").should("be.visible")
  })

  it("no horizontal scroll", () => {
    cy.document().then((doc) => {
      expect(doc.documentElement.scrollWidth).to.be.closeTo(doc.documentElement.clientWidth, 5)
    })
  })
})

describe("Responsive: Tablet (768px)", () => {
  beforeEach(() => {
    cy.on("uncaught:exception", () => false)
    cy.viewport(768, 1024)
    cy.visit("/en")
  })

  it("shows desktop nav", () => {
    cy.contains("About").should("be.visible")
    cy.contains("Skills").should("be.visible")
  })

  it("sections stack correctly", () => {
    cy.get("#about .grid").should("exist")
  })
})

describe("Responsive: Desktop (1280px)", () => {
  beforeEach(() => {
    cy.on("uncaught:exception", () => false)
    cy.viewport(1280, 800)
    cy.visit("/en")
  })

  it("full nav visible", () => {
    cy.contains("About").should("be.visible")
    cy.contains("Skills").should("be.visible")
    cy.contains("Experience").should("be.visible")
    cy.contains("Projects").should("be.visible")
    cy.contains("Contact").should("be.visible")
  })

  it("hero layout is horizontal", () => {
    cy.get("#hero .max-w-\\[1000px\\]").should("exist")
  })
})
