import { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { SpeedInsights } from '@vercel/speed-insights/next'
import ThemeProvider from '@/provider/theme-provider'
import { Locale } from '@/i18config'
import { getSeo } from '@/lib/resume'
import { iransansfanum } from '@/lib/iransans-font'
import "./globals.css"

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

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { locale: Locale }
}) {
  return (
    <html lang={params.locale} dir={params.locale === "fa" ? "rtl" : "ltr"} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Archivo:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
        />
      </head>
      <body className={`${iransansfanum.variable}`}>
        <ThemeProvider>
          <LoadingScreen />
          {children}
        </ThemeProvider>
        <SpeedInsights />
      </body>
    </html>
  )
}
