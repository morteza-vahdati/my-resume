"use client"

import { useTransition } from "react"
import { i18n, type Locale } from "@/i18config"
import { usePathname, useRouter } from "next/navigation"
import { getCurrentSectionId } from "@/lib/scroll"
import type { IntroPlayDetail } from "@/components/ui/LoadingScreen"

interface LanguageToggleProps {
  locale: Locale
  /**
   * The 404 renders outside the `[locale]` route tree, so `router.replace` there
   * has no matching client route and Next falls back to a full document load.
   * Pass this to take over the switch: the handler swaps locale in client state
   * and rewrites the URL in place, keeping it a React transition.
   */
  onSwitch?: (next: Locale, path: string) => void
}

export default function LanguageToggle({ locale, onSwitch }: LanguageToggleProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [, startTransition] = useTransition()

  const toggle = () => {
    const nextLocale: Locale = locale === "en" ? "fa" : "en"

    // Swap the locale segment in place so deeper paths — the 404 among them —
    // stay on the page they were on instead of bouncing to the home route.
    const segments = pathname.split("/")
    let newPath: string
    if (i18n.locales.includes(segments[1] as Locale)) {
      segments[1] = nextLocale
      newPath = segments.join("/")
    } else {
      newPath = `/${nextLocale}${pathname === "/" ? "" : pathname}`
    }

    // Keep the reader on the section they were reading. An explicit hash wins;
    // otherwise fall back to whatever section is under the viewport edge.
    newPath += window.location.hash || anchorFor(getCurrentSectionId())

    window.dispatchEvent(
      new CustomEvent<IntroPlayDetail>("intro:play", {
        detail: { locale: nextLocale },
      }),
    )

    if (onSwitch) {
      onSwitch(nextLocale, newPath)
      return
    }

    startTransition(() => {
      router.replace(newPath)
    })
  }

  return (
    <button
      onClick={toggle}
      className="h-9 rounded-xl flex items-center gap-1.5 px-3 text-xs font-bold tracking-wider text-secondary border border-border bg-white/55 dark:bg-white/5 backdrop-blur hover:text-primary hover:border-primary transition-all duration-150 cursor-pointer"
      aria-label={locale === "fa" ? "تغییر زبان به انگلیسی" : "Switch language to Persian"}
    >
      <i className="fa-solid fa-globe text-sm" />
      <span>{locale === "en" ? "FA" : "EN"}</span>
    </button>
  )
}

function anchorFor(id: string | null) {
  return id ? `#${id}` : ""
}
