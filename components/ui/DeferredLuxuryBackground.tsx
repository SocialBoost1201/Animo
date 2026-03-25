'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';

const LuxuryBackground = dynamic(
  () => import('@/components/ui/LuxuryBackground').then((m) => m.LuxuryBackground),
  { ssr: false }
);

export function DeferredLuxuryBackground() {
  const pathname = usePathname();
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const isLightPage =
      pathname?.startsWith('/cast') || pathname?.startsWith('/admin');

    if (isLightPage || window.innerWidth < 768) {
      return;
    }

    if ('requestIdleCallback' in window && 'cancelIdleCallback' in window) {
      const id = window.requestIdleCallback(() => setEnabled(true));
      return () => window.cancelIdleCallback(id);
    }

    const timeoutId = setTimeout(() => setEnabled(true), 1200);
    return () => clearTimeout(timeoutId);
  }, [pathname]);

  if (!enabled) {
    return null;
  }

  return <LuxuryBackground />;
}
