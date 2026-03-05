'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlaceholderImage } from '@/components/ui/PlaceholderImage';
import { X, ZoomIn } from 'lucide-react';
import { StaggerList } from '@/components/motion/StaggerList';

interface GalleryItem {
  id: string;
  category: 'chandelier' | 'vip' | 'floor';
  caption: string;
}

const GALLERY_ITEMS: GalleryItem[] = [
  { id: '1', category: 'chandelier', caption: 'Main Chandelier' },
  { id: '2', category: 'floor', caption: 'Main Floor' },
  { id: '3', category: 'vip', caption: 'VIP Room A' },
  { id: '4', category: 'floor', caption: 'Bar Counter' },
  { id: '5', category: 'vip', caption: 'VIP Room B' },
  { id: '6', category: 'floor', caption: 'Hallway' },
  { id: '7', category: 'chandelier', caption: 'Lighting Detail' },
  { id: '8', category: 'floor', caption: 'Entrance' },
];

export const GalleryGrid: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  return (
    <>
      <StaggerList 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
        staggerDelay={0.05}
      >
        {GALLERY_ITEMS.map((item) => (
          <div 
            key={item.id} 
            className="group relative cursor-pointer overflow-hidden rounded-sm shadow-sm"
            onClick={() => setSelectedItem(item)}
          >
            <PlaceholderImage 
              ratio="3:2" 
              alt={item.caption} 
              placeholderText={item.caption}
              className="group-hover:scale-110 transition-transform duration-700 ease-out h-[250px] sm:h-auto"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center">
              <ZoomIn className="text-white w-8 h-8 mb-2" />
              <span className="text-white font-serif tracking-widest text-sm drop-shadow-md">
                {item.caption}
              </span>
            </div>
          </div>
        ))}
      </StaggerList>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-safe"
            onClick={() => setSelectedItem(null)}
          >
            <button
              className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors p-2"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedItem(null);
              }}
            >
              <X className="w-8 h-8" />
            </button>
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-w-6xl w-full h-[80vh] flex flex-col items-center justify-center px-4 md:px-12"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-full relative h-full flex items-center justify-center">
                 <PlaceholderImage 
                  ratio="16:9" 
                  alt={selectedItem.caption} 
                  placeholderText={selectedItem.caption}
                  className="max-h-[70vh] w-auto max-w-full object-contain shadow-2xl"
                />
              </div>
              <p className="text-white/80 font-serif tracking-widest mt-6 text-lg md:text-xl">
                {selectedItem.caption}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
