'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ParallaxHeroProps {
  imageUrl: string;
  title: string;
  subtitle: string;
}

export const ParallaxHero: React.FC<ParallaxHeroProps> = ({
  imageUrl,
  title,
  subtitle,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  // スクロール時のパララックス効果
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  return (
    <div
      ref={ref}
      className="relative h-screen w-full overflow-hidden bg-black flexItems-center justify-center"
    >
      {/* Background Image with Parallax & Zoom */}
      <motion.div
        style={{ y, scale }}
        className="absolute inset-0 z-0"
      >
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
        {/* Overlay gradient for text readability */}
        <div className="absolute inset-0 bg-linear-to-b from-black/40 via-black/20 to-white/90" />
      </motion.div>

      {/* Content */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4"
      >
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.8, ease: "easeOut" }}
          className="text-white font-serif tracking-widest text-4xl md:text-6xl lg:text-7xl font-bold mb-6 drop-shadow-lg"
        >
          {title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 1.2, ease: "easeOut" }}
          className="text-white/90 font-sans tracking-[0.2em] text-sm md:text-base max-w-lg leading-loose drop-shadow-md"
        >
          {subtitle.split('\n').map((line, i) => (
            <React.Fragment key={i}>
              {line}
              <br />
            </React.Fragment>
          ))}
        </motion.p>
      </motion.div>
      
      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.0, duration: 1 }}
        className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center"
      >
        <span className="text-white/70 text-[10px] uppercase luxury-tracking mb-3 font-serif">Scroll</span>
        <motion.div 
          animate={{ height: [0, 48, 0], opacity: [0, 1, 0], y: [0, 24, 48] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          className="w-px h-12 bg-linear-to-b from-white to-transparent"
        />
      </motion.div>
    </div>
  );
};
