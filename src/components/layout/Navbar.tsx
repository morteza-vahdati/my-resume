"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import ThemeToggle from "@/components/ui/ThemeToggle"
import LanguageToggle from "@/components/ui/LanguageToggle"
import { getPersonal } from "@/lib/resume"
import type { Locale } from "@/i18config"

interface NavbarProps {
  locale: Locale
}

const navItems = (locale: Locale) => [
  { key: "about", label: locale === "fa" ? "درباره من" : "About" },
  { key: "skills", label: locale === "fa" ? "مهارت‌ها" : "Skills" },
  { key: "experience", label: locale === "fa" ? "تجربه" : "Experience" },
  { key: "projects", label: locale === "fa" ? "پروژه‌ها" : "Projects" },
  { key: "contact", label: locale === "fa" ? "تماس" : "Contact" },
]

export default function Navbar({ locale }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const personal = getPersonal(locale)
  const initials = personal.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2)

  const scrollTo = (id: string) => {
    setMenuOpen(false)
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <>
      <nav className="fixed top-0 inset-x-0 z-50 h-[64px] px-4 sm:px-8 flex items-center justify-between md:grid md:grid-cols-3 bg-white/60 dark:bg-white/5 backdrop-blur-xl border-b border-white/75 dark:border-white/10 transition-colors duration-400">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center gap-2.5 text-base sm:text-lg font-extrabold tracking-tight text-foreground cursor-pointer"
        >
          <span className="w-8 h-8 rounded-xl bg-accent flex items-center justify-center text-white text-xs font-bold shadow-[0_2px_8px_rgba(37,99,235,0.3)]">
            {initials}
          </span>
          <span>{personal.name}</span>
        </button>

        <ul className="hidden md:flex gap-1 list-none md:justify-self-center">
          {navItems(locale).map((item) => (
            <li key={item.key}>
                <button
                  onClick={() => scrollTo(item.key)}
                  className="text-sm md:text-xs lg:text-sm font-semibold px-2 md:px-2 lg:px-4 py-2 rounded-full text-secondary hover:text-accent hover:bg-muted transition-all duration-200 cursor-pointer whitespace-nowrap"
                >
                  {item.label}
                </button>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2 md:justify-self-end">
          <ThemeToggle />
          <LanguageToggle locale={locale} />
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden flex flex-col gap-1 p-1.5 cursor-pointer"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <motion.span
              animate={menuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
              className="block w-5 h-[2px] bg-secondary rounded"
            />
            <motion.span
              animate={menuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
              className="block w-5 h-[2px] bg-secondary rounded"
            />
            <motion.span
              animate={menuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
              className="block w-5 h-[2px] bg-secondary rounded"
            />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
            className="fixed top-[64px] inset-x-0 z-40 flex flex-col px-4 sm:px-8 py-4 bg-white/60 dark:bg-white/5 backdrop-blur-xl border-b border-white/75 dark:border-white/10"
          >
            {navItems(locale).map((item) => (
              <button
                key={item.key}
                onClick={() => scrollTo(item.key)}
                className={`py-3.5 text-secondary font-semibold ${locale === "fa" ? "text-right" : "text-left"} border-b border-border last:border-none hover:text-accent transition-colors duration-150 cursor-pointer`}
              >
                {item.label}
              </button>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  )
}
