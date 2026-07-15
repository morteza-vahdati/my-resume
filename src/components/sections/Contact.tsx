"use client"

import ScrollReveal from "@/components/ui/ScrollReveal"
import GlassCard from "@/components/ui/GlassCard"
import Button from "@/components/ui/Button"
import { Input, Textarea } from "@/components/ui/Input"

interface ContactProps {
  locale: "en" | "fa"
}

export default function Contact({ locale }: ContactProps) {
  const t = {
    label: locale === "fa" ? "بیایید حرف بزنیم" : "Let's talk",
    title: locale === "fa" ? "تماس با من" : "Contact",
    sub: locale === "fa" ? "پروژه‌ای در ذهن دارید؟ بیایید با هم چیز خوبی بسازیم." : "Have a project in mind? Let's build something great together.",
    h3: locale === "fa" ? "در تماس باشید" : "Get in touch",
    p: locale === "fa" ? "چه پروژه، سوال یا فقط یک سلام داشته باشید — صندوق پستی من همیشه باز است." : "Whether you have a project, a question, or just want to say hi — my inbox is always open.",
    email: locale === "fa" ? "ایمیل" : "Email",
    name: locale === "fa" ? "نام" : "Name",
    namePh: locale === "fa" ? "نام شما" : "Your name",
    emailPh: "your@email.com",
    msg: locale === "fa" ? "پیام" : "Message",
    msgPh: locale === "fa" ? "پیام شما..." : "Your message...",
    send: locale === "fa" ? "ارسال پیام" : "Send Message",
    coming: locale === "fa" ? "فرم تماس به زودی فعال می‌شود!" : "Contact form coming soon!",
  }

  const showToast = () => {
    const msg = t.coming
    const n = document.createElement("div")
    n.textContent = msg
    Object.assign(n.style, {
      position: "fixed",
      bottom: "24px",
      insetInlineEnd: "24px",
      zIndex: "9999",
      background: "hsl(217, 91%, 60%)",
      color: "#fff",
      padding: "0.8rem 1.4rem",
      borderRadius: "12px",
      fontSize: "0.88rem",
      fontWeight: "600",
      boxShadow: "0 8px 24px rgba(37,99,235,0.3)",
    })
    document.body.appendChild(n)
    setTimeout(() => n.remove(), 3000)
  }

  return (
    <section id="contact" className="px-4 sm:px-8 py-[clamp(3.5rem,8vw,6rem)] max-w-6xl mx-auto">
      <ScrollReveal>
        <span className="text-[0.72rem] font-bold tracking-[2px] uppercase text-accent mb-2 block">
          {t.label}
        </span>
        <h2 className="text-[clamp(1.5rem,3.5vw,2.5rem)] font-black tracking-[-1.5px] leading-tight text-foreground mb-3 font-display">
          {t.title}
        </h2>
        <div className="w-10 h-[3px] bg-accent rounded-full mb-4" />
        <p className="text-muted-foreground mb-14">{t.sub}</p>
      </ScrollReveal>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-12 items-start">
        <ScrollReveal direction="left">
          <h3 className="text-2xl font-extrabold tracking-tight text-foreground mb-3">
            {t.h3}
          </h3>
          <p className="text-secondary leading-relaxed mb-8">{t.p}</p>

          <div className="flex flex-col gap-3">
            <a
              href="mailto:mvahdati1382@gmail.com"
              className="flex items-center gap-4 p-3.5 rounded-xl border border-border text-secondary hover:border-accent hover:text-accent hover:bg-accent/5 hover:translate-x-1 rtl:hover:-translate-x-1 transition-all duration-300"
            >
              <div className="w-[38px] h-[38px] rounded-lg bg-muted flex items-center justify-center text-accent flex-shrink-0">
                <i className="fa-solid fa-envelope" />
              </div>
              <div>
                <div className="text-[0.7rem] text-muted-foreground">{t.email}</div>
                <div className="text-sm font-semibold">mvahdati1382@gmail.com</div>
              </div>
            </a>
            <a
              href="https://linkedin.com/in/mvahdati"
              target="_blank"
              rel="noopener"
              className="flex items-center gap-4 p-3.5 rounded-xl border border-border text-secondary hover:border-accent hover:text-accent hover:bg-accent/5 hover:translate-x-1 rtl:hover:-translate-x-1 transition-all duration-300"
            >
              <div className="w-[38px] h-[38px] rounded-lg bg-muted flex items-center justify-center text-accent flex-shrink-0">
                <i className="fa-brands fa-linkedin" />
              </div>
              <div>
                <div className="text-[0.7rem] text-muted-foreground">LinkedIn</div>
                <div className="text-sm font-semibold">linkedin.com/in/mvahdati</div>
              </div>
            </a>
            <a
              href="https://github.com/mvahdati"
              target="_blank"
              rel="noopener"
              className="flex items-center gap-4 p-3.5 rounded-xl border border-border text-secondary hover:border-accent hover:text-accent hover:bg-accent/5 hover:translate-x-1 rtl:hover:-translate-x-1 transition-all duration-300"
            >
              <div className="w-[38px] h-[38px] rounded-lg bg-muted flex items-center justify-center text-accent flex-shrink-0">
                <i className="fa-brands fa-github" />
              </div>
              <div>
                <div className="text-[0.7rem] text-muted-foreground">GitHub</div>
                <div className="text-sm font-semibold">github.com/mvahdati</div>
              </div>
            </a>
          </div>

          <div className="flex gap-2.5 mt-6">
            <a
              href="https://github.com/mvahdati"
              target="_blank"
              rel="noopener"
              className="w-10 h-10 rounded-xl border border-border flex items-center justify-center text-secondary hover:bg-accent hover:border-accent hover:text-white hover:-translate-y-0.5 transition-all duration-300"
              aria-label="GitHub"
            >
              <i className="fa-brands fa-github" />
            </a>
            <a
              href="https://linkedin.com/in/mvahdati"
              target="_blank"
              rel="noopener"
              className="w-10 h-10 rounded-xl border border-border flex items-center justify-center text-secondary hover:bg-accent hover:border-accent hover:text-white hover:-translate-y-0.5 transition-all duration-300"
              aria-label="LinkedIn"
            >
              <i className="fa-brands fa-linkedin" />
            </a>
            <a
              href="mailto:mvahdati1382@gmail.com"
              className="w-10 h-10 rounded-xl border border-border flex items-center justify-center text-secondary hover:bg-accent hover:border-accent hover:text-white hover:-translate-y-0.5 transition-all duration-300"
              aria-label="Email"
            >
              <i className="fa-solid fa-envelope" />
            </a>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="right">
          <GlassCard className="p-7">
            <div className="mb-4">
              <label className="block text-xs font-semibold text-secondary mb-1.5">{t.name}</label>
              <Input type="text" placeholder={t.namePh} autoComplete="name" />
            </div>
            <div className="mb-4">
              <label className="block text-xs font-semibold text-secondary mb-1.5">{t.email}</label>
              <Input type="email" placeholder={t.emailPh} autoComplete="email" />
            </div>
            <div className="mb-5">
              <label className="block text-xs font-semibold text-secondary mb-1.5">{t.msg}</label>
              <Textarea placeholder={t.msgPh} rows={4} />
            </div>
            <Button type="button" onClick={showToast} className="w-full">
              <i className="fa-solid fa-paper-plane" />
              {t.send}
            </Button>
          </GlassCard>
        </ScrollReveal>
      </div>
    </section>
  )
}
