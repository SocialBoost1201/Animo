'use client';

import React, { useEffect, useState } from 'react';
import { Phone, CalendarDays, CalendarHeart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export const StickyCTA: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsVisible(window.scrollY > 150);
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
            {/* 電話 */}
            <a
              href="tel:045-263-6961"
              className="flex-1 flex flex-col items-center justify-center border-r border-gray-100 text-[#171717] hover:bg-gray-50 transition-colors"
            >
              <Phone className="w-5 h-5 mb-1" />
              <span className="text-[9px] uppercase luxury-tracking font-serif">Call</span>
            </a>

            {/* 本日の出勤 */}
            <Link
              href="/shift"
              className="flex-1 flex flex-col items-center justify-center border-r border-gray-100 text-[#171717] hover:bg-gray-50 transition-colors"
            >
              <CalendarDays className="w-5 h-5 mb-1" />
              <span className="text-[9px] uppercase luxury-tracking font-serif">Today</span>
            </Link>

            {/* WEB予約 */}
            <Link
              href="/reserve"
              className="flex-[1.5] flex flex-col items-center justify-center bg-[var(--color-gold)] text-white hover:bg-[#171717] transition-all duration-500 btn-sheen"
            >
              <CalendarHeart className="w-5 h-5 mb-1" />
              <span className="text-[9px] uppercase luxury-tracking font-serif">Reserve</span>
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
