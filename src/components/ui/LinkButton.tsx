import type { AnchorHTMLAttributes, ReactNode } from "react"

interface LinkButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: "primary" | "outline"
  children: ReactNode
}

const variants = {
  primary:
    "inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-accent text-white font-semibold text-sm shadow-[0_4px_14px_rgba(37,99,235,0.3)] hover:bg-[#1D4ED8] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(37,99,235,0.4)] transition-all duration-300 cursor-pointer",
  outline:
    "inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-transparent text-foreground border-2 border-border font-semibold text-sm hover:border-accent hover:text-accent hover:-translate-y-0.5 transition-all duration-300 cursor-pointer",
}

export default function LinkButton({ variant = "primary", className = "", children, ...props }: LinkButtonProps) {
  return (
    <a className={`${variants[variant]} ${className}`} {...props}>
      {children}
    </a>
  )
}
