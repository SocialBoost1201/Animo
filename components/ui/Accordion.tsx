'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface AccordionItem {
  question: string;
  answer: string | React.ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
}

export const Accordion: React.FC<AccordionProps> = ({ items }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First item open by default

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div 
            key={index} 
            className="border border-gray-100 rounded-sm bg-white overflow-hidden shadow-sm"
          >
            {/* Header (Question) */}
            <button
              onClick={() => toggleItem(index)}
              className="w-full px-6 py-5 flex justify-between items-center bg-white hover:bg-gray-50 transition-colors text-left"
              aria-expanded={isOpen}
            >
              <h3 className="font-serif text-[#171717] md:text-lg pr-8">
                <span className="text-gold font-bold mr-3 font-sans">Q.</span>
                {item.question}
              </h3>
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="text-gray-400 flex-shrink-0"
              >
                <ChevronDown className="w-5 h-5" />
              </motion.div>
            </button>

            {/* Body (Answer) */}
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial="collapsed"
                  animate="open"
                  exit="collapsed"
                  variants={{
                    open: { opacity: 1, height: 'auto', marginBottom: 20 },
                    collapsed: { opacity: 0, height: 0, marginBottom: 0 },
                  }}
                  transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                >
                  <div className="px-6 pt-2 pb-5 text-gray-600 font-sans leading-relaxed flex items-start">
                    <span className="text-gray-400 font-bold mr-3 font-sans pt-0.5">A.</span>
                    <div>{item.answer}</div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};
