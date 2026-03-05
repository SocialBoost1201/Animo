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
        return { y: distance, opacity: 0 };
      case 'down':
        return { y: -distance, opacity: 0 };
      case 'left':
        return { x: distance, opacity: 0 };
      case 'right':
        return { x: -distance, opacity: 0 };
      case 'none':
      default:
        return { opacity: 0 };
    }
  };

  return (
    <motion.div
      initial={getInitialPosition()}
      whileInView={{ x: 0, y: 0, opacity: 1 }}
      viewport={{ once: viewportOnce, margin: '-50px' }}
      transition={{
        duration: duration,
        delay: delay,
        ease: [0.25, 0.1, 0.25, 1], // easeOutQuart 相当の上品なイージング
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};
