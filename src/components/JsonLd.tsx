import { getResumeData, getLocalizedText } from "@/lib/resume"
import { siteConfig } from "@/lib/site-config"
import type { Locale } from "@/i18config"

export default function JsonLd({ locale }: { locale: Locale }) {
  const data = getResumeData()
  const personal = data.personal
  const social = data.social

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: getLocalizedText(personal.name, locale),
    givenName: personal.name.en.split(" ")[0],
    familyName: personal.name.en.split(" ").slice(1).join(" "),
    email: personal.email,
    telephone: personal.phone,
    jobTitle: getLocalizedText(personal.role, locale),
    knowsAbout: data.skills.categories.flatMap((c) =>
      c.items.map((i) => i.name)
    ),
    knowsLanguage: personal.languages.map((l) => l.name.en),
    url: siteConfig.url,
    sameAs: [social.github, social.linkedin],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
