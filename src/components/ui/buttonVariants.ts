export const buttonVariants = {
  primary:
    "inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-white font-semibold text-sm shadow-[0_4px_14px_rgba(var(--primary-rgb),0.3)] hover:bg-primary-hover hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(var(--primary-rgb),0.4)] transition-all duration-300 cursor-pointer",
  outline:
    "inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-transparent text-foreground border-2 border-border font-semibold text-sm hover:border-primary hover:text-primary hover:-translate-y-0.5 transition-all duration-300 cursor-pointer",
  ghost:
    "w-10 h-10 rounded-xl border border-border inline-flex items-center justify-center text-secondary hover:bg-primary hover:border-primary hover:text-white hover:-translate-y-0.5 transition-all duration-300 cursor-pointer",
} as const

export type ButtonVariant = keyof typeof buttonVariants
