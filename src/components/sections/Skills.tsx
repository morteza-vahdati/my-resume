"use client"

import ScrollReveal from "@/components/ui/ScrollReveal"
import SkillBar from "@/components/ui/SkillBar"
import GlassCard from "@/components/ui/GlassCard"
import Badge from "@/components/ui/Badge"
import SectionHeader from "@/components/ui/SectionHeader"
import { getSkills } from "@/lib/resume"
import type { Locale } from "@/i18config"

interface SkillsProps {
  locale: Locale
}

export default function Skills({ locale }: SkillsProps) {
  const skills = getSkills(locale)

  const label = locale === "fa" ? "چه بلدم" : "What I know"
  const title = locale === "fa" ? "مهارت‌ها" : "Skills"
  const sub = locale === "fa" ? "تکنولوژی‌هایی که روزانه باهاشون کار می‌کنم" : "Technologies I work with daily"
  const otherLabel = locale === "fa" ? "سایر تکنولوژی‌ها" : "Other Technologies"

  return (
    <section id="skills" className="px-4 sm:px-8 py-[clamp(3.5rem,8vw,6rem)] max-w-6xl mx-auto">
      <SectionHeader label={label} title={title} subtitle={sub} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {skills.categories.map((cat, idx) => (
          <ScrollReveal key={idx} delay={idx * 0.1}>
            <GlassCard className="p-7">
              <h3 className="text-sm font-bold uppercase tracking-[1px] text-muted-foreground mb-6">
                {cat.name}
              </h3>
              {cat.items.map((skill, i) => (
                <SkillBar
                  key={skill.name}
                  name={skill.name}
                  percentage={skill.percentage}
                  level={skill.level}
                  delay={i * 0.08}
                />
              ))}
            </GlassCard>
          </ScrollReveal>
        ))}
      </div>

      <ScrollReveal>
        <div className="mt-8">
          <p className="text-[0.78rem] font-bold uppercase tracking-[1.5px] text-muted-foreground mb-4">
            {otherLabel}
          </p>
          <div className="flex flex-wrap gap-2">
            {skills.other.map((tech) => (
              <Badge key={tech} variant="outline">
                {tech}
              </Badge>
            ))}
          </div>
        </div>
      </ScrollReveal>
    </section>
  )
}
