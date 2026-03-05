'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const NAV_ITEMS = [
  { label: 'System', href: '/system' },
  { label: 'Cast', href: '/cast' },
  { label: 'Shift', href: '/shift' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Access', href: '/access' },
  { label: 'Recruit', href: '/recruit/cast' },
];

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when pathname changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out',
          isScrolled
            ? 'bg-white/90 backdrop-blur-md shadow-sm py-3'
            : 'bg-transparent py-6'
        )}
      >
        <div className="container mx-auto px-6 lg:px-12 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <span
              className={cn(
                'font-serif tracking-widest uppercase transition-colors duration-300 font-bold',
                isScrolled ? 'text-[#171717] text-xl' : 'text-[#171717] text-2xl'
              )}
            >
              Club Animo
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'text-sm font-medium tracking-wider uppercase transition-colors hover:text-[var(--color-gold)] font-sans',
                  pathname === item.href
                    ? 'text-[var(--color-gold)] font-bold'
                    : 'text-[#171717]'
                )}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/reserve"
              className="ml-4 px-6 py-2 bg-[var(--color-gold)] text-white text-sm font-medium tracking-wider uppercase rounded-sm hover:-translate-y-0.5 transition-transform shadow-md"
            >
              Reserve
            </Link>
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-[#171717] p-2"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-0 z-[60] bg-white flex flex-col"
          >
            <div className="p-6 flex justify-between items-center border-b border-gray-100">
              <span className="font-serif tracking-widest uppercase text-xl text-[#171717] font-bold">
                Club Animo
              </span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-[#171717] p-2"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <nav className="flex-1 flex flex-col py-8 px-6 gap-6 overflow-y-auto">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-lg font-sans tracking-widest uppercase text-[#171717] border-b border-gray-50 pb-4"
                >
                  {item.label}
                </Link>
              ))}
              <div className="mt-8 flex flex-col gap-4">
                <Link
                  href="/reserve"
                  className="w-full text-center py-4 bg-[var(--color-gold)] text-white text-sm font-bold tracking-widest uppercase rounded-sm"
                >
                  Reserve
                </Link>
                <a
                  href="tel:045-xxxx-xxxx"
                  className="w-full text-center py-4 border border-[#171717] text-[#171717] text-sm font-bold tracking-widest uppercase rounded-sm"
                >
                  Call Now
                </a>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
