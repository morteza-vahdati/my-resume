"use client"

import Image from "next/image"
import ScrollReveal from "@/components/ui/ScrollReveal"
import GlassCard from "@/components/ui/GlassCard"
import SectionHeader from "@/components/ui/SectionHeader"
import LinkButton from "@/components/ui/LinkButton"
import { getPersonal } from "@/lib/resume"
import type { Locale } from "@/i18config"

interface AboutProps {
  locale: Locale
}

export default function About({ locale }: AboutProps) {
  const personal = getPersonal(locale)
  const initials = personal.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2)

  const isRtl = locale === "fa"
  const sectionLabel = locale === "fa" ? "چه کسی هستم" : "Who I am"
  const sectionTitle = locale === "fa" ? "درباره من" : "About Me"
  const letsWork = locale === "fa" ? "بیایید با هم کار کنیم" : "Let's work together"

  return (
    <section id="about" className="px-4 sm:px-8 py-[clamp(3.5rem,8vw,6rem)] max-w-6xl mx-auto">
      <SectionHeader label={sectionLabel} title={sectionTitle} />

      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-12 items-start">
        <ScrollReveal direction="left">
          <GlassCard className="p-8 text-center hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_20px_60px_rgba(0,0,0,0.5)] transition-all duration-300">
            <div className="w-[130px] h-[130px] rounded-full mx-auto mb-5 relative overflow-hidden border-[3px] border-white/50 dark:border-white/10 shadow-[0_0_0_6px_rgba(var(--primary-rgb),0.1)]">
              <Image src="/images/profiles/profile.jpg" alt={personal.name} fill className="object-cover" sizes="130px" />
            </div>
            <div className="text-xl font-extrabold tracking-tight text-foreground">
              {personal.name}
            </div>
            <div className="text-primary text-sm font-semibold mt-1 mb-6">
              {personal.role}
            </div>
            <div className="flex justify-center gap-6 pt-6 border-t border-border">
              <div className="text-center">
                <div className="text-[1.8rem] font-black text-primary leading-none">
                  {personal.stats.years.number}
                </div>
                <div className="text-[0.7rem] text-muted-foreground mt-0.5 font-medium">
                  {personal.stats.years.label}
                </div>
              </div>
              <div className="text-center">
                <div className="text-[1.8rem] font-black text-primary leading-none">
                  {personal.stats.projects.number}
                </div>
                <div className="text-[0.7rem] text-muted-foreground mt-0.5 font-medium">
                  {personal.stats.projects.label}
                </div>
              </div>
              <div className="text-center">
                <div className="text-[1.8rem] font-black text-primary leading-none">
                  {personal.stats.clients.number}
                </div>
                <div className="text-[0.7rem] text-muted-foreground mt-0.5 font-medium">
                  {personal.stats.clients.label}
                </div>
              </div>
            </div>
          </GlassCard>
        </ScrollReveal>

        <ScrollReveal direction="right">
          <div className={`text-secondary leading-relaxed mb-4 text-[0.95rem] ${isRtl ? "text-justify" : ""}`}>
            {personal.about.split("\n").map((p: string, i: number) => (
              <p key={i} className="mb-3">{p}</p>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-6">
            {personal.location && (
              <div className="flex items-center gap-2.5 text-sm text-secondary bg-muted/50 rounded-xl px-3.5 py-2.5 border border-border">
                <i className="fa-solid fa-location-dot text-primary w-4" />
                {personal.location}
              </div>
            )}
            <div className="flex items-center gap-2.5 text-sm text-secondary bg-muted/50 rounded-xl px-3.5 py-2.5 border border-border">
              <i className="fa-solid fa-envelope text-primary w-4" />
              {personal.email}
            </div>
            <div className="flex items-center gap-2.5 text-sm text-secondary bg-muted/50 rounded-xl px-3.5 py-2.5 border border-border">
              <i className="fa-solid fa-phone text-primary w-4" />
              {personal.phone}
            </div>
            <div className="flex items-center gap-2.5 text-sm text-secondary bg-muted/50 rounded-xl px-3.5 py-2.5 border border-border">
              <i className="fa-solid fa-briefcase text-primary w-4" />
              {locale === "fa" ? "آماده همکاری" : "Available for hire"}
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <LinkButton href={personal.resumePdf} download variant="primary">
              <i className="fa-solid fa-file-pdf" />
              {locale === "fa" ? "دانلود رزومه" : "Download CV"}
            </LinkButton>
            <LinkButton href="#contact" variant="outline">
              <i className="fa-solid fa-paper-plane" />
              {letsWork}
            </LinkButton>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
