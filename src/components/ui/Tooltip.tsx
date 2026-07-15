"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import type { ReactNode } from "react"

interface TooltipProps {
  content: string
  children: ReactNode
}

export default function Tooltip({ content, children }: TooltipProps) {
  const [show, setShow] = useState(false)

  return (
    <div
      className="relative"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.92 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="absolute bottom-5 left-1/2 right-1/2 px-2.5 py-1 min-w-min rounded-lg bg-accent text-white text-[0.70rem] font-semibold whitespace-nowrap shadow-lg pointer-events-none"
          >
            {content}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] border-r-[5px] border-t-[5px] border-l-transparent border-r-transparent border-t-accent" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
