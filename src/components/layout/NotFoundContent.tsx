"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import type { Locale } from "@/i18config"

export default function NotFoundContent({ initialLocale }: { initialLocale: Locale }) {
  const [locale, setLocale] = useState<Locale>(initialLocale)
  const isRtl = locale === "fa"

  useEffect(() => {
    document.documentElement.lang = locale
    document.documentElement.dir = isRtl ? "rtl" : "ltr"
  }, [locale, isRtl])

  return (
    <div className="relative z-10 min-h-screen flex flex-col overflow-x-hidden">
      <Navbar locale={locale} onLocaleChange={setLocale} />

      <main className="flex-1 flex items-center justify-center px-4 sm:px-8 pt-[96px] pb-16">
        <div className="text-center max-w-xl w-full animate-[fadeUp_0.6s_ease_both]">
          <div
            className="text-[clamp(4.5rem,14vw,9.5rem)] font-black tracking-[-4px] leading-none font-display select-none bg-gradient-to-b from-accent/70 to-accent/15 bg-clip-text text-transparent"
            aria-hidden
          >
            404
          </div>

          <div
            className="relative -mt-4 sm:-mt-6 mb-10 p-8 sm:p-10 rounded-2xl backdrop-blur-xl border"
            style={{
              backgroundColor: "var(--color-glass-bg)",
              borderColor: "var(--color-glass-bdr)",
              boxShadow: "var(--shadow-glass)",
            }}
          >
            <div className="w-14 h-14 rounded-xl bg-accent/15 flex items-center justify-center text-accent mx-auto mb-6 animate-[spinSlow_10s_linear_infinite]">
              <i className="fa-solid fa-compass text-xl" />
            </div>

            <h1 className="text-2xl font-extrabold tracking-tight text-foreground mb-3 font-display">
              {isRtl ? "صفحه‌ای که به دنبال آن هستید یافت نشد" : "Page not found"}
            </h1>

            <p className="text-muted-foreground text-sm leading-relaxed mb-8 max-w-sm mx-auto">
              {isRtl
                ? "به نظر می‌رسد صفحه‌ای که به دنبال آن هستید وجود ندارد یا به مکان دیگری منتقل شده است. شاید یکی از لینک‌های زیر کمکتان کند."
                : "The page you're looking for doesn't exist or has been moved to another location. Maybe one of the links below can help."}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href={`/${locale}`}
                className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-accent text-white text-sm font-semibold hover:bg-accent/90 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(37,99,235,0.35)] transition-all duration-300 w-full sm:w-auto justify-center"
              >
                <i className="fa-solid fa-house text-xs" />
                {isRtl ? "بازگشت به خانه" : "Back to Home"}
              </Link>
              <Link
                href={`/${locale}#contact`}
                className="inline-flex items-center gap-2 px-7 py-3 rounded-xl border border-border text-secondary font-semibold text-sm hover:border-accent hover:text-accent hover:bg-accent/5 hover:-translate-y-0.5 transition-all duration-300 w-full sm:w-auto justify-center"
              >
                <i className="fa-solid fa-envelope text-xs" />
                {isRtl ? "تماس با من" : "Contact me"}
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer locale={locale} />
    </div>
  )
}
