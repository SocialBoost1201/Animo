'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP)
}

interface GsapRevealTitleProps {
  text: string
  className?: string
  delay?: number
}

export function GsapRevealTitle({ text, className = '', delay = 0 }: GsapRevealTitleProps) {
  const containerRef = useRef<HTMLHeadingElement>(null)
  
  useGSAP(() => {
    const chars = containerRef.current?.querySelectorAll('.char')
    if (!chars || chars.length === 0) return

    gsap.fromTo(chars, 
      { 
        y: 100, 
        opacity: 0,
        rotateX: -80,
        filter: 'blur(10px)'
      },
      {
        y: 0,
        opacity: 1,
        rotateX: 0,
        filter: 'blur(0px)',
        stagger: 0.03,
        duration: 2,
        delay: delay,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 90%',
        }
      }
    )
  }, { scope: containerRef })

  return (
    <span ref={containerRef} className={`inline-block [perspective:1000px] ${className}`}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="flex flex-wrap justify-center overflow-hidden">
        {text.split('').map((char, i) => (
          <span 
            key={i} 
            className="char inline-block will-change-transform origin-bottom"
            style={{ whiteSpace: char === ' ' ? 'pre' : 'normal' }}
          >
            {char}
          </span>
        ))}
      </span>
    </span>
  )
}
