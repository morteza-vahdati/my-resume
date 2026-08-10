import ScrollReveal from "@/components/ui/ScrollReveal"

interface SectionHeaderProps {
  label: string
  title: string
  subtitle?: string
}

export default function SectionHeader({ label, title, subtitle }: SectionHeaderProps) {
  return (
    <ScrollReveal>
      <span className="text-[0.72rem] font-bold tracking-[2px] uppercase text-primary mb-2 block">
        {label}
      </span>
      <h2 className="text-[clamp(1.5rem,3.5vw,2.5rem)] font-black tracking-[-1.5px] leading-tight text-foreground mb-3 font-display">
        {title}
      </h2>
      <div className="w-10 h-[3px] bg-primary rounded-full mb-4" />
      {subtitle && <p className="text-muted-foreground mb-14">{subtitle}</p>}
    </ScrollReveal>
  )
}
