"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import type { Locale } from "@/i18config"

export default function ThemeToggle({ locale }: { locale: Locale }) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const label = locale === "fa" ? "تغییر پوسته روشن و تیره" : "Switch between light and dark theme"

  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return (
      <button
        className="w-9 h-9 rounded-xl flex items-center justify-center text-secondary border border-border bg-white/55 dark:bg-white/5 backdrop-blur hover:text-primary hover:border-primary transition-all duration-150 cursor-pointer"
        aria-label={label}
      >
        <div className="w-4 h-4" />
      </button>
    )
  }

  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="w-9 h-9 rounded-xl flex items-center justify-center text-secondary border border-border bg-white/55 dark:bg-white/5 backdrop-blur hover:text-primary hover:border-primary transition-all duration-150 cursor-pointer"
      aria-label={label}
      title={label}
    >
      <i className={`fa-solid ${isDark ? "fa-sun" : "fa-moon"}`} />
    </button>
  )
}
