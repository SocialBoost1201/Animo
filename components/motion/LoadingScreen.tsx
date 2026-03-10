'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const LoadingScreen = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Has the user visited already?
    const hasVisited = sessionStorage.getItem('visited_animo');
    
    if (hasVisited) {
      // setTimeoutを使って同期的なsetStateによる警告を回避
      const immediateTimer = setTimeout(() => setIsLoading(false), 0);
      return () => clearTimeout(immediateTimer);
    }

    // Hide loading screen after artificial delay for the very first visit
    const timer = setTimeout(() => {
      setIsLoading(false);
      sessionStorage.setItem('visited_animo', 'true');
    }, 2800); // 2.8s total loading experience

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="loading"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-black"
        >
          <div className="relative flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
              className="mb-8"
            >
              {/* Luxury Logo Display */}
              <h1 className="font-serif text-3xl md:text-5xl tracking-[0.3em] uppercase text-white font-medium">
                Club Animo
              </h1>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="flex items-center gap-4"
            >
              <div className="w-px h-4 bg-gold/50" />
              <p className="font-serif text-[10px] md:text-xs tracking-[0.4em] text-gold uppercase whitespace-nowrap">
                関内の大人の社交場
              </p>
              <div className="w-px h-4 bg-gold/50" />
            </motion.div>

            {/* Subtle loading indicator */}
            <motion.div 
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 2, ease: "easeInOut" }}
              className="absolute -bottom-12 w-full h-px bg-linear-to-r from-transparent via-gold to-transparent origin-left"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
