import type { ReactNode } from "react"

interface BadgeProps {
  children: ReactNode
  className?: string
  variant?: "default" | "primary" | "outline"
}

const variants = {
  default:
    "inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-muted/80 backdrop-blur border border-border text-xs font-semibold text-primary",
  primary:
    "text-xs font-semibold px-3 py-1 rounded-md bg-primary/10 text-primary border border-primary/20 whitespace-nowrap",
  outline:
    "px-3 py-1.5 rounded-lg text-xs font-medium border border-border text-secondary bg-muted cursor-default hover:bg-primary hover:text-white hover:border-primary hover:-translate-y-0.5 transition-all duration-200",
}

export default function Badge({ children, className = "", variant = "default" }: BadgeProps) {
  return <span className={`${variants[variant]} ${className}`}>{children}</span>
}
