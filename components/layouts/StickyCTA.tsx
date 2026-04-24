'use client';

import React, { useEffect, useState } from 'react';
import { Phone, CalendarDays, Instagram } from 'lucide-react';
import Link from 'next/link';

export const StickyCTA: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsVisible(window.scrollY > 150);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
      isVisible ? (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] md:hidden pb-safe">
          <div className="flex items-stretch h-16">
            {/* 電話 */}
            <a
              href="tel:045-263-6961"
              className="flex-1 flex flex-col items-center justify-center border-r border-gray-100 text-foreground hover:bg-gray-50 transition-colors"
            >
              <Phone className="w-5 h-5 mb-1" />
              <span className="text-xs uppercase luxury-tracking font-serif">Call</span>
            </a>

            {/* 本日の出勤 */}
            <Link
              href="/#today-cast"
              className="flex-1 flex flex-col items-center justify-center border-r border-gray-100 text-foreground hover:bg-gray-50 transition-colors"
            >
              <CalendarDays className="w-5 h-5 mb-1" />
              <span className="text-xs uppercase luxury-tracking font-serif">Today</span>
            </Link>

            {/* Instagram DM */}
            <a
              href="https://ig.me/m/kannai_club_animo"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex flex-col items-center justify-center border-r border-gray-100 text-foreground hover:bg-gray-50 transition-colors"
            >
              <Instagram className="w-5 h-5 mb-1" />
              <span className="text-xs uppercase luxury-tracking font-serif">DM</span>
            </a>

          </div>
        </div>
      ) : null
  );
};
