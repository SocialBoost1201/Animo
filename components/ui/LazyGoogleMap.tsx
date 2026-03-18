'use client';

import React, { useEffect, useRef, useState } from 'react';

interface LazyGoogleMapProps {
  src: string;
  title?: string;
  className?: string;
  width?: string | number;
  height?: string | number;
}

export function LazyGoogleMap({
  src,
  title = 'Google Map',
  className = '',
  width = '100%',
  height = '100%',
}: LazyGoogleMapProps) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' } // 画面に入る200px前にロード開始
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className={`w-full h-full bg-gray-100 animate-pulse ${className}`}>
      {isIntersecting && (
        <iframe
          title={title}
          src={src}
          width={width}
          height={height}
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="w-full h-full"
          onLoad={(e) => {
            // ロード完了後に背景のPulse効果を外す
            const target = e.target as HTMLIFrameElement;
            if (target.parentElement) {
              target.parentElement.classList.remove('bg-gray-100', 'animate-pulse');
            }
          }}
        />
      )}
    </div>
  );
}
