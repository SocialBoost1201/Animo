'use client';

import React, { useEffect, useState } from 'react';
import { Phone, CalendarHeart, Instagram } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export const StickyCTA: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show sticky CTA after scrolling down slightly
    const handleScroll = () => {
      setIsVisible(window.scrollY > 150);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 100 }}
          className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] md:hidden pb-safe"
        >
          <div className="flex items-stretch h-16">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex flex-col items-center justify-center border-r border-gray-200 text-[#171717] hover:bg-gray-50 transition-colors"
            >
              <Instagram className="w-5 h-5 mb-1" />
              <span className="text-[10px] uppercase tracking-wider font-bold">DM</span>
            </a>
            
            <a
              href="tel:045-xxxx-xxxx"
              className="flex-1 flex flex-col items-center justify-center border-r border-gray-200 text-[#171717] hover:bg-gray-50 transition-colors"
            >
              <Phone className="w-5 h-5 mb-1" />
              <span className="text-[10px] uppercase tracking-wider font-bold">Call</span>
            </a>
            
            <Link
              href="/reserve"
              className="flex-[1.5] flex flex-col items-center justify-center bg-[var(--color-gold)] text-white hover:brightness-110 transition-all font-bold"
            >
              <CalendarHeart className="w-5 h-5 mb-1" />
              <span className="text-[10px] uppercase tracking-wider">Reserve</span>
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
