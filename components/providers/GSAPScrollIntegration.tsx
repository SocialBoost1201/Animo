'use client';

import { useEffect } from 'react';
import { useLenis } from 'lenis/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * LenisのスクロールイベントをGSAP ScrollTriggerに橋渡しするグローバル統合コンポーネント。
 * SmoothScrollProvider の内側かつ全ページで一度だけマウントすること。
 */
export function GSAPScrollIntegration() {
  const lenis = useLenis(({ scroll }) => {
    // Lenisのスクロール位置をGSAPに伝達
    ScrollTrigger.update();
  });

  useEffect(() => {
    if (!lenis) return;

    // LenisのscrollYをScrollTriggerに認識させる
    ScrollTrigger.scrollerProxy(document.documentElement, {
      scrollTop(value) {
        if (arguments.length && value !== undefined) {
          lenis.scrollTo(value, { immediate: true });
        }
        return lenis.scroll;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
      pinType: document.documentElement.style.transform ? 'transform' : 'fixed',
    });

    ScrollTrigger.addEventListener('refresh', () => lenis.resize());
    ScrollTrigger.refresh();

    return () => {
      ScrollTrigger.scrollerProxy(document.documentElement, undefined as never);
      ScrollTrigger.removeEventListener('refresh', () => lenis.resize());
    };
  }, [lenis]);

  return null;
}
