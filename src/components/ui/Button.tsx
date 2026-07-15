"use client"

import { forwardRef, type ButtonHTMLAttributes } from "react"

type ButtonVariant = "primary" | "outline" | "ghost"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
}

const variants: Record<ButtonVariant, string> = {
  primary:
    "inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-accent text-white font-semibold text-sm shadow-[0_4px_14px_rgba(37,99,235,0.3)] hover:bg-[#1D4ED8] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(37,99,235,0.4)] transition-all duration-300 cursor-pointer",
  outline:
    "inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-transparent text-foreground border-2 border-border font-semibold text-sm hover:border-accent hover:text-accent hover:-translate-y-0.5 transition-all duration-300 cursor-pointer",
  ghost:
    "w-10 h-10 rounded-xl border border-border inline-flex items-center justify-center text-secondary hover:bg-accent hover:border-accent hover:text-white hover:-translate-y-0.5 transition-all duration-300 cursor-pointer",
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", className = "", children, ...props }, ref) => {
    return (
      <button ref={ref} className={`${variants[variant]} ${className}`} {...props}>
        {children}
      </button>
    )
  }
)
Button.displayName = "Button"

export default Button
