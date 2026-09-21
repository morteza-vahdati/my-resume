"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { Locale } from "@/i18config"

const MIN_VISIBLE = 2000
const FADE_OUT = 500

export interface IntroPlayDetail {
  locale?: Locale
}

interface LoadingScreenProps {
  locale: Locale
}

export default function LoadingScreen({ locale }: LoadingScreenProps) {
  const [show, setShow] = useState(false)
  const [textLocale, setTextLocale] = useState<Locale>(locale)

  const text =
    textLocale === "fa"
      ? "یک لحظه؛ دارم صفحه را آماده می‌کنم"
      : "One moment — getting things ready"

  useEffect(() => {
    let hideTimer: ReturnType<typeof setTimeout> | undefined
    let doneTimer: ReturnType<typeof setTimeout> | undefined

    const play = (e?: Event) => {
      const next = (e as CustomEvent<IntroPlayDetail>)?.detail?.locale
      if (next) setTextLocale(next)
      setShow(true)
      clearTimeout(hideTimer)
      clearTimeout(doneTimer)
      hideTimer = setTimeout(() => setShow(false), MIN_VISIBLE)
      doneTimer = setTimeout(
        () => window.dispatchEvent(new Event("intro:done")),
        MIN_VISIBLE + FADE_OUT,
      )
    }

    let shouldPlay = false
    try {
      shouldPlay = sessionStorage.getItem("intro-shown") !== "1"
      if (shouldPlay) sessionStorage.setItem("intro-shown", "1")
    } catch {
      // Private modes can throw on sessionStorage; just skip the intro.
    }

    if (shouldPlay) {
      play()
    } else {
      // The inline script may have covered the page on a guess this effect can
      // now correct. Leaving the cover up would strand the reader.
      document.documentElement.classList.remove("intro-pending")
    }

    window.addEventListener("intro:play", play)
    return () => {
      clearTimeout(hideTimer)
      clearTimeout(doneTimer)
      window.removeEventListener("intro:play", play)
      document.documentElement.classList.remove("intro-pending")
    }
  }, [])

  // Without this the reader can scroll the page behind the overlay and land
  // somewhere random once it lifts.
  useEffect(() => {
    if (!show) return
    const html = document.documentElement
    const body = document.body
    const prevHtml = html.style.overflow
    const prevBody = body.style.overflow
    html.style.overflow = "hidden"
    body.style.overflow = "hidden"
    // This runs after the animated overlay is in the DOM, so handing off from
    // the boot cover here cannot expose the page for a frame.
    html.classList.remove("intro-pending")
    return () => {
      html.style.overflow = prevHtml
      body.style.overflow = prevBody
    }
  }, [show])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          id="intro-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: FADE_OUT / 1000, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-background"
          role="status"
          aria-live="polite"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center gap-8"
          >
            <div className="relative">
              <motion.div
                className="size-10 rounded-[10px] bg-primary/80 shadow-md"
                animate={{ rotate: 360, borderRadius: ["20px", "50%", "10px"] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
            <div className="flex items-center justify-center gap-2">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-[0.75rem] text-muted-foreground/75 font-medium tracking-widest uppercase"
              >
                {text}
              </motion.p>
              <div className="flex gap-1.5 mt-0.5">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="size-1 rounded-full bg-primary/75"
                    animate={{ opacity: [0.2, 1, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
