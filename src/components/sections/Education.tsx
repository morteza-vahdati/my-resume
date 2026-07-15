"use client"

import ScrollReveal from "@/components/ui/ScrollReveal"
import GlassCard from "@/components/ui/GlassCard"
import { getEducation, getCourses } from "@/lib/resume"
import type { Locale } from "@/i18config"

interface EducationProps {
  locale: Locale
}

export default function Education({ locale }: EducationProps) {
  const education = getEducation(locale)
  const courses = getCourses(locale)

  const label = locale === "fa" ? "کجا درس خوندم" : "Where I studied"
  const title = locale === "fa" ? "تحصیلات" : "Education"
  const coursesLabel = locale === "fa" ? "دوره‌های آموزشی" : "Courses"

  return (
    <section id="education" className="px-4 sm:px-8 py-[clamp(3.5rem,8vw,6rem)] max-w-6xl mx-auto">
      <ScrollReveal>
        <span className="text-[0.72rem] font-bold tracking-[2px] uppercase text-accent mb-2 block">
          {label}
        </span>
        <h2 className="text-[clamp(1.5rem,3.5vw,2.5rem)] font-black tracking-[-1.5px] leading-tight text-foreground mb-3 font-display">
          {title}
        </h2>
        <div className="w-10 h-[3px] bg-accent rounded-full mb-4" />
      </ScrollReveal>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {education.map((edu, idx) => (
          <ScrollReveal key={edu.id} delay={idx * 0.1}>
            <GlassCard className="p-5 flex items-start gap-4 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_20px_60px_rgba(0,0,0,0.5)] transition-all duration-300">
              <div className="w-11 h-11 rounded-xl bg-accent flex items-center justify-center text-white text-lg flex-shrink-0">
                <i className="fa-solid fa-graduation-cap" />
              </div>
              <div>
                <div className="text-sm font-bold text-foreground mb-1">{edu.degree}</div>
                <div className="text-accent text-xs font-semibold mb-1">{edu.school}</div>
                <div className="text-muted-foreground text-xs">
                  {edu.period} · {edu.status}
                </div>
              </div>
            </GlassCard>
          </ScrollReveal>
        ))}

        {courses.map((course, idx) => (
          <ScrollReveal key={`course-${course.id}`} delay={0.2 + idx * 0.1}>
            <GlassCard className="p-5 flex items-start gap-4 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.12)] transition-all duration-300">
              <div className="w-11 h-11 rounded-xl bg-accent/10 flex items-center justify-center text-accent text-lg flex-shrink-0 border border-accent/20">
                <i className="fa-solid fa-certificate" />
              </div>
              <div>
                <div className="text-sm font-bold text-foreground mb-1">{course.title}</div>
                <div className="text-accent text-xs font-semibold mb-1">{course.institution}</div>
                <div className="text-muted-foreground text-xs">{course.duration} · {course.year}</div>
              </div>
            </GlassCard>
          </ScrollReveal>
        ))}
      </div>
    </section>
  )
}
