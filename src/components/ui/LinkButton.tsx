import type { AnchorHTMLAttributes, ReactNode } from "react"
import { buttonVariants, type ButtonVariant } from "@/components/ui/buttonVariants"

interface LinkButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: ButtonVariant
  children: ReactNode
}

export default function LinkButton({ variant = "primary", className = "", children, ...props }: LinkButtonProps) {
  return (
    <a className={`${buttonVariants[variant]} ${className}`} {...props}>
      {children}
    </a>
  )
}
