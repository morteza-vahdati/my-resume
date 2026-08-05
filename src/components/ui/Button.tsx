"use client"

import { forwardRef, type ButtonHTMLAttributes } from "react"
import { buttonVariants, type ButtonVariant } from "@/components/ui/buttonVariants"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", className = "", children, ...props }, ref) => {
    return (
      <button ref={ref} className={`${buttonVariants[variant]} ${className}`} {...props}>
        {children}
      </button>
    )
  }
)
Button.displayName = "Button"

export default Button
