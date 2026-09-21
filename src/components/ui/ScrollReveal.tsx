"use client"

import { motion, useReducedMotion } from "framer-motion"
import { useRef } from "react"
import { useMediaQuery } from "@/hooks/useMediaQuery"

interface ScrollRevealProps {
  children: React.ReactNode
  className?: string
  direction?: "up" | "left" | "right"
  delay?: number
  duration?: number
}

export default function ScrollReveal({
  children,
  className = "",
  direction = "up",
  delay = 0,
  duration = 0.5,
}: ScrollRevealProps) {
  const ref = useRef(null)
  const prefersReducedMotion = useReducedMotion()
  const compactViewport = useMediaQuery("(max-width: 1023px)")

  const directionOffset = {
    up: { y: 40 },
    left: { x: -40 },
    right: { x: 40 },
  }

  if (prefersReducedMotion || compactViewport) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, ...directionOffset[direction] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration, delay, ease: [0.25, 0.4, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
