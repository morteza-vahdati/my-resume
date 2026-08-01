import { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Locale } from '@/i18config'
import { getSeo } from '@/lib/resume'

const LoadingScreen = dynamic(() => import('@/components/ui/LoadingScreen'), { ssr: false })

export async function generateMetadata({ params }: { params: { locale: Locale } }): Promise<Metadata> {
  const seo = getSeo(params.locale)
  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    openGraph: {
      title: seo.title,
      description: seo.description,
      type: "website",
      locale: params.locale === "fa" ? "fa_IR" : "en_US",
      siteName: seo.title,
    },
  }
}

export default function LocaleLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <LoadingScreen />
      {children}
      <SpeedInsights />
    </>
  )
}
