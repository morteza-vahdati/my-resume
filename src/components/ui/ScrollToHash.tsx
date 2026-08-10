"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { instantScrollToTop, jumpToElement, smoothScrollToElement } from "@/lib/scroll"

export default function ScrollToHash() {
  const pathname = usePathname()

  useEffect(() => {
    const hash = window.location.hash
    if (!hash) return

    let id: string
    try {
      id = decodeURIComponent(hash.slice(1))
    } catch {
      id = hash.slice(1)
    }
    if (!id) return

    let cancelled = false
    const timers: ReturnType<typeof setTimeout>[] = []

    const introVisible = () => document.getElementById("intro-screen") !== null

    // While the intro overlay covers the page, position without animating —
    // animating under a cover only risks the reveal catching it mid-flight.
    const settle = (animate: boolean) => {
      if (cancelled) return
      const el = document.getElementById(id)
      if (!el) return
      if (animate) {
        instantScrollToTop()
        requestAnimationFrame(() => {
          if (!cancelled) smoothScrollToElement(el)
        })
      } else {
        jumpToElement(el)
      }
    }

    if (introVisible()) {
      settle(false)
      const onDone = () => {
        window.removeEventListener("intro:done", onDone)
        // Re-anchor: fonts and images that landed while covered shift the layout.
        settle(false)
      }
      window.addEventListener("intro:done", onDone)
      return () => {
        cancelled = true
        timers.forEach(clearTimeout)
        window.removeEventListener("intro:done", onDone)
      }
    }

    timers.push(setTimeout(() => settle(true), 60))
    return () => {
      cancelled = true
      timers.forEach(clearTimeout)
    }
  }, [pathname])

  return null
}
