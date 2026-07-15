import { MetadataRoute } from "next"
import { i18n } from "@/i18config"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://mvahdati.ir"

  const entries: MetadataRoute.Sitemap = []

  for (const locale of i18n.locales) {
    entries.push({
      url: `${baseUrl}/${locale}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    })
  }

  return entries
}
