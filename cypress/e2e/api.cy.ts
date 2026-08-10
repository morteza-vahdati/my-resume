/**
 * These specs drive the real route, not a stub. They deliberately stop at the
 * guards: a payload that passes validation would reach the configured SMTP
 * server and mail the site owner on every run. The happy path is covered from
 * the UI in contact.cy.ts, where the POST is intercepted.
 */

const ORIGIN = Cypress.config("baseUrl") as string;

/** Old enough to clear MIN_FORM_TIME. */
const HUMAN_ELAPSED = 5_000;

const VALID = {
  name: "John Doe",
  email: "john@example.com",
  message: "Hello, this is a test message with enough characters.",
  rating: 5,
  honeypot: "",
  elapsedMs: HUMAN_ELAPSED,
};

/**
 * The rate limiter keys on x-forwarded-for and lives in module memory, so each
 * test claims its own IP rather than inheriting the previous test's count.
 */
function post(body: object, ip: string, origin: string | null = ORIGIN) {
  const headers: Record<string, string> = { "x-forwarded-for": ip };
  if (origin) headers.origin = origin;
  return cy.request({
    method: "POST",
    url: "/api/contact",
    failOnStatusCode: false,
    headers,
    body,
  });
}

describe("POST /api/contact — origin", () => {
  it("rejects a foreign origin", () => {
    post(VALID, "10.0.0.1", "https://evil.example.com").then((res) => {
      expect(res.status).to.eq(403);
      expect(res.body.error).to.have.keys("en", "fa");
    });
  });

  it("accepts the site's own origin", () => {
    post({ ...VALID, name: "" }, "10.0.0.2").then((res) => {
      // 400 rather than 403: the origin passed and validation is what failed.
      expect(res.status).to.eq(400);
      expect(res.body.errors).to.have.property("name");
    });
  });
});

describe("POST /api/contact — bot guards", () => {
  it("rejects a filled honeypot", () => {
    post({ ...VALID, honeypot: "http://spam.example" }, "10.0.1.1").then((res) => {
      expect(res.status).to.eq(400);
      // Deliberately vague: telling a bot which trap it hit helps it past the trap.
      expect(res.body.error.en).to.eq("Invalid request");
    });
  });

  it("rejects a form submitted faster than a human could fill it", () => {
    post({ ...VALID, elapsedMs: 200 }, "10.0.1.2").then((res) => {
      expect(res.status).to.eq(400);
    });
  });

  it("rejects a missing timing field", () => {
    const { elapsedMs, ...withoutTiming } = VALID;
    expect(elapsedMs).to.be.a("number");
    post(withoutTiming, "10.0.1.3").then((res) => {
      expect(res.status).to.eq(400);
    });
  });
});

describe("POST /api/contact — validation", () => {
  it("returns every field error at once, in both languages", () => {
    post(
      { name: "x", email: "not-an-email", message: "short", rating: 0, elapsedMs: HUMAN_ELAPSED },
      "10.0.2.1",
    ).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.errors).to.have.keys("name", "email", "message", "rating");
      Object.values(res.body.errors).forEach((err) => {
        expect(err).to.have.keys("en", "fa");
      });
    });
  });

  it("rejects a non-string field rather than coercing it", () => {
    post({ ...VALID, name: 42, email: null }, "10.0.2.2").then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.errors).to.have.keys("name", "email");
    });
  });
});

describe("POST /api/contact — rate limit", () => {
  it("allows three requests per IP per minute and then 429s", () => {
    const ip = "10.0.3.1";
    // Validation failures still consume the allowance — the limiter runs first.
    const invalid = { ...VALID, name: "" };

    for (let i = 1; i <= 3; i++) {
      post(invalid, ip).its("status").should("eq", 400);
    }

    post(invalid, ip).then((res) => {
      expect(res.status).to.eq(429);
      expect(res.body.error).to.have.keys("en", "fa");
    });
  });

  it("counts each IP separately", () => {
    post({ ...VALID, name: "" }, "10.0.3.2").its("status").should("eq", 400);
  });
});
