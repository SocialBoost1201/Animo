'use client';

import { Toaster } from 'sonner';

export function AdminToaster() {
  return (
    <Toaster
      position="top-right"
      richColors
      duration={3000}
      toastOptions={{
        style: {
          fontFamily: 'var(--font-sans, sans-serif)',
          fontSize: '13px',
          borderRadius: '4px',
        },
        classNames: {
          toast: 'border border-gray-100 shadow-md',
        },
      }}
    />
  );
}
