'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

interface RevealTextProps {
  text: string;
  delay?: number;
  className?: string;
  viewportOnce?: boolean;
}

export const RevealText: React.FC<RevealTextProps> = ({
  text,
  delay = 0,
  className = '',
  viewportOnce = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const characters = Array.from(text);

  useGSAP(() => {
    if (!containerRef.current) return;
    
    const chars = containerRef.current.querySelectorAll('.reveal-char');
    
    gsap.fromTo(chars, 
      {
        opacity: 0,
        y: 20,
        rotateX: -45,
        filter: 'blur(10px)'
      },
      {
        opacity: 1,
        y: 0,
        rotateX: 0,
        filter: 'blur(0px)',
        duration: 1.5,
        ease: 'power3.out',
        stagger: 0.04,
        delay: delay,
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 85%',
          once: viewportOnce,
        }
      }
    );
  }, { scope: containerRef });

  return (
    <div
      ref={containerRef}
      style={{ display: 'inline-block', overflow: 'hidden' }}
      className={`inline-flex flex-wrap ${className}`}
    >
      {characters.map((char, index) => (
        <span
          className="reveal-char"
          style={{ display: 'inline-block', whiteSpace: char === ' ' ? 'pre' : 'normal' }}
          key={index}
        >
          {char}
        </span>
      ))}
    </div>
  );
};
