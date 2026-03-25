interface GsapRevealTitleProps {
  text: string
  className?: string
  delay?: number
}

export function GsapRevealTitle({ text, className = '' }: GsapRevealTitleProps) {
  return (
    <span className={`inline-block ${className}`}>
      {text}
    </span>
  )
}
