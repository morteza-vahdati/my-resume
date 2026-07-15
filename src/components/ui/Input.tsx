"use client"

import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes } from "react"

const base =
  "w-full px-3.5 py-2.5 rounded-xl border-2 border-border bg-white/55 dark:bg-white/5 backdrop-blur text-foreground text-sm outline-none focus:border-accent focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)] transition-all duration-200"

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

const Input = forwardRef<HTMLInputElement, InputProps>(({ className = "", ...props }, ref) => {
  return <input ref={ref} className={`${base} ${className}`} {...props} />
})
Input.displayName = "Input"

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({ className = "", ...props }, ref) => {
  return <textarea ref={ref} className={`${base} resize-y min-h-[110px] ${className}`} {...props} />
})
Textarea.displayName = "Textarea"

export { Input, Textarea }
