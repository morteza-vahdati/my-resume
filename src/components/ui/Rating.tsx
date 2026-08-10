"use client"

import { motion } from "framer-motion"
import { useState } from "react"

interface RatingProps {
  value: number
  onChange: (value: number) => void
  locale: "en" | "fa"
  disabled?: boolean
  error?: boolean
}

const labels: Record<"en" | "fa", string[]> = {
  en: ["Poor", "Fair", "Good", "Very Good", "Excellent"],
  fa: ["ضعیف", "متوسط", "خوب", "خیلی خوب", "عالی"],
}

const starLabel: Record<"en" | "fa", string> = {
  en: "Rating",
  fa: "امتیاز",
}

export default function Rating({ value, onChange, locale, disabled, error }: RatingProps) {
  const [hovered, setHovered] = useState(0)
  const isRtl = locale === "fa"

  const showLabel = value > 0 || (hovered > 0 && !disabled)
  const stars = isRtl ? [5, 4, 3, 2, 1] : [1, 2, 3, 4, 5]

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="flex items-center gap-2 w-full justify-start px-1">
        <span className={`text-xs font-semibold ${error ? "!text-red-500" : "text-secondary"} flex-shrink-0`}>
          {starLabel[locale]}
        </span>
        {showLabel && (
          <motion.span
            initial={{ opacity: 0, x: isRtl ? 6 : -6 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-xs font-medium text-primary"
          >
            —  {labels[locale][(hovered || value) - 1]}
          </motion.span>
        )}
      </div>
      <div dir="ltr" className={`flex gap-2 w-full ${isRtl ? "justify-end" : "justify-start"}`}>
        {stars.map((star) => {
          const active = star <= (hovered || value)
          return (
            <motion.button
              key={star}
              type="button"
              disabled={disabled}
              whileHover={disabled ? {} : { scale: 1.15 }}
              whileTap={disabled ? {} : { scale: 0.85 }}
              onClick={() => onChange(star === value ? 0 : star)}
              onMouseEnter={() => !disabled && setHovered(star)}
              onMouseLeave={() => !disabled && setHovered(0)}
              className={`w-[34px] h-[34px] rounded-lg flex items-center justify-center text-xs backdrop-blur border transition-all duration-200 outline-none
                ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
                ${error ? "!border-red-500/50" : "border-border/50"}
                ${active
                  ? "bg-primary/20 text-primary shadow-[0_0_14px_rgba(var(--primary-rgb),0.3)] border-primary/40"
                  : "bg-muted/40 text-muted-foreground/60 hover:bg-primary/10 hover:text-primary/50"
                }`}
              aria-label={`${star} star${star > 1 ? "s" : ""}`}
            >
              <i className={`${active ? "fa-solid" : "fa-regular"} fa-star text-[10px]`} />
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
