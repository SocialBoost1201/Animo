'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FadeIn } from '@/components/motion/FadeIn';

type TabType = 'today' | 'week';

export const ShiftTable: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('today');

  return (
    <div className="w-full">
      {/* Tabs */}
      <div className="flex justify-center mb-12">
        <div className="inline-flex bg-gray-100 p-1 rounded-sm">
          <button
            onClick={() => setActiveTab('today')}
            className={`px-8 py-3 text-sm font-bold tracking-widest uppercase rounded-sm transition-all duration-300 ${
              activeTab === 'today'
                ? 'bg-white text-[var(--color-gold)] shadow-sm'
                : 'text-gray-500 hover:text-[#171717]'
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setActiveTab('week')}
            className={`px-8 py-3 text-sm font-bold tracking-widest uppercase rounded-sm transition-all duration-300 ${
              activeTab === 'week'
                ? 'bg-white text-[var(--color-gold)] shadow-sm'
                : 'text-gray-500 hover:text-[#171717]'
            }`}
          >
            Weekly
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="relative min-h-[400px]">
        <AnimatePresence mode="wait">
          {activeTab === 'today' ? (
            <motion.div
              key="today"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-3xl mx-auto"
            >
              <div className="bg-white p-6 shadow-sm border border-gray-100 rounded-sm">
                <h3 className="text-center font-serif text-lg tracking-widest mb-6 pb-4 border-b border-gray-100 text-[#171717]">
                  {new Date().toLocaleDateString('ja-JP')} (Today)
                </h3>
                <ul className="divide-y divide-gray-50">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <li key={i} className="py-4 flex justify-between items-center hover:bg-gray-50 transition-colors px-4 rounded-sm">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs">
                          Img
                        </div>
                        <span className="font-serif text-lg text-[#171717]">Nanami {i + 1}</span>
                      </div>
                      <span className="text-sm font-bold text-[var(--color-gold)] font-sans">20:00 - L</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="week"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-white p-6 shadow-sm border border-gray-100 rounded-sm overflow-x-auto">
                <h3 className="text-center font-serif text-lg tracking-widest mb-6 pb-4 border-b border-gray-100 text-[#171717]">
                  Weekly Schedule
                </h3>
                <table className="w-full min-w-[600px] text-center">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="py-4 font-normal text-gray-500 tracking-wider text-sm">Cast</th>
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <th key={day} className="py-4 font-normal text-gray-500 tracking-wider text-sm">{day}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i} className="hover:bg-gray-50 transition-colors">
                        <td className="py-4 text-left px-4 font-serif text-[#171717] font-medium">Nanami {i + 1}</td>
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, j) => {
                          const isWorking = (i + j) % 3 !== 0;
                          return (
                            <td key={day} className="py-4 text-sm font-sans">
                              {isWorking ? (
                                <span className="text-[var(--color-gold)] font-bold border-b border-[var(--color-gold)]/30 pb-0.5">20:00 - L</span>
                              ) : (
                                <span className="text-gray-300">-</span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
