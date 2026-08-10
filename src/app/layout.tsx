import { cookies, headers } from "next/headers"
import ThemeProvider from "@/provider/theme-provider"
import LoadingScreen from "@/components/ui/LoadingScreen"
import LocaleHtmlSync from "@/components/ui/LocaleHtmlSync"
import { iransansfanum } from "@/lib/iransans-font"
import "./globals.css"

export default function RootLayout({ children }: { children: React.ReactNode }) {

  const rawLocale = headers().get("x-locale") || cookies().get("locale")?.value || ""

  const locale = rawLocale === "fa" ? "fa" : "en"

  const dir = locale === "fa" ? "rtl" : "ltr"

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){if(location.hash){history.scrollRestoration="manual";window.scrollTo(0,0)}try{if(sessionStorage.getItem("intro-shown")!=="1"){document.documentElement.classList.add("intro-pending")}}catch(e){}})()`,
          }}
        />
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
        {/* Painted before hydration; see the `intro-pending` rules in globals.css. */}
        <div
          id="intro-boot"
          aria-hidden="true"
          className="fixed inset-0 z-[9999] items-center justify-center bg-background"
        >
          <div className="size-10 rounded-[10px] bg-primary/80 shadow-md" />
        </div>
        <ThemeProvider>
          {/* Both live above `[locale]` so a language switch does not unmount them. */}
          <LocaleHtmlSync />
          <LoadingScreen locale={locale} />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
