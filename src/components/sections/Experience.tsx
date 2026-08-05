"use client"

import ScrollReveal from "@/components/ui/ScrollReveal"
import GlassCard from "@/components/ui/GlassCard"
import Badge from "@/components/ui/Badge"
import SectionHeader from "@/components/ui/SectionHeader"
import { getExperience } from "@/lib/resume"
import type { Locale } from "@/i18config"

interface ExperienceProps {
  locale: Locale
}

export default function Experience({ locale }: ExperienceProps) {
  const experience = getExperience(locale)

  const label = locale === "fa" ? "کجا کار کردم" : "Where I've worked"
  const title = locale === "fa" ? "تجربه کاری" : "Experience"

  const isRtl = locale === "fa"

  return (
    <section id="experience" className="px-4 sm:px-8 py-[clamp(3.5rem,8vw,6rem)] max-w-6xl mx-auto">
      <SectionHeader label={label} title={title} />

      <div className={`relative ${isRtl ? "pl-8" : "pr-8"} rtl:pl-8 rtl:pr-0 flex flex-col gap-8`}>
        <div className={`absolute ${isRtl ? "left-0" : "right-0"} rtl:right-auto rtl:left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-accent rounded-full via-accent/60 to-transparent shadow-[0_0_8px_rgba(37,99,235,0.3)]`} />

        {experience.map((exp, idx) => (
          <ScrollReveal key={exp.id} delay={idx * 0.1}>
            <div className="relative">
              <div className={`absolute ${isRtl ? "left-0" : "right-0"} rtl:right-auto rtl:left-0 top-[1.1rem] translate-x-1/2 rtl:-translate-x-1/2 w-4 h-4 rounded-full bg-accent border-[3px] border-background shadow-[0_0_0_4px_rgba(37,99,235,0.2),0_0_12px_rgba(37,99,235,0.4)] z-10`} />
              <GlassCard className={`p-5 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_20px_60px_rgba(0,0,0,0.5)] transition-all duration-300 ${isRtl ? "mr-6" : "ml-6"} rtl:mr-6 rtl:ml-0`}>
                <div className="flex justify-between items-start flex-wrap gap-2 mb-1">
                  <h3 className="text-base font-bold text-foreground">{exp.title}</h3>
                  <Badge variant="accent">{exp.period}</Badge>
                </div>
                <div className="text-accent text-sm font-semibold mb-3">
                  <i className="fa-solid fa-building mr-1.5 rtl:ml-1.5 rtl:mr-0" />
                  {exp.company} · {exp.type}
                </div>
                <ul className="text-secondary text-sm leading-relaxed space-y-2">
                  {exp.descriptions.map((desc, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-sm bg-accent flex-shrink-0 rotate-45" />
                      {desc}
                    </li>
                  ))}
                </ul>
              </GlassCard>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  )
}
