'use client';

import { Toaster } from 'sonner';

export function GrowthAgentToaster() {
  return (
    <Toaster
      position="top-right"
      richColors
      duration={3500}
      toastOptions={{
        style: {
          fontFamily: 'var(--font-sans, sans-serif)',
          fontSize: '13px',
          borderRadius: '18px',
        },
      }}
    />
  );
}
