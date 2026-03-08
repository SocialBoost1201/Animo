'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Menu, X, ChevronDown } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Magnetic } from '@/components/motion/Magnetic';

const NAV_ITEMS = [
  { label: 'System', href: '/system' },
  { label: 'Cast', href: '/cast' },
  { label: 'Shift', href: '/shift' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Access', href: '/access' },
];

const RECRUIT_ITEMS = [
  { label: 'Cast 求人', href: '/recruit/cast' },
  { label: 'Staff 求人', href: '/recruit/staff' },
];

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRecruitOpen, setIsRecruitOpen] = useState(false);
  const [isMobileRecruitOpen, setIsMobileRecruitOpen] = useState(false);
  const pathname = usePathname();
  const recruitRef = useRef<HTMLDivElement>(null);
  const recruitTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
    setIsRecruitOpen(false);
    setIsMobileRecruitOpen(false);
  }, [pathname]);

  // Close recruit dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (recruitRef.current && !recruitRef.current.contains(e.target as Node)) {
        setIsRecruitOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRecruitEnter = () => {
    if (recruitTimeoutRef.current) clearTimeout(recruitTimeoutRef.current);
    setIsRecruitOpen(true);
  };

  const handleRecruitLeave = () => {
    recruitTimeoutRef.current = setTimeout(() => {
      setIsRecruitOpen(false);
    }, 200);
  };

  const isRecruitActive = pathname.startsWith('/recruit');

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
              className="font-serif luxury-tracking-super uppercase transition-colors duration-500 font-normal text-[#171717] text-lg"
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
                  'text-xs font-serif luxury-tracking uppercase transition-colors hover:text-gold',
                  pathname === item.href ? 'text-gold' : 'text-[#171717]'
                )}
              >
                {item.label}
              </Link>
            ))}

            {/* Recruit Dropdown (Desktop) */}
            <div
              ref={recruitRef}
              className="relative"
              onMouseEnter={handleRecruitEnter}
              onMouseLeave={handleRecruitLeave}
            >
              <button
                className={cn(
                  'text-xs font-serif luxury-tracking uppercase transition-colors hover:text-gold flex items-center gap-1',
                  isRecruitActive ? 'text-gold' : 'text-[#171717]'
                )}
                onClick={() => setIsRecruitOpen(!isRecruitOpen)}
              >
                Recruit
                <ChevronDown className={cn(
                  'w-3 h-3 transition-transform duration-200',
                  isRecruitOpen && 'rotate-180'
                )} />
              </button>

              <AnimatePresence>
                {isRecruitOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                    className="absolute top-full right-0 mt-3 w-48 bg-white/95 backdrop-blur-md border border-gold/20 shadow-lg overflow-hidden"
                  >
                    {RECRUIT_ITEMS.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          'block px-5 py-3 text-xs font-serif luxury-tracking text-[#171717] hover:bg-gold/10 hover:text-gold transition-colors border-b border-gold/10 last:border-b-0',
                          pathname === item.href && 'text-gold bg-gold/5'
                        )}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Magnetic strength={0.2} className="ml-4">
              <Link
                href="/reserve"
                className="block px-6 py-2 border border-gold text-gold text-xs font-serif luxury-tracking uppercase transition-all duration-500 hover:bg-gold hover:text-white"
              >
                Reserve
              </Link>
            </Magnetic>
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
            <div className="p-6 flex justify-between items-center border-b border-gray-100/50">
              <span className="font-serif luxury-tracking-super uppercase text-lg text-[#171717]">
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
                  className="text-sm font-serif luxury-tracking uppercase text-[#171717] border-b border-gray-100 pb-4"
                >
                  {item.label}
                </Link>
              ))}

              {/* Recruit (Mobile Accordion) */}
              <div className="border-b border-gray-100 pb-4">
                <button
                  className="text-sm font-serif luxury-tracking uppercase text-[#171717] w-full flex items-center justify-between"
                  onClick={() => setIsMobileRecruitOpen(!isMobileRecruitOpen)}
                >
                  Recruit
                  <ChevronDown className={cn(
                    'w-4 h-4 transition-transform duration-200',
                    isMobileRecruitOpen && 'rotate-180'
                  )} />
                </button>
                <AnimatePresence>
                  {isMobileRecruitOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-4 pl-4 space-y-4">
                        {RECRUIT_ITEMS.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                              'block text-sm font-serif luxury-tracking text-gray-500 hover:text-gold transition-colors',
                              pathname === item.href && 'text-gold'
                            )}
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="mt-8 flex flex-col gap-4">
                <Link
                  href="/reserve"
                  className="w-full text-center py-4 border border-gold text-gold text-xs font-serif luxury-tracking uppercase"
                >
                  Reserve
                </Link>
                <a
                  href="tel:045-263-6961"
                  className="w-full text-center py-4 border border-[#171717] text-[#171717] text-xs font-serif luxury-tracking uppercase"
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
