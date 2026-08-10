"use client"

import Image from "next/image"
import type { Locale } from "@/i18config"
import type { ProjectWithLocale } from "@/lib/resume"
import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useRef, useState, useCallback } from "react"

interface ProjectModalProps {
  project: ProjectWithLocale | null
  onClose: () => void
  locale: Locale
}

const SLIDESHOW_INTERVAL = 6000

function supportsStableGutter(): boolean {
  return typeof CSS !== "undefined" && CSS.supports("scrollbar-gutter", "stable")
}

function lockScroll(): void {
  if (!supportsStableGutter()) {
    const se = document.scrollingElement as HTMLElement | null
    if (se) se.style.paddingInlineEnd = `${window.innerWidth - se.clientWidth}px`
  }
  document.documentElement.style.overflow = "hidden"
  document.body.style.overflow = "hidden"
  document.body.style.overscrollBehavior = "none"
}

function unlockScroll(): void {
  document.documentElement.style.overflow = ""
  document.body.style.overflow = ""
  document.body.style.overscrollBehavior = ""
  if (!supportsStableGutter()) {
    const se = document.scrollingElement as HTMLElement | null
    if (se) se.style.paddingInlineEnd = ""
  }
}

export default function ProjectModal({ project, onClose, locale }: ProjectModalProps) {
  const isRtl = locale === "fa"
  const images = project?.images ?? []
  const [activeImage, setActiveImage] = useState(0)
  const [paused, setPaused] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const activeIdx = Math.min(activeImage, Math.max(images.length - 1, 0))
  const previouslyFocused = useRef<HTMLElement | null>(null)
  const closeBtnRef = useRef<HTMLButtonElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setActiveImage(0)
    setPaused(false)
  }, [project?.id])

  useEffect(() => {
    setPrefersReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches)
  }, [])

  useEffect(() => {
    if (images.length < 2 || paused || prefersReducedMotion) return
    const timer = setTimeout(() => {
      setActiveImage((prev) => (prev + 1) % images.length)
    }, SLIDESHOW_INTERVAL)
    return () => clearTimeout(timer)
  }, [activeIdx, paused, prefersReducedMotion, images.length])

  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    },
    [onClose],
  )

  const focusTrap = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Tab") {
        const modal = modalRef.current
        if (!modal) return
        const focusable = modal.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        )
        if (focusable.length === 0) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    },
    [],
  )

  useEffect(() => {
    if (project) {
      previouslyFocused.current = document.activeElement as HTMLElement
      document.addEventListener("keydown", handleEscape)
      lockScroll()
      requestAnimationFrame(() => closeBtnRef.current?.focus())
    }
    return () => {
      document.removeEventListener("keydown", handleEscape)
      unlockScroll()
      previouslyFocused.current?.focus()
    }
  }, [project, handleEscape])

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          ref={modalRef}
          className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onKeyDown={focusTrap}
        >
          <motion.div
            className="absolute inset-0 bg-black/50 touch-none"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            className="relative w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-2xl lg:max-w-3xl rounded-none sm:rounded-2xl border border-white/75 dark:border-white/10 bg-white dark:bg-[#141414] shadow-[0_20px_60px_rgba(0,0,0,0.24)] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
            dir={isRtl ? "rtl" : "ltr"}
          >
            <button
              ref={closeBtnRef}
              onClick={onClose}
              className="fixed sm:absolute top-3 right-3 z-10 w-9 h-9 rounded-xl bg-black/40 backdrop-blur border border-white/20 text-white flex items-center justify-center hover:bg-black/60 transition-colors duration-200 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-white/60"
              aria-label={isRtl ? "بستن" : "Close"}
            >
              <i className="fa-solid fa-times text-sm" />
            </button>

            {images.length > 0 && (
              <div dir="rtl" className="flex flex-col sm:flex-row gap-3 sm:gap-4">

                <div className="flex-1 flex flex-col">
                  <div
                    className="relative h-56 sm:h-60 lg:h-72 overflow-hidden bg-muted sm:rounded-t-2xl"
                    onMouseEnter={() => setPaused(true)}
                    onMouseLeave={() => setPaused(false)}
                    onPointerDown={() => setPaused(true)}
                    onPointerUp={() => setPaused(false)}
                    onPointerCancel={() => setPaused(false)}
                    onPointerLeave={() => setPaused(false)}
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.div
                        key={activeIdx}
                        initial={{ opacity: 0, scale: 1.02 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className="absolute inset-0"
                      >
                        <Image
                          fill
                          priority
                          quality={75}
                          alt={project.name}
                          src={images[activeIdx]}
                          className="object-cover object-top"
                          sizes="(max-width: 640px) 100vw, 768px"
                        />
                      </motion.div>
                    </AnimatePresence>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent pointer-events-none" />
                    <div className="absolute bottom-4 left-4 sm:bottom-5 sm:left-5 flex flex-wrap gap-2">
                      <span className="text-[0.65rem] font-bold px-2.5 py-1 rounded-md bg-white/20 backdrop-blur text-white border border-white/20">{project.year}</span>
                      {project.featured && (
                        <span className="text-[0.65rem] font-bold px-2.5 py-1 rounded-md bg-primary/70 backdrop-blur text-white">
                          {isRtl ? "ویژه" : "Featured"}
                        </span>
                      )}
                    </div>
                  </div>
                  {images.length > 1 && !prefersReducedMotion && (
                    <div className="h-0.5 bg-primary/15 overflow-hidden" aria-hidden="true">
                      <div
                        key={activeIdx}
                        className="h-full bg-primary"
                        style={{
                          animation: `projectProgress ${SLIDESHOW_INTERVAL}ms linear forwards`,
                          animationPlayState: paused ? "paused" : "running",
                          transformOrigin: "right",
                        }}
                      />
                    </div>
                  )}
                </div>
                {images.length > 1 && (
                  <div className="flex sm:flex-col gap-2.5 p-3 sm:p-4 sm:pr-0 sm:pb-3 sm:h-60 lg:h-72 overflow-x-auto sm:overflow-x-visible sm:overflow-y-auto">
                    {images.map((src, i) => (
                      <button
                        key={src}
                        type="button"
                        onClick={() => setActiveImage(i)}
                        className={`relative w-20 h-12 sm:w-24 sm:h-16 shrink-0 rounded-lg overflow-hidden border-2 transition-all duration-200 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${i === activeIdx ? "border-primary opacity-100" : "border-transparent opacity-60 hover:opacity-100"}`}
                        aria-label={`${isRtl ? "تصویر" : "Image"} ${i + 1}`}
                        aria-current={i === activeIdx ? "true" : undefined}
                      >
                        <Image src={src} alt="" fill className="object-cover" sizes="96px" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="p-5 sm:p-7">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-xs font-medium text-muted-foreground">{project.role}</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black tracking-[-1px] leading-tight text-foreground mb-4 font-display">
                {project.name}
              </h2>

              <div className="flex flex-wrap gap-1.5 mb-5">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[0.65rem] font-bold px-2.5 py-1 rounded-md bg-primary/10 text-primary border border-primary/20 whitespace-nowrap"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <p className="text-sm sm:text-base text-secondary leading-relaxed mb-5">
                {project.description}
              </p>

              {project.details && project.details.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-xs font-bold tracking-[1px] uppercase text-muted-foreground mb-3">
                    {isRtl ? "جزئیات فنی" : "Key Details"}
                  </h4>
                  <ul className="space-y-2">
                    {project.details.map((detail, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-secondary">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {(project.links.live || project.links.code) && (
                <div className="flex flex-wrap gap-3 pt-5 border-t border-border flex-row-reverse justify-start">
                  {project.links.live && (
                    <a
                      href={project.links.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-semibold text-sm shadow-[0_4px_14px_rgba(var(--primary-rgb),0.3)] hover:bg-primary-hover hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(var(--primary-rgb),0.4)] transition-all duration-300"
                    >
                      <i className="fa-solid fa-arrow-up-right-from-square" />
                      {isRtl ? "نمایش زنده" : "Live Demo"}
                    </a>
                  )}
                  {project.links.code && (
                    <a
                      href={project.links.code}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-transparent text-foreground border-2 border-border font-semibold text-sm hover:border-primary hover:text-primary hover:-translate-y-0.5 transition-all duration-300"
                    >
                      <i className="fa-brands fa-github" />
                      {isRtl ? "مشاهده کد" : "View Code"}
                    </a>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
