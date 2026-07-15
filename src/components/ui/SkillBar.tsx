"use client"

import { motion } from "framer-motion"
import Tooltip from "@/components/ui/Tooltip"

interface SkillBarProps {
  name: string
  percentage: number
  level: string
  delay?: number
}

export default function SkillBar({ name, percentage, level, delay = 0 }: SkillBarProps) {
  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1.5">
        <span className="text-sm font-semibold text-foreground">{name}</span>
        <span className="text-xs font-bold text-accent">{level}</span>
      </div>
      <Tooltip content={`${percentage}%`}>
        <div className="h-2 bg-muted rounded-full overflow-hidden cursor-pointer">
          <motion.div
            className="h-full rounded-full bg-accent"
            initial={{ width: "0%" }}
            whileInView={{ width: `${percentage}%` }}
            viewport={{ once: true }}
            transition={{ duration: 1.1, delay, ease: [0.4, 0, 0.2, 1] }}
          />
        </div>
      </Tooltip>
    </div>
  )
}
