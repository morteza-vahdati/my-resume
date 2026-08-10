"use client"

import { useState, useRef, useCallback, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import ScrollReveal from "@/components/ui/ScrollReveal"
import GlassCard from "@/components/ui/GlassCard"
import SectionHeader from "@/components/ui/SectionHeader"
import Button from "@/components/ui/Button"
import { Input, Textarea } from "@/components/ui/Input"
import Rating from "@/components/ui/Rating"
import Toast, { type ToastData } from "@/components/ui/Toast"
import { getResumeData } from "@/lib/resume"

interface ContactProps {
  locale: "en" | "fa"
}

type FormStatus = "idle" | "loading" | "success" | "error"

interface FormData {
  name: string
  email: string
  message: string
  rating: number
}

interface FormErrors {
  name?: string
  email?: string
  message?: string
  rating?: string
}

export default function Contact({ locale }: ContactProps) {
  const isRtl = locale === "fa"
  const social = getResumeData().social

  const t = useMemo(() => ({
    label: isRtl ? "بیایید حرف بزنیم" : "Let's talk",
    title: isRtl ? "تماس با من" : "Contact",
    sub: isRtl ? "پروژه‌ای در ذهن دارید؟ بیایید با هم چیز خوبی بسازیم." : "Have a project in mind? Let's build something great together.",
    h3: isRtl ? "در تماس باشید" : "Get in touch",
    p: isRtl ? "چه پروژه، سوال یا فقط یک سلام داشته باشید — صندوق پستی من همیشه باز است." : "Whether you have a project, a question, or just want to say hi — my inbox is always open.",
    email: isRtl ? "ایمیل" : "Email",
    name: isRtl ? "نام" : "Name",
    namePh: isRtl ? "نام شما" : "Your name",
    emailPh: "your@email.com",
    msg: isRtl ? "پیام" : "Message",
    msgPh: isRtl ? "پیام شما..." : "Your message...",
    send: isRtl ? "ارسال پیام" : "Send Message",
    sending: isRtl ? "در حال ارسال..." : "Sending...",
    successMsg: isRtl ? "پیام شما با موفقیت ارسال شد! به زودی پاسخ می‌دهم." : "Your message was sent successfully! I'll get back to you soon.",
    errorMsg: isRtl ? "متأسفانه خطایی رخ داد. لطفاً دوباره تلاش کنید." : "Something went wrong. Please try again.",
    rateLimitMsg: isRtl ? "درخواست‌های زیادی ارسال کرده‌اید. لطفاً کمی بعد تلاش کنید." : "Too many requests. Please try again later.",
    nameReq: isRtl ? "نام باید حداقل ۲ حرف باشد" : "Name must be at least 2 characters",
    emailReq: isRtl ? "ایمیل معتبر وارد کنید" : "Please enter a valid email",
    msgReq: isRtl ? "پیام باید حداقل ۱۰ حرف باشد" : "Message must be at least 10 characters",
    rateReq: isRtl ? "لطفاً یک امتیاز انتخاب کنید" : "Please select a rating",
  }), [isRtl])

  const [form, setForm] = useState<FormData>({ name: "", email: "", message: "", rating: 0 })
  const [errors, setErrors] = useState<FormErrors>({})
  const [status, setStatus] = useState<FormStatus>("idle")
  const [toast, setToast] = useState<ToastData | null>(null)
  const formLoadedAt = useRef(Date.now())
  const honeypotRef = useRef<HTMLInputElement>(null)
  const formRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    formLoadedAt.current = Date.now()
  }, [])

  const validate = useCallback((): boolean => {
    const newErrors: FormErrors = {}
    if (!form.name.trim() || form.name.trim().length < 2) newErrors.name = t.nameReq
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = t.emailReq
    if (!form.message.trim() || form.message.trim().length < 10) newErrors.message = t.msgReq
    if (!form.rating) newErrors.rating = t.rateReq
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [form, t])

  const handleChange = (field: keyof FormData, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleSubmit = async () => {
    if (status === "loading") return
    if (!validate()) return

    setStatus("loading")

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          name: form.name.trim(),
          email: form.email.trim(),
          message: form.message.trim(),
          honeypot: honeypotRef.current?.value || "",
          elapsedMs: Date.now() - formLoadedAt.current,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        const pick = (msg: { en: string; fa: string } | string | undefined, fallback: string) => {
          if (!msg) return fallback
          return typeof msg === "string" ? msg : msg[locale]
        }

        if (res.status === 429) {
          setToast({ message: pick(data.error, t.rateLimitMsg), type: "error" })
        } else if (data.errors) {
          const localized: FormErrors = {}
          for (const key of Object.keys(data.errors) as (keyof FormErrors)[]) {
            localized[key] = pick(data.errors[key], t.errorMsg)
          }
          setErrors(localized)
        } else {
          setToast({ message: pick(data.error, t.errorMsg), type: "error" })
        }
        setStatus("error")
        setTimeout(() => setStatus("idle"), 3000)
        return
      }

      setToast({ message: t.successMsg, type: "success" })
      setStatus("success")
      setForm({ name: "", email: "", message: "", rating: 0 })
      setErrors({})

      setTimeout(() => setStatus("idle"), 4500)
    } catch {
      console.error("Contact form submission failed")
      setToast({ message: t.errorMsg, type: "error" })
      setStatus("error")
      setTimeout(() => setStatus("idle"), 3000)
    }
  }

  const closeToast = () => setToast(null)

  const isLoading = status === "loading"

  return (
    <section id="contact" className="px-4 sm:px-8 py-[clamp(3.5rem,8vw,6rem)] max-w-6xl mx-auto">
      <SectionHeader label={t.label} title={t.title} subtitle={t.sub} />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-12 items-start">
        <ScrollReveal direction="left">
          <h3 className="text-2xl font-extrabold tracking-tight text-foreground mb-3">
            {t.h3}
          </h3>
          <p className="text-secondary leading-relaxed mb-8">{t.p}</p>

          <div className="flex flex-col gap-3">
            <a
              href={`mailto:${social.email}`}
              className="flex items-center gap-4 p-3.5 rounded-xl border border-border text-secondary hover:border-primary hover:text-primary hover:bg-primary/5 hover:translate-x-1 rtl:hover:-translate-x-1 transition-all duration-300"
            >
              <div className="w-[38px] h-[38px] rounded-lg bg-muted flex items-center justify-center text-primary flex-shrink-0">
                <i className="fa-solid fa-envelope" />
              </div>
              <div>
                <div className="text-[0.7rem] text-muted-foreground">{t.email}</div>
                <div className="text-sm font-semibold">{social.email}</div>
              </div>
            </a>
            <a
              href={social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-3.5 rounded-xl border border-border text-secondary hover:border-primary hover:text-primary hover:bg-primary/5 hover:translate-x-1 rtl:hover:-translate-x-1 transition-all duration-300"
            >
              <div className="w-[38px] h-[38px] rounded-lg bg-muted flex items-center justify-center text-primary flex-shrink-0">
                <i className="fa-brands fa-linkedin" />
              </div>
              <div>
                <div className="text-[0.7rem] text-muted-foreground">LinkedIn</div>
                <div className="text-sm font-semibold">{social.linkedin.replace("https://", "")}</div>
              </div>
            </a>
            <a
              href={social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-3.5 rounded-xl border border-border text-secondary hover:border-primary hover:text-primary hover:bg-primary/5 hover:translate-x-1 rtl:hover:-translate-x-1 transition-all duration-300"
            >
              <div className="w-[38px] h-[38px] rounded-lg bg-muted flex items-center justify-center text-primary flex-shrink-0">
                <i className="fa-brands fa-github" />
              </div>
              <div>
                <div className="text-[0.7rem] text-muted-foreground">GitHub</div>
                <div className="text-sm font-semibold">{social.github.replace("https://", "")}</div>
              </div>
            </a>
          </div>

          <div className="flex gap-2.5 mt-6">
            <a
              href={social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-xl border border-border flex items-center justify-center text-secondary hover:bg-primary hover:border-primary hover:text-white hover:-translate-y-0.5 transition-all duration-300"
              aria-label="GitHub"
            >
              <i className="fa-brands fa-github" />
            </a>
            <a
              href={social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-xl border border-border flex items-center justify-center text-secondary hover:bg-primary hover:border-primary hover:text-white hover:-translate-y-0.5 transition-all duration-300"
              aria-label="LinkedIn"
            >
              <i className="fa-brands fa-linkedin" />
            </a>
            <a
              href={`mailto:${social.email}`}
              className="w-10 h-10 rounded-xl border border-border flex items-center justify-center text-secondary hover:bg-primary hover:border-primary hover:text-white hover:-translate-y-0.5 transition-all duration-300"
              aria-label="Email"
            >
              <i className="fa-solid fa-envelope" />
            </a>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="right">
          <GlassCard className={`p-7 ${isLoading ? "opacity-70 pointer-events-none" : ""} transition-all duration-500`}>
            <motion.div layout ref={formRef} className="min-h-[380px]">
              <AnimatePresence mode="wait">
                {status === "success" ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.25 } }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="flex flex-col items-center justify-center min-h-[380px] gap-4"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 250, damping: 18, delay: 0.2 }}
                      className="w-16 h-16 rounded-2xl bg-primary/15 flex items-center justify-center text-primary"
                    >
                      <i className="fa-solid fa-check text-2xl" />
                    </motion.div>
                    <p className="text-sm font-medium text-foreground text-center max-w-xs leading-relaxed">{t.successMsg}</p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.2 } }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="flex flex-col gap-4"
                  >
                  <div className="space-y-1.5">
                    <label
                      className={`block text-xs font-semibold ${errors.name ? "!text-red-500" : "text-secondary"}`}
                    >
                      {t.name}
                    </label>
                    <Input
                      type="text"
                      placeholder={t.namePh}
                      autoComplete="name"
                      value={form.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      error={!!errors.name}
                      disabled={isLoading}
                      dir={isRtl ? "rtl" : "ltr"}
                    />
                    <AnimatePresence mode="wait">
                      {errors.name && (
                        <motion.p
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          className="text-[0.7rem] text-red-500 flex items-center gap-1 mt-1"
                        >
                          <i className="fa-solid fa-circle-exclamation text-[8px]" />
                          {errors.name}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="space-y-1.5">
                    <label
                      className={`block text-xs font-semibold ${errors.email ? "!text-red-500" : "text-secondary"}`}
                    >
                      {t.email}
                    </label>
                    <Input
                      type="email"
                      placeholder={t.emailPh}
                      autoComplete="email"
                      value={form.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      error={!!errors.email}
                      disabled={isLoading}
                      dir={isRtl ? "rtl" : "ltr"}
                    />
                    <AnimatePresence mode="wait">
                      {errors.email && (
                        <motion.p
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          className="text-[0.7rem] text-red-500 flex items-center gap-1 mt-1"
                        >
                          <i className="fa-solid fa-circle-exclamation text-[8px]" />
                          {errors.email}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="space-y-1.5">
                    <label
                      className={`block text-xs font-semibold ${errors.message ? "!text-red-500" : "text-secondary"}`}
                    >
                      {t.msg}
                    </label>
                    <Textarea
                      placeholder={t.msgPh}
                      rows={4}
                      value={form.message}
                      onChange={(e) => handleChange("message", e.target.value)}
                      error={!!errors.message}
                      disabled={isLoading}
                      dir={isRtl ? "rtl" : "ltr"}
                    />
                    <AnimatePresence mode="wait">
                      {errors.message && (
                        <motion.p
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          className="text-[0.7rem] text-red-500 flex items-center gap-1 !mt-0"
                        >
                          <i className="fa-solid fa-circle-exclamation text-[8px]" />
                          {errors.message}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="space-y-1.5">
                    <Rating
                      value={form.rating}
                      onChange={(v) => handleChange("rating", v)}
                      locale={locale}
                      disabled={isLoading}
                      error={!!errors.rating}
                    />
                    <AnimatePresence mode="wait">
                      {errors.rating && (
                        <motion.p
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          className="text-[0.7rem] text-red-500 flex items-center gap-1"
                        >
                          <i className="fa-solid fa-circle-exclamation text-[8px]" />
                          {errors.rating}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="absolute opacity-0 h-0 overflow-hidden pointer-events-none" aria-hidden>
                    <input type="text" name="website" tabIndex={-1} autoComplete="off" ref={honeypotRef} />
                  </div>

                  <Button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className={`w-full ${isLoading ? "opacity-80 cursor-not-allowed" : ""}`}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <motion.i
                          className="fa-solid fa-circle-notch text-sm"
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        />
                        {t.sending}
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <i className="fa-solid fa-paper-plane text-sm" />
                        {t.send}
                      </span>
                    )}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
          </GlassCard>
        </ScrollReveal>
      </div>

      <AnimatePresence>
        {toast && <Toast data={toast} onClose={closeToast} locale={locale} />}
      </AnimatePresence>
    </section>
  )
}
