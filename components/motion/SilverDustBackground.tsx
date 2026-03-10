'use client';

import React, { useEffect, useRef } from 'react';

interface SilverDustBackgroundProps {
  particleCount?: number;
  className?: string;
  opacity?: number;
  minSize?: number;
  maxSize?: number;
}

export const SilverDustBackground: React.FC<SilverDustBackgroundProps> = ({
  particleCount = 50,
  className = '',
  opacity = 0.5,
  minSize = 1.2,
  maxSize = 3.2,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;
    
    // Set internal canvas resolution to match display size (with DPR for retina if needed, but keeping it 1 is fine for soft dust)
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const particles: { x: number; y: number; size: number; speedX: number; speedY: number; opacity: number; angle: number; angleSpeed: number }[] = [];

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * (maxSize - minSize) + minSize,
        speedX: (Math.random() - 0.5) * 0.2, // slow horizontal drift
        speedY: (Math.random() - 1) * 0.3 - 0.1, // slowly drifts upwards
        opacity: Math.random() * 0.5 + 0.1, // base opacity
        angle: Math.random() * Math.PI * 2,
        angleSpeed: (Math.random() - 0.5) * 0.02, // glittering effect through opacity oscillation
      });
    }

    let animationFrameId: number;

    const render = () => {
      // Clear with transparent black
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        // Move
        p.x += p.speedX;
        p.y += p.speedY;

        // Oscillate angle for glitter
        p.angle += p.angleSpeed;

        // Wrap around
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height; // appear from bottom if they go up

        // Draw particle (silver/white glow)
        // Silver color: around 230, 230, 235
        const currentOpacity = p.opacity + Math.sin(p.angle) * 0.2;
        const clampedOpacity = Math.max(0, Math.min(1, currentOpacity)) * opacity;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(220, 220, 230, ${clampedOpacity})`;
        // Add subtle glow
        ctx.shadowBlur = p.size * 2;
        ctx.shadowColor = `rgba(255, 255, 255, ${clampedOpacity * 0.8})`;
        ctx.fill();
        ctx.shadowBlur = 0; // reset for next
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [particleCount, opacity, minSize, maxSize]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  );
};
