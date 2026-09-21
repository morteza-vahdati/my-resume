"use client"

import { getPersonal } from "@/lib/resume"
import type { Locale } from "@/i18config"

interface FooterProps {
  locale: Locale
}

export default function Footer({ locale }: FooterProps) {
  const personal = getPersonal(locale)

  return (
    <footer className="text-center py-8 text-muted-foreground text-xs border-t border-border relative z-10">
      <p>
        {locale === "fa" ? "ساخته‌شده با" : "Designed and built with"}{" "}
        <span className="text-primary font-semibold">♥</span>{" "}
        {locale === "fa" ? "توسط" : "by"}{" "}
        <span className="text-primary font-semibold">{personal.name}</span>
      </p>
    </footer>
  )
}
