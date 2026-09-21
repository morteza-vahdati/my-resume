"use client"

import Image from "next/image"
import { useEffect, useRef, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { usePathname, useRouter } from "next/navigation"
import ThemeToggle from "@/components/ui/ThemeToggle"
import LanguageToggle from "@/components/ui/LanguageToggle"
import { getPersonal } from "@/lib/resume"
import { smoothScrollToElement, smoothScrollToTop } from "@/lib/scroll"
import type { Locale } from "@/i18config"

interface NavbarProps {
  locale: Locale
  onLocaleSwitch?: (next: Locale, path: string) => void
}

const navItems = (locale: Locale) => [
  { key: "about", label: locale === "fa" ? "درباره من" : "About" },
  { key: "skills", label: locale === "fa" ? "مهارت‌ها" : "Skills" },
  { key: "experience", label: locale === "fa" ? "تجربه کاری" : "Experience" },
  { key: "projects", label: locale === "fa" ? "پروژه‌ها" : "Projects" },
  { key: "contact", label: locale === "fa" ? "ارتباط" : "Contact" },
]

export default function Navbar({ locale, onLocaleSwitch }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const router = useRouter()
  const pathname = usePathname()

  const prevHashRef = useRef<string>("");
  const mobileMenuRef = useRef<HTMLElement>(null)
  const menuToggleRef = useRef<HTMLButtonElement>(null)

  const personal = getPersonal(locale)

  const homePath = `/${locale}`
  const isHome = pathname === homePath || pathname === "/"

  useEffect(() => {
    if (!menuOpen) return

    const closeOnOutsidePointer = (event: PointerEvent) => {
      const target = event.target
      if (!(target instanceof Node)) return
      if (mobileMenuRef.current?.contains(target) || menuToggleRef.current?.contains(target)) return
      setMenuOpen(false)
    }

    document.addEventListener("pointerdown", closeOnOutsidePointer)
    return () => document.removeEventListener("pointerdown", closeOnOutsidePointer)
  }, [menuOpen])

  const syncFromHash = useCallback(
    (hash?: string) => {
      const currentHash = hash ?? window.location.hash.replace("#", "");
      const isValid = currentHash && navItems(locale).some((item) => item.key === currentHash);

      if (isValid) {
        setActiveKey(currentHash);
        if (isHome) {
          const el = document.getElementById(currentHash);
          if (el) smoothScrollToElement(el);
        }
      } else {
        setActiveKey(null);
      }
      prevHashRef.current = currentHash;
    },
    [locale, isHome]
  );


  useEffect(() => {
    syncFromHash();

    const handleHashChange = () => syncFromHash();
    const handlePopState = () => syncFromHash();

    window.addEventListener("hashchange", handleHashChange);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [syncFromHash]);


  useEffect(() => {
    const currentHash = window.location.hash.replace("#", "");
    if (currentHash !== prevHashRef.current) {
      syncFromHash(currentHash);
    }
  });

  const goHome = () => {
    setMenuOpen(false);
    if (isHome) {
      history.replaceState(null, "", homePath);
      smoothScrollToTop();
      syncFromHash("");
    } else {
      router.push(homePath);
    }
  };

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    setActiveKey(id);

    if (isHome) {
      const el = document.getElementById(id);
      if (el) smoothScrollToElement(el);
      history.replaceState(null, "", `${homePath}#${id}`);
      prevHashRef.current = id;
    } else {
      router.push(`${homePath}#${id}`, { scroll: false });
    }
  };

  return (
    <>
      <nav className="fixed top-0 inset-x-0 z-50 h-[64px] px-4 sm:px-8 flex items-center justify-between md:grid md:grid-cols-3 bg-white/60 dark:bg-white/5 backdrop-blur-xl border-b border-white/75 dark:border-white/10 transition-colors duration-400">
        <button
          onClick={goHome}
          className="flex items-center gap-2.5 text-base sm:text-lg font-extrabold tracking-tight text-foreground cursor-pointer"
        >
          <span className="size-8 rounded-xl flex items-center justify-center shadow-[0_2px_8px_rgba(var(--primary-rgb),0.2)]">
            <Image alt={locale === "fa" ? "لوگوی مرتضی وحدتی" : "Morteza Vahdati logo"} width={32} height={32} src="/logo.png" />
          </span>
          <span>{personal.name}</span>
        </button>

        <ul className="hidden md:flex gap-1 list-none md:justify-self-center">
          {navItems(locale).map((item) => (
            <li key={item.key}>
              <button
                onClick={() => scrollTo(item.key)}
                className={`
                  text-sm md:text-xs lg:text-sm font-semibold px-2 md:px-2 lg:px-4 py-2 rounded-full 
                  transition-all duration-200 cursor-pointer whitespace-nowrap
                  ${activeKey === item.key
                    ? "text-primary bg-primary/10 shadow-sm"
                    : "text-secondary hover:text-primary hover:bg-muted"
                  }
                `}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2 md:justify-self-end">
          <ThemeToggle locale={locale} />
          <LanguageToggle locale={locale} onSwitch={onLocaleSwitch} />
          <button
            ref={menuToggleRef}
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden flex flex-col gap-1 p-1.5 cursor-pointer"
            aria-label={locale === "fa" ? "باز و بسته کردن منو" : "Open or close menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
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
      </nav >

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            ref={mobileMenuRef}
            id="mobile-menu"
            data-testid="mobile-menu"
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
                className={`
                  py-3.5 font-semibold border-b border-border last:border-none 
                  transition-colors duration-150 cursor-pointer
                  ${locale === "fa" ? "text-right" : "text-left"}
                  ${activeKey === item.key
                    ? "text-primary"
                    : "text-secondary hover:text-primary"
                  }
                `}
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
