"use client"

import { useTransition } from "react"
import { type Locale } from "@/i18config"
import { usePathname, useRouter } from "next/navigation"

export default function LanguageToggle({ locale }: { locale: Locale }) {
  const router = useRouter()
  const pathname = usePathname()
  const [, startTransition] = useTransition()

  const toggle = () => {
    const nextLocale: Locale = locale === "en" ? "fa" : "en"
    const segments = pathname.split("/")
    segments[1] = nextLocale
    const newPath = segments.join("/")
    startTransition(() => {
      router.replace(newPath)
    })
  }

  return (
    <button
      onClick={toggle}
      className="h-9 rounded-xl flex items-center gap-1.5 px-3 text-xs font-bold tracking-wider text-secondary border border-border bg-white/55 dark:bg-white/5 backdrop-blur hover:text-accent hover:border-accent transition-all duration-150 cursor-pointer"
      aria-label="Change language"
    >
      <i className="fa-solid fa-globe text-sm" />
      <span>{locale === "en" ? "FA" : "EN"}</span>
    </button>
  )
}
