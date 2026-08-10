import { defineConfig } from "cypress"

const SITE_URL = process.env.SITE_URL || "http://localhost:3000"
const baseUrl = SITE_URL.startsWith("http") ? SITE_URL : `http://${SITE_URL}`

export default defineConfig({
  e2e: {
    baseUrl,
    supportFile: "cypress/support/e2e.ts",
    video: false,
    viewportWidth: 1280,
    viewportHeight: 800,
  },
})
