import { Metadata } from 'next'
import { i18n, Locale } from '@/i18config'
import { getSeo } from '@/lib/resume'
import { siteConfig } from '@/lib/site-config'

export async function generateMetadata({ params }: { params: { locale: Locale } }): Promise<Metadata> {
  const seo = getSeo(params.locale)
  const baseUrl = siteConfig.url

  const languages = Object.fromEntries(
    i18n.locales.map((l) => [l, `${baseUrl}/${l}`]),
  )

  return {
    metadataBase: new URL(baseUrl),
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    alternates: {
      canonical: `${baseUrl}/${params.locale}`,
      languages: { ...languages, "x-default": `${baseUrl}/${i18n.defaultLocale}` },
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      type: "website",
      url: `${baseUrl}/${params.locale}`,
      locale: params.locale === "fa" ? "fa_IR" : "en_US",
      siteName: seo.title,
    },
  }
}

export default function LocaleLayout({ children }: { children: React.ReactNode }) {
  return (<>{children}</>)
}
