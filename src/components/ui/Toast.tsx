"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"

export type ToastType = "success" | "error" | "info"

export interface ToastData {
  message: string
  type: ToastType
}

interface ToastProps {
  data: ToastData
  onClose: () => void
  duration?: number
  locale: "en" | "fa"
}

const config: Record<ToastType, { icon: string; bg: string; border: string; color: string }> = {
  success: {
    icon: "fa-circle-check",
    bg: "rgba(34,197,94,0.12)",
    border: "rgba(34,197,94,0.25)",
    color: "rgb(34,197,94)",
  },
  error: {
    icon: "fa-circle-xmark",
    bg: "rgba(239,68,68,0.12)",
    border: "rgba(239,68,68,0.25)",
    color: "rgb(239,68,68)",
  },
  info: {
    icon: "fa-circle-info",
    bg: "rgba(var(--primary-rgb),0.12)",
    border: "rgba(var(--primary-rgb),0.25)",
    color: "rgb(var(--primary-rgb))",
  },
}

const labels: Record<"en" | "fa", Record<ToastType, string>> = {
  en: { success: "Sent", error: "Could not send", info: "Note" },
  fa: { success: "ارسال شد", error: "ارسال نشد", info: "توجه" },
}

export default function Toast({ data, onClose, duration = 5000, locale }: ToastProps) {
  const isRtl = locale === "fa"
  const cfg = config[data.type]

  useEffect(() => {
    const timer = setTimeout(onClose, duration)
    return () => clearTimeout(timer)
  }, [onClose, duration])

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 24, scale: 0.92 }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
      dir={isRtl ? "rtl" : "ltr"}
      className={`fixed bottom-6 ${isRtl ? "left-4 sm:left-8" : "right-4 sm:right-8"} z-[9999] flex items-start gap-3 px-5 py-3.5 rounded-xl backdrop-blur-xl border shadow-[0_8px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] max-w-sm w-[calc(100vw-2rem)]`}
      style={{
        backgroundColor: cfg.bg,
        borderColor: cfg.border,
      }}
    >
      <i className={`fa-solid ${cfg.icon} mt-0.5 text-sm`} style={{ color: cfg.color }} />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold tracking-wide mb-0.5" style={{ color: cfg.color }}>
          {labels[locale][data.type]}
        </p>
        <p className="text-sm text-foreground leading-relaxed">{data.message}</p>
      </div>
      <button
        onClick={onClose}
        className="flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-muted-foreground/60 hover:text-foreground hover:bg-muted/50 transition-all duration-200 outline-none"
        aria-label={locale === "fa" ? "بستن پیام" : "Close notification"}
      >
        <i className="fa-solid fa-xmark text-xs" />
      </button>
    </motion.div>
  )
}
