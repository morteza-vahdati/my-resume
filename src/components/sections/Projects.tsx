"use client"

import { useCallback, useEffect, useState } from "react"
import Image from "next/image"
import ScrollReveal from "@/components/ui/ScrollReveal"
import GlassCard from "@/components/ui/GlassCard"
import SectionHeader from "@/components/ui/SectionHeader"
import ProjectModal from "@/components/ui/ProjectModal"
import { getProjects } from "@/lib/resume"
import type { Locale } from "@/i18config"
import type { ProjectWithLocale } from "@/lib/resume"

interface ProjectsProps {
  locale: Locale
}

export default function Projects({ locale }: ProjectsProps) {
  const [selectedProject, setSelectedProject] = useState<ProjectWithLocale | null>(null)

  const projects = getProjects(locale)

  const closeProject = useCallback(() => {
    if (window.history.state?.projectModalId) {
      window.history.back()
      return
    }
    setSelectedProject(null)
  }, [])

  useEffect(() => {
    const handlePopState = () => setSelectedProject(null)
    window.addEventListener("popstate", handlePopState)
    return () => window.removeEventListener("popstate", handlePopState)
  }, [])

  const openProject = (project: ProjectWithLocale) => {
    window.history.pushState({ ...window.history.state, projectModalId: project.id }, "", window.location.href)
    setSelectedProject(project)
  }

  const label = locale === "fa" ? "آنچه ساخته‌ام" : "Selected work"
  const title = locale === "fa" ? "پروژه‌ها" : "Projects"
  const sub = locale === "fa" ? "چند پروژه که شیوه کارم را نشان می‌دهند" : "A few projects that show how I work"

  return (
    <section id="projects" className="px-4 sm:px-8 py-[clamp(3.5rem,8vw,6rem)] max-w-6xl mx-auto">
      <SectionHeader label={label} title={title} subtitle={sub} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
        {projects.map((project, idx) => (
          <ScrollReveal key={project.id} delay={idx * 0.08}>
            <GlassCard
              className={`h-full cursor-pointer overflow-hidden hover:-translate-y-1.5 hover:shadow-[0_20px_60px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_20px_60px_rgba(0,0,0,0.5)] transition-[transform,box-shadow] duration-300 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30`}
              onClick={() => openProject(project)}
              onKeyDown={(e: React.KeyboardEvent) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openProject(project) } }}
              tabIndex={0}
              role="button"
              aria-label={`${locale === "fa" ? "مشاهده جزئیات پروژه" : "View project details"}: ${project.name}`}
            >
              <div className="relative h-48 sm:h-52 overflow-hidden bg-muted">
                {project.images[0] ? (
                  <Image
                    fill
                    quality={75}
                    alt={project.name}
                    src={project.images[0]}
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <i className="fa-solid fa-image text-5xl opacity-75" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5">
                  {project.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="text-[0.65rem] font-bold px-2 py-0.5 rounded-md bg-black/40 text-white border border-white/15"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-xs text-muted-foreground font-medium">{project.year}</span>
                </div>
                <h3 className="text-base font-bold text-foreground mb-1.5 tracking-tight">
                  {project.name}
                </h3>
                <p className="text-secondary text-xs leading-relaxed line-clamp-3">
                  {project.description}
                </p>
              </div>
            </GlassCard>
          </ScrollReveal>
        ))}
      </div>

      <ProjectModal project={selectedProject} onClose={closeProject} locale={locale} />
    </section>
  )
}
