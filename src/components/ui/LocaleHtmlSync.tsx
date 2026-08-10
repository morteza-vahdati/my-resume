"use client"

import { useEffect } from "react"
import { useParams } from "next/navigation"
import { i18n, type Locale } from "@/i18config"

/**
 * The root layout is not under `[locale]`, so it never re-renders on a
 * client-side locale switch — `lang`/`dir` would keep the values from the
 * initial server render. Sync them from the active route segment instead.
 */
export default function LocaleHtmlSync() {
  const params = useParams()
  const raw = params?.locale

  useEffect(() => {
    const locale = (Array.isArray(raw) ? raw[0] : raw) as Locale | undefined
    if (!locale || !i18n.locales.includes(locale)) return
    document.documentElement.lang = locale
    document.documentElement.dir = locale === "fa" ? "rtl" : "ltr"
  }, [raw])

  return null
}
