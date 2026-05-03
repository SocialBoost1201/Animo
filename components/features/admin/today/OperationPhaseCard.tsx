import { type ReactNode } from 'react'

type OperationPhaseCardProps = {
  title: string
  label: string
  children: ReactNode
  tone?: 'default' | 'risk'
}

export function OperationPhaseCard({
  title,
  label,
  children,
  tone = 'default',
}: OperationPhaseCardProps) {
  const toneClass =
    tone === 'risk'
      ? 'border-orange-500/25 bg-orange-500/5'
      : 'border-white/10 bg-black/94'

  return (
    <section className={`rounded-sm border p-4 ${toneClass}`}>
      <p className="text-[9px] font-bold tracking-[0.18em] text-[#8a8478] uppercase">
        {label}
      </p>
      <h2 className="mt-2 text-[14px] font-bold tracking-tight text-[#f4f1ea]">
        {title}
      </h2>
      <div className="mt-3 text-[11px] leading-relaxed text-[#cbc3b3]">
        {children}
      </div>
    </section>
  )
}
