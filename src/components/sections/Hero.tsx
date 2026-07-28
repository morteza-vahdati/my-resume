"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import type { Locale } from "@/i18config"
import { getPersonal } from "@/lib/resume"
import Typewriter from "@/components/ui/Typewriter"
import LinkButton from "@/components/ui/LinkButton"
import Link from "next/link"

interface HeroProps {
  locale: Locale
}

const blobShapes = [
  {
    width: 280,
    height: 280,
    gradient: "from-purple-500/20 to-blue-500/10",
    initial: { x: -120, y: -80 },
    animate: { x: [-120, -90, -150, -120], y: [-80, -50, -110, -80] },
    duration: 8,
    borderRadius: "40% 60% 60% 40% / 40% 50% 50% 60%",
  },
  {
    width: 220,
    height: 220,
    gradient: "from-blue-400/15 to-cyan-400/10",
    initial: { x: 100, y: 100 },
    animate: { x: [100, 130, 70, 100], y: [100, 130, 70, 100] },
    duration: 10,
    borderRadius: "30% 70% 50% 50% / 50% 40% 60% 50%",
    rotate: 45,
  },
  {
    width: 150,
    height: 150,
    gradient: "from-amber-400/10 to-orange-400/10",
    initial: { x: 220, y: -60 },
    animate: { x: [220, 250, 190, 220], y: [-60, -30, -90, -60] },
    duration: 7,
    borderRadius: "50% 50% 50% 50%",
  },
  {
    width: 100,
    height: 100,
    gradient: "from-violet-500/15 to-pink-500/10",
    initial: { x: -200, y: 140 },
    animate: { x: [-200, -170, -230, -200], y: [140, 170, 110, 140] },
    duration: 9,
    borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%",
    rotate: 30,
  },
]

export default function Hero({ locale }: HeroProps) {
  const personal = getPersonal(locale)

  const t = {
    dl: locale === "fa" ? "دانلود رزومه" : "Download CV",
    cta: locale === "fa" ? "تماس بگیرید" : "Get in Touch",
    scroll: locale === "fa" ? "اسکرول" : "Scroll",
    badge: locale === "fa" ? "آماده همکاری" : "Available for work",
  }

  const scrollDown = () => {
    const about = document.getElementById("about")
    if (about) about.scrollIntoView({ behavior: "smooth" })
  }

  const isRtl = locale === "fa"

  return (
    <section
      id="hero"
      className="min-h-[calc(100dvh-72px)] grid place-items-center px-4 sm:px-8 py-8 relative overflow-hidden"
    >
      <div className={`max-w-5xl w-full relative z-10 flex flex-col lg:flex-row items-center gap-10 lg:gap-16`}>
        {/* Avatar with decorative shapes */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="relative flex-shrink-0"
        >
          {blobShapes.map((s, i) => (
            <motion.div
              key={i}
              className={`absolute bg-gradient-to-br ${s.gradient} blur-2xl`}
              style={{
                width: s.width,
                height: s.height,
                borderRadius: s.borderRadius,
                rotate: s.rotate,
              }}
              initial={s.initial}
              animate={{ x: s.animate.x, y: s.animate.y }}
              transition={{
                duration: s.duration,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
          <motion.div
            className="relative w-48 h-60 sm:w-64 sm:h-[22rem] border-4 border-white/60 dark:border-white/10 shadow-2xl overflow-hidden bg-accent/10"
            style={{ borderRadius: "40% 60% 50% 50% / 50% 40% 60% 50%" }}
            whileHover={{ scale: 1.05, rotate: 2 }}
            transition={{ duration: 0.3 }}
          >
            <Image src="/images/profiles/hero.jpg" alt={personal.name} fill className="object-cover" sizes="(max-width: 640px) 176px, 208px" />
          </motion.div>
        </motion.div>

        {/* Text content */}
        <div className={`text-center lg:text-left flex-1 ${isRtl ? "lg:text-right" : "lg:text-left rtl:text-right"}`}>
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-muted/80 backdrop-blur border border-border text-xs font-semibold text-accent mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            {t.badge}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className={`text-[clamp(1.8rem,5vw,3.5rem)] font-black leading-none text-foreground font-display ${isRtl ? "tracking-normal" : "tracking-[-2px]"}`}
          >
            {personal.name.split(" ").map((part: string, i: number, arr: string[]) =>
              i === arr.length - 1 ? (
                <span key={i} className="text-accent"> {part}</span>
              ) : (
                <span key={i}>{i > 0 ? " " : ""}{part}</span>
              )
            )}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="mt-4 text-[clamp(0.95rem,2vw,1.2rem)] text-muted-foreground"
          >
            <span>{locale === "fa" ? "من می‌سازم " : "I build "}</span>
            <span className="text-foreground font-semibold">
              <Typewriter words={personal.typewriter} />
            </span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className={`flex gap-3 justify-center ${isRtl ? "lg:justify-end" : "lg:justify-start"} flex-wrap mt-8`}
          >
            <a
              href="#contact"
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-accent text-white font-semibold text-sm shadow-[0_4px_14px_rgba(37,99,235,0.3)] hover:bg-[#1D4ED8] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(37,99,235,0.4)] transition-all duration-300"
            >
              <i className="fa-solid fa-paper-plane" />
              {t.cta}
            </a>
            <LinkButton href={personal.resumePdf} download variant="outline">
              <i className="fa-solid fa-file-arrow-down" />
              {t.dl}
            </LinkButton>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        onClick={scrollDown}
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.65 }}
        className="static mt-4 md:absolute bottom-8 left-1/2 right-1/2 flex flex-col items-center gap-2 cursor-pointer bg-transparent border-none"
        aria-label="Scroll to about section"
      >
        <div className="w-6 h-[38px] rounded-full border-2 border-border flex justify-center pt-1.5 hover:border-accent hover:shadow-[0_0_12px_rgba(37,99,235,0.3)] transition-all duration-300">
          <div className="w-1 h-2 rounded-full bg-accent animate-[scrollBounce_1.8s_ease-in-out_infinite]" />
        </div>
        <span className="text-[0.65rem] text-muted-foreground font-medium tracking-[1.5px] uppercase">
          {t.scroll}
        </span>
      </motion.button>
    </section>
  )
}
