'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface FadeInProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  distance?: number;
  viewportOnce?: boolean;
}

export const FadeIn: React.FC<FadeInProps> = ({
  children,
  delay = 0,
  duration = 0.8,
  direction = 'up',
  distance = 30,
  viewportOnce = true,
  className,
  ...props
}) => {
  const getInitialPosition = () => {
    switch (direction) {
      case 'up':
        return { y: distance, opacity: 0, filter: 'blur(12px)' };
      case 'down':
        return { y: -distance, opacity: 0, filter: 'blur(12px)' };
      case 'left':
        return { x: distance, opacity: 0, filter: 'blur(12px)' };
      case 'right':
        return { x: -distance, opacity: 0, filter: 'blur(12px)' };
      case 'none':
      default:
        return { opacity: 0, filter: 'blur(12px)' };
    }
  };

  return (
    <motion.div
      initial={getInitialPosition()}
      whileInView={{ x: 0, y: 0, opacity: 1, filter: 'blur(0px)' }}
      viewport={{ once: viewportOnce, margin: '-50px' }}
      transition={{
        duration: duration,
        delay: delay,
        ease: [0.16, 1, 0.3, 1], // Expo Out近似の最高級イージング
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};
