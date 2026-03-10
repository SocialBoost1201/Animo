'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

export const LoadingScreen = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // セッション内で1度だけ表示（再訪問時はスキップ）
    const hasVisited = sessionStorage.getItem('visited_animo');

    if (hasVisited) {
      setIsLoading(false);
      return;
    }

    // ロゴを3秒かけてフェードイン → その後0.8sかけてスクリーン自体をフェードアウト
    const timer = setTimeout(() => {
      setIsLoading(false);
      sessionStorage.setItem('visited_animo', 'true');
    }, 3800); // 3s logo fade-in + 0.8s screen fade-out buffer

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="loading"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#000',
          }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 3, ease: 'easeInOut' }}
          >
            <Image
              src="/Animo-logo2.png"
              alt="CLUB ANIMO"
              width={320}
              height={160}
              priority
              style={{ objectFit: 'contain' }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
