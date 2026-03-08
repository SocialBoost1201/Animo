'use client';

import React, { useState, MouseEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface RippleType {
  x: number;
  y: number;
  id: number;
}

export const Ripple = () => {
  const [ripples, setRipples] = useState<RippleType[]>([]);

  const addRipple = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const newRipple = { x, y, id: Date.now() };

    setRipples((prevRipples) => [...prevRipples, newRipple]);
  };

  const removeRipple = (id: number) => {
    setRipples((prev) => prev.filter((ripple) => ripple.id !== id));
  };

  return (
    <div
      className="absolute inset-0 overflow-hidden rounded-inherit z-0"
      onPointerDown={addRipple}
    >
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.span
            key={ripple.id}
            initial={{ top: ripple.y, left: ripple.x, scale: 0, opacity: 0.5 }}
            animate={{ scale: 30, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            onAnimationComplete={() => removeRipple(ripple.id)}
            className="absolute rounded-full bg-current pointer-events-none"
            style={{ width: 20, height: 20, marginTop: -10, marginLeft: -10 }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};
