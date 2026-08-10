import { defineConfig } from "cypress"
import { mkdirSync, renameSync } from "fs"
import { dirname, join } from "path"

const SITE_URL = process.env.SITE_URL || "http://localhost:3000"
const baseUrl = SITE_URL.startsWith("http") ? SITE_URL : `http://${SITE_URL}`

export default defineConfig({
  e2e: {
    baseUrl,
    // The capture/ folder holds the README screenshot job, which is run on
    // demand by `npm run screenshots` — not part of the test suite.
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    supportFile: "cypress/support/e2e.ts",
    video: false,
    viewportWidth: 1280,
    viewportHeight: 800,
    setupNodeEvents(on) {
      // Cypress files screenshots under a per-spec subfolder. The README links
      // to them, so lift the named ones up to a stable, readable path.
      on("after:screenshot", (details) => {
        if (!details.name) return
        const target = join(dirname(dirname(details.path)), `${details.name}.png`)
        mkdirSync(dirname(target), { recursive: true })
        renameSync(details.path, target)
        return { path: target }
      })
    },
  },
})
