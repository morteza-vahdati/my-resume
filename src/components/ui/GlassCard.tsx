"use client"

import { motion, HTMLMotionProps } from "framer-motion"
import { forwardRef } from "react"

interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode
  className?: string
}

const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ children, className = "", ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={`rounded-xl border border-white/75 dark:border-white/10 bg-white/55 dark:bg-white/5 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] ${className}`}
        {...props}
      >
        {children}
      </motion.div>
    )
  }
)
GlassCard.displayName = "GlassCard"

export default GlassCard
