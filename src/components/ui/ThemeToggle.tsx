"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return (
      <button
        className="w-9 h-9 rounded-xl flex items-center justify-center text-secondary border border-border bg-white/55 dark:bg-white/5 backdrop-blur hover:text-accent hover:border-accent transition-all duration-150 cursor-pointer"
        aria-label="Toggle dark/light mode"
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
      className="w-9 h-9 rounded-xl flex items-center justify-center text-secondary border border-border bg-white/55 dark:bg-white/5 backdrop-blur hover:text-accent hover:border-accent transition-all duration-150 cursor-pointer"
      aria-label="Toggle dark/light mode"
      title="Toggle theme"
    >
      <i className={`fa-solid ${isDark ? "fa-sun" : "fa-moon"}`} />
    </button>
  )
}
