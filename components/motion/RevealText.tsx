'use client';

import React from 'react';
import { motion } from 'framer-motion';

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
  // 文字列を分割
  const characters = Array.from(text);

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: {
        staggerChildren: 0.04,
        delayChildren: delay,
      },
    }),
  };

  const child = {
    hidden: {
      opacity: 0,
      y: 20,
      rotateX: -45,
      filter: 'blur(10px)',
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      filter: 'blur(0px)',
      transition: {
        type: 'tween',
        ease: [0.16, 1, 0.3, 1], // Expo out
        duration: 1.5,
      },
    },
  };

  return (
    <motion.div
      style={{ display: 'inline-block', overflow: 'hidden' }}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: viewportOnce, margin: '-50px' }}
      // span は inline 要素のため block 的な処理が必要な場合あり
      className={`inline-flex flex-wrap ${className}`}
    >
      {characters.map((char, index) => (
        <motion.span
          variants={child}
          style={{ display: 'inline-block', whiteSpace: char === ' ' ? 'pre' : 'normal' }}
          key={index}
        >
          {char}
        </motion.span>
      ))}
    </motion.div>
  );
};
