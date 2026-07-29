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

describe("Contact Form (EN)", () => {
  beforeEach(() => {
    cy.on("uncaught:exception", () => false)
    cy.visit("/en")
    cy.get("#contact").scrollIntoView()
    cy.get("#contact input[autocomplete='name']", { timeout: 8000 }).should("exist")
    cy.wait(500)
  })

  it("shows validation errors when submitting empty", () => {
    cy.get("#contact button").contains("Send Message").click()
    cy.get("#contact").contains("Name must be at least 2 characters").should("be.visible")
    cy.get("#contact").contains("Please enter a valid email").should("be.visible")
    cy.get("#contact").contains("Message must be at least 10 characters").should("be.visible")
    cy.get("#contact").contains("Please select a rating").should("be.visible")
  })

  it("clears validation errors after filling fields", () => {
    cy.get("#contact button").contains("Send Message").click()
    cy.get("#contact input[autocomplete='name']").type("John Doe")
    cy.get("#contact").contains("Name must be at least 2 characters").should("not.exist")
  })

  it("shows all form fields", () => {
    cy.get("#contact input[autocomplete='name']").should("exist")
    cy.get("#contact input[autocomplete='email']").should("exist")
    cy.get("#contact textarea").should("exist")
  })

  it("has rating stars in the form", () => {
    cy.get("#contact button[aria-label*='star']").should("have.length.at.least", 5)
  })

  it("selects a rating and shows label", () => {
    cy.get("#contact button[aria-label*='star']").eq(4).click({ force: true })
    cy.contains("Excellent").should("exist")
  })

  it("submits with valid data and shows success", () => {
    cy.intercept("POST", "/api/contact", { statusCode: 200, body: { success: true } }).as("submitForm")
    cy.get("#contact input[autocomplete='name']").type("John Doe")
    cy.get("#contact input[autocomplete='email']").type("john@example.com")
    cy.get("#contact textarea").type("Hello, this is a test message with enough characters.")
    cy.get("#contact button[aria-label*='star']").eq(4).click({ force: true })
    cy.get("#contact button").contains("Send Message").click()
    cy.wait("@submitForm", { timeout: 10000 })
    cy.get("#contact .fa-check", { timeout: 8000 }).should("exist")
  })

  it("shows sending state on button", () => {
    cy.intercept("POST", "/api/contact", { statusCode: 200, body: { success: true }, delayMs: 2000 }).as("submitForm")
    cy.get("#contact input[autocomplete='name']").type("John Doe")
    cy.get("#contact input[autocomplete='email']").type("john@example.com")
    cy.get("#contact textarea").type("Hello, this is a test message with enough characters.")
    cy.get("#contact button[aria-label*='star']").eq(4).click({ force: true })
    cy.get("#contact button").contains("Send Message").click()
    cy.get("#contact button").contains("Sending", { timeout: 3000 }).should("exist")
  })
})

describe("Contact Form (FA)", () => {
  beforeEach(() => {
    cy.on("uncaught:exception", () => false)
    cy.visit("/fa")
    cy.get("#contact").scrollIntoView()
    cy.get("#contact input[autocomplete='name']", { timeout: 8000 }).should("exist")
    cy.wait(500)
  })

  it("shows Persian validation errors", () => {
    cy.get("#contact button").contains("ارسال پیام").click()
    cy.get("#contact").contains("نام", { timeout: 7000 }).should("exist")
    cy.get("#contact").contains("ایمیل معتبر", { timeout: 7000 }).should("exist")
    cy.get("#contact").contains("پیام باید", { timeout: 7000 }).should("exist")
    cy.get("#contact").contains("امتیاز", { timeout: 7000 }).should("exist")
  })

  it("submits with valid Persian data", () => {
    cy.intercept({ method: "POST", url: "/api/contact" }, { success: true }).as("submitForm")
    cy.get("#contact input[autocomplete='name']").type("مرتضی وحدتی")
    cy.get("#contact input[autocomplete='email']").type("test@example.com")
    cy.get("#contact textarea").type("این یک پیام تست برای آزمایش فرم تماس است.")
    cy.get("#contact button[aria-label*='star']").eq(0).click({ force: true })
    cy.get("#contact button").contains("ارسال پیام").click()
    cy.wait("@submitForm", { timeout: 8000 }).its("response.statusCode").should("eq", 200)
    cy.get("#contact").contains("با موفقیت ارسال شد", { timeout: 5000 }).should("exist")
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
    cy.get("#hero .max-w-5xl").should("exist")
  })
})
