import React from 'react';
import { Toaster } from 'sonner';

export default function CastPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0b0d12]">
      {children}
      <Toaster position="top-center" richColors />
    </div>
  );
}
