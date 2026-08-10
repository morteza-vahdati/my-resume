"use client"

import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from "react"
import { buttonVariants, type ButtonVariant } from "@/components/ui/buttonVariants"
import { smoothScrollToElement } from "@/lib/scroll"

interface LinkButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: ButtonVariant
  children: ReactNode
}

export default function LinkButton({
  variant = "primary",
  className = "",
  children,
  href,
  onClick,
  ...props
}: LinkButtonProps) {
  // In-page anchors go through the shared scroll helper so they honour the
  // navbar offset and stay interruptible, like the navbar links do.
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e)
    if (e.defaultPrevented) return
    if (!href?.startsWith("#")) return
    const el = document.getElementById(href.slice(1))
    if (!el) return
    e.preventDefault()
    smoothScrollToElement(el)
    history.replaceState(null, "", `${window.location.pathname}${href}`)
  }

  return (
    <a
      href={href}
      onClick={handleClick}
      className={`${buttonVariants[variant]} ${className}`}
      {...props}
    >
      {children}
    </a>
  )
}
