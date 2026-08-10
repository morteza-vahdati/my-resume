"use client"

import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes } from "react"

const base =
  "w-full px-3.5 py-2.5 rounded-xl border-2 border-border bg-white/55 dark:bg-white/5 backdrop-blur text-foreground text-sm outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(var(--primary-rgb),0.1)] transition-all duration-200"

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ className = "", error, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={`${base} ${error ? "!border-red-500 !shadow-[0_0_0_3px_rgba(239,68,68,0.1)] focus:!border-red-500 focus:!shadow-[0_0_0_3px_rgba(239,68,68,0.15)]" : ""} ${className}`}
      {...props}
    />
  )
})
Input.displayName = "Input"

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({ className = "", error, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={`${base} resize-none min-h-24 max-h-48 overflow-y-auto ${error ? "!border-red-500 !shadow-[0_0_0_3px_rgba(239,68,68,0.1)] focus:!border-red-500 focus:!shadow-[0_0_0_3px_rgba(239,68,68,0.15)]" : ""} ${className}`}
      style={{ scrollbarGutter: "stable" }}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Input, Textarea }
