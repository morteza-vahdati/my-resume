"use client"

import { useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import type { ProjectWithLocale } from "@/lib/resume"

interface ProjectModalProps {
  project: ProjectWithLocale | null
  onClose: () => void
}

const projectCovers = [
  "/images/projects/cover-1.jpg",
  "/images/projects/cover-2.jpg",
  "/images/projects/cover-3.jpg",
]

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  const previouslyFocused = useRef<HTMLElement | null>(null)
  const closeBtnRef = useRef<HTMLButtonElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)

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
      document.body.style.overflow = "hidden"
      requestAnimationFrame(() => closeBtnRef.current?.focus())
    }
    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = ""
      previouslyFocused.current?.focus()
    }
  }, [project, handleEscape])

  const dir = project ? document.documentElement.dir : "ltr"

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
            className="absolute inset-0 bg-black/50"
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
            dir={dir}
          >
            <button
              ref={closeBtnRef}
              onClick={onClose}
              className="fixed sm:absolute top-3 right-3 z-10 w-9 h-9 rounded-xl bg-black/40 backdrop-blur border border-white/20 text-white flex items-center justify-center hover:bg-black/60 transition-colors duration-200 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-white/60"
              aria-label="Close"
            >
              <i className="fa-solid fa-times text-sm" />
            </button>

            <div className="relative h-52 sm:h-56 lg:h-64 overflow-hidden bg-muted sm:rounded-t-2xl">
              <Image src={projectCovers[project.id % projectCovers.length]} alt={project.name} fill className="object-cover" sizes="(max-width: 640px) 100vw, 768px" priority />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
              <div className="absolute bottom-4 left-4 sm:bottom-5 sm:left-5 flex flex-wrap gap-2">
                <span className="text-[0.65rem] font-bold px-2.5 py-1 rounded-md bg-white/20 backdrop-blur text-white border border-white/20">{project.year}</span>
                {project.featured && (
                  <span className="text-[0.65rem] font-bold px-2.5 py-1 rounded-md bg-accent/70 backdrop-blur text-white">
                    {dir === "rtl" ? "ویژه" : "Featured"}
                  </span>
                )}
              </div>
            </div>

            <div className="p-5 sm:p-7">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-accent" />
                <span className="text-xs font-medium text-muted-foreground">{project.role}</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black tracking-[-1px] leading-tight text-foreground mb-4 font-display">
                {project.name}
              </h2>

              <div className="flex flex-wrap gap-1.5 mb-5">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[0.65rem] font-bold px-2.5 py-1 rounded-md bg-accent/10 text-accent border border-accent/20 whitespace-nowrap"
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
                    {dir === "rtl" ? "جزئیات فنی" : "Key Details"}
                  </h4>
                  <ul className="space-y-2">
                    {project.details.map((detail, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-secondary">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
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
                      rel="noopener"
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-white font-semibold text-sm shadow-[0_4px_14px_rgba(37,99,235,0.3)] hover:bg-[#1D4ED8] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(37,99,235,0.4)] transition-all duration-300"
                    >
                      <i className="fa-solid fa-arrow-up-right-from-square" />
                      {dir === "rtl" ? "نمایش زنده" : "Live Demo"}
                    </a>
                  )}
                  {project.links.code && (
                    <a
                      href={project.links.code}
                      target="_blank"
                      rel="noopener"
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-transparent text-foreground border-2 border-border font-semibold text-sm hover:border-accent hover:text-accent hover:-translate-y-0.5 transition-all duration-300"
                    >
                      <i className="fa-brands fa-github" />
                      {dir === "rtl" ? "مشاهده کد" : "View Code"}
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
