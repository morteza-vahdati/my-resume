"use client"

import { useTheme } from "next-themes"
import { useEffect } from "react"

const THEME_COLORS = {
  light: "#2563EB",
  dark: "#0A0A0B",
} as const

export default function ThemeColorSync() {
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    if (resolvedTheme !== "light" && resolvedTheme !== "dark") return

    let themeColor = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')
    if (!themeColor) {
      themeColor = document.createElement("meta")
      themeColor.name = "theme-color"
      document.head.appendChild(themeColor)
    }
    themeColor.content = THEME_COLORS[resolvedTheme]
  }, [resolvedTheme])

  return null
}
