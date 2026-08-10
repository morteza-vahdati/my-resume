describe("Locale redirects", () => {
  it("sends a locale-less path to a locale in one hop", () => {
    cy.request({ url: "/", followRedirect: false }).then((res) => {
      expect(res.status).to.eq(307);
      expect(res.redirectedToUrl).to.match(/\/(en|fa)$/);
    });
  });

  it("keeps the query string across the redirect", () => {
    cy.request({ url: "/?utm_source=linkedin&ref=cv", followRedirect: false }).then((res) => {
      expect(res.redirectedToUrl).to.include("utm_source=linkedin");
      expect(res.redirectedToUrl).to.include("ref=cv");
    });
  });

  it("honours the locale cookie", () => {
    cy.setCookie("locale", "fa");
    cy.request({ url: "/", followRedirect: false })
      .its("redirectedToUrl")
      .should("match", /\/fa$/);
  });
});

describe("Metadata", () => {
  it("declares a canonical URL and both hreflang alternates", () => {
    cy.visitLocale("en");
    cy.get('link[rel="canonical"]').should("have.attr", "href").and("include", "/en");
    cy.get('link[rel="alternate"][hreflang="en"]').should("exist");
    cy.get('link[rel="alternate"][hreflang="fa"]').should("exist");
    cy.get('link[rel="alternate"][hreflang="x-default"]').should("exist");
  });

  it("carries Person JSON-LD", () => {
    cy.request("/en").then((res) => {
      const match = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/.exec(
        res.body,
      );
      if (!match) throw new Error("No JSON-LD block in the page");

      const data = JSON.parse(match[1]);
      expect(data["@type"]).to.eq("Person");
      expect(data.name).to.be.a("string").and.not.be.empty;
      expect(data.sameAs).to.be.an("array").and.have.length.greaterThan(0);
    });
  });

  it("localises the title and description", () => {
    cy.visitLocale("en");
    cy.title().should("not.be.empty");
    cy.get('meta[name="description"]').should("have.attr", "content").and("not.be.empty");

    cy.visitLocale("fa");
    cy.title().should("not.be.empty");
  });
});

describe("Crawler routes", () => {
  const routes = ["/sitemap.xml", "/robots.txt", "/manifest.webmanifest"];

  routes.forEach((route) => {
    it(`serves ${route}`, () => {
      cy.request(route).its("status").should("eq", 200);
    });
  });

  it("lists both locales in the sitemap", () => {
    cy.request("/sitemap.xml").its("body").should("include", "/en").and("include", "/fa");
  });

  it("points robots.txt at the sitemap", () => {
    cy.request("/robots.txt").its("body").should("include", "Sitemap:");
  });
});

describe("Security headers", () => {
  it("sets a content security policy and the usual hardening headers", () => {
    cy.request("/en")
      .its("headers")
      .then((headers) => {
        expect(headers).to.have.property("content-security-policy");
        expect(headers).to.have.property("x-content-type-options", "nosniff");
        expect(headers).to.have.property("referrer-policy");
      });
  });
});
