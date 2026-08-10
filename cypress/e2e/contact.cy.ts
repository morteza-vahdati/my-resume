const T = {
  en: {
    send: "Send Message",
    sending: "Sending",
    name: "Name must be at least 2 characters",
    email: "Please enter a valid email",
    message: "Message must be at least 10 characters",
    rating: "Please select a rating",
    success: "sent successfully",
  },
  fa: {
    send: "ارسال پیام",
    sending: "در حال ارسال",
    name: "نام باید حداقل ۲ حرف باشد",
    email: "ایمیل معتبر وارد کنید",
    message: "پیام باید حداقل ۱۰ حرف باشد",
    rating: "لطفاً یک امتیاز انتخاب کنید",
    success: "با موفقیت ارسال شد",
  },
};

/**
 * Every submit is stubbed. A real POST would reach the configured SMTP server
 * and mail the site owner on every test run.
 */
function stubSubmit(body: object = { success: true, emailSent: false }, delay = 0) {
  cy.intercept("POST", "/api/contact", { statusCode: 200, body, delay }).as("submit");
}

/**
 * The section is wrapped in ScrollReveal, which holds it at opacity 0 until it
 * enters the viewport — Cypress treats that as not visible and every action
 * would time out. The form sits in the lower half of a tall section, so bring
 * the whole thing through the viewport, not just its top edge. `once: true`
 * means the reveal sticks once it has fired.
 */
function openContact(locale: "en" | "fa") {
  cy.visitLocale(locale);
  cy.get("#contact").scrollIntoView();
  cy.scrollTo("bottom");
  cy.get("#contact input[autocomplete='name']").should("be.visible");
}

describe("Contact form (EN)", () => {
  beforeEach(() => {
    openContact("en");
  });

  it("renders every field", () => {
    cy.get("#contact input[autocomplete='name']").should("exist");
    cy.get("#contact input[autocomplete='email']").should("exist");
    cy.get("#contact textarea").should("exist");
    cy.get("#contact button[aria-label*='star']").should("have.length", 5);
  });

  it("reports every empty field on submit", () => {
    cy.contains("#contact button", T.en.send).click();
    cy.get("#contact").contains(T.en.name).should("be.visible");
    cy.get("#contact").contains(T.en.email).should("be.visible");
    cy.get("#contact").contains(T.en.message).should("be.visible");
    cy.get("#contact").contains(T.en.rating).should("be.visible");
  });

  it("clears a field error as soon as it is corrected", () => {
    cy.contains("#contact button", T.en.send).click();
    cy.get("#contact").contains(T.en.name).should("be.visible");
    cy.get("#contact input[autocomplete='name']").type("John Doe");
    cy.get("#contact").contains(T.en.name).should("not.exist");
  });

  it("labels the selected rating", () => {
    cy.get("#contact button[aria-label='5 stars']").click({ force: true });
    cy.get("#contact").contains("Excellent").should("be.visible");
  });

  it("toggles a rating off when the same star is clicked twice", () => {
    cy.get("#contact button[aria-label='3 stars']").click({ force: true });
    cy.get("#contact").contains("Good").should("be.visible");

    cy.get("#contact button[aria-label='3 stars']").click({ force: true });
    // The label previews on hover too, and the pointer is still on the star.
    // React synthesises onMouseLeave from `mouseout`, so `mouseleave` alone
    // never reaches the handler — send the event React actually listens for.
    cy.get("#contact button[aria-label='3 stars']").trigger("mouseout", {
      relatedTarget: null,
    });
    cy.get("#contact").contains("Good").should("not.exist");
  });

  it("submits valid data and confirms", () => {
    stubSubmit();
    cy.fillContactForm();
    cy.contains("#contact button", T.en.send).click();
    cy.wait("@submit");
    cy.get("#contact").contains(T.en.success).should("be.visible");
  });

  it("sends the anti-spam fields with the payload", () => {
    stubSubmit();
    cy.fillContactForm();
    cy.contains("#contact button", T.en.send).click();
    cy.wait("@submit").then(({ request }) => {
      expect(request.body.honeypot).to.eq("");
      expect(request.body.elapsedMs).to.be.a("number").and.be.greaterThan(0);
      expect(request.body.rating).to.eq(5);
    });
  });

  it("disables the button while the request is in flight", () => {
    stubSubmit({ success: true, emailSent: false }, 1500);
    cy.fillContactForm();
    cy.contains("#contact button", T.en.send).click();
    // Double submits would send the same message twice.
    cy.contains("#contact button", T.en.sending).should("be.visible").and("be.disabled");
  });

  it("surfaces a server-side field error in English", () => {
    cy.intercept("POST", "/api/contact", {
      statusCode: 400,
      body: { errors: { email: { en: "Server says no.", fa: "سرور قبول نکرد." } } },
    }).as("submit");
    cy.fillContactForm();
    cy.contains("#contact button", T.en.send).click();
    cy.wait("@submit");
    cy.get("#contact").contains("Server says no.").should("be.visible");
  });

  it("surfaces a rate-limit message", () => {
    cy.intercept("POST", "/api/contact", {
      statusCode: 429,
      body: {
        error: { en: "Too many requests.", fa: "درخواست بیش از حد." },
      },
    }).as("submit");
    cy.fillContactForm();
    cy.contains("#contact button", T.en.send).click();
    cy.wait("@submit");
    cy.contains("Too many requests.").should("be.visible");
  });
});

describe("Contact form (FA)", () => {
  beforeEach(() => {
    openContact("fa");
  });

  it("reports empty fields in Persian", () => {
    cy.contains("#contact button", T.fa.send).click();
    cy.get("#contact").contains(T.fa.name).should("be.visible");
    cy.get("#contact").contains(T.fa.email).should("be.visible");
    cy.get("#contact").contains(T.fa.message).should("be.visible");
    cy.get("#contact").contains(T.fa.rating).should("be.visible");
  });

  it("submits Persian content", () => {
    stubSubmit();
    cy.fillContactForm({
      name: "مرتضی وحدتی",
      email: "test@example.com",
      message: "این یک پیام تست برای آزمایش فرم تماس است.",
      rating: 4,
    });
    cy.contains("#contact button", T.fa.send).click();
    cy.wait("@submit").then(({ request }) => {
      expect(request.body.rating).to.eq(4);
    });
    cy.get("#contact").contains(T.fa.success).should("be.visible");
  });

  it("picks the Persian half of a server error", () => {
    cy.intercept("POST", "/api/contact", {
      statusCode: 400,
      body: { errors: { email: { en: "Server says no.", fa: "سرور قبول نکرد." } } },
    }).as("submit");
    cy.fillContactForm({ email: "test@example.com" });
    cy.contains("#contact button", T.fa.send).click();
    cy.wait("@submit");
    cy.get("#contact").contains("سرور قبول نکرد.").should("be.visible");
  });
});
