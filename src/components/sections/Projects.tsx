"use client"

import { useState } from "react"
import Image from "next/image"
import ScrollReveal from "@/components/ui/ScrollReveal"
import GlassCard from "@/components/ui/GlassCard"
import ProjectModal from "@/components/ui/ProjectModal"
import { getProjects } from "@/lib/resume"
import type { Locale } from "@/i18config"
import type { ProjectWithLocale } from "@/lib/resume"

interface ProjectsProps {
  locale: Locale
}

const projectCovers = [
  "/images/projects/cover-1.jpg",
  "/images/projects/cover-2.jpg",
  "/images/projects/cover-3.jpg",
]

export default function Projects({ locale }: ProjectsProps) {
  const [selectedProject, setSelectedProject] = useState<ProjectWithLocale | null>(null)

  const projects = getProjects(locale)

  const label = locale === "fa" ? "چی ساختم" : "What I've built"
  const title = locale === "fa" ? "پروژه‌ها" : "Projects"
  const sub = locale === "fa" ? "نمونه‌ای از کارهای اخیر" : "A selection of recent work"

  return (
    <section id="projects" className="px-4 sm:px-8 py-[clamp(3.5rem,8vw,6rem)] max-w-6xl mx-auto">
      <ScrollReveal>
        <span className="text-[0.72rem] font-bold tracking-[2px] uppercase text-accent mb-2 block">
          {label}
        </span>
        <h2 className="text-[clamp(1.5rem,3.5vw,2.5rem)] font-black tracking-[-1.5px] leading-tight text-foreground mb-3 font-display">
          {title}
        </h2>
        <div className="w-10 h-[3px] bg-accent rounded-full mb-4" />
        <p className="text-muted-foreground mb-14">{sub}</p>
      </ScrollReveal>

      <div className="columns-1 md:columns-2 lg:columns-3 gap-6">
        {projects.map((project, idx) => {
          const cover = projectCovers[idx % projectCovers.length]

          return (
            <ScrollReveal key={project.id} delay={idx * 0.08}>
              <GlassCard
                className={`break-inside-avoid mb-6 cursor-pointer overflow-hidden hover:-translate-y-1.5 hover:shadow-[0_20px_60px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_20px_60px_rgba(0,0,0,0.5)] transition-[transform,box-shadow] duration-300 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30`}
                onClick={() => setSelectedProject(project)}
                onKeyDown={(e: React.KeyboardEvent) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setSelectedProject(project) } }}
                tabIndex={0}
                role="button"
                aria-label={`${locale === "fa" ? "مشاهده جزئیات" : "View details"} ${project.name}`}
              >
                <div className={`relative h-44 ${project.featured ? "sm:h-52" : "sm:h-44"} overflow-hidden bg-muted`}>
                  <Image src={cover} alt={project.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5">
                    {project.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-[0.65rem] font-bold px-2 py-0.5 rounded-md bg-white/20 backdrop-blur text-white border border-white/20"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-2 h-2 rounded-full bg-accent" />
                    <span className="text-xs text-muted-foreground font-medium">{project.year}</span>
                  </div>
                  <h3 className="text-base font-bold text-foreground mb-1.5 tracking-tight">
                    {project.name}
                  </h3>
                  <p className="text-secondary text-xs leading-relaxed mb-4 line-clamp-3">
                    {project.description}
                  </p>
                </div>
              </GlassCard>
            </ScrollReveal>
          )
        })}
      </div>

      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
    </section>
  )
}
