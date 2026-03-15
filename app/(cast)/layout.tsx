import React from 'react';
import Link from 'next/link';
import { Toaster } from 'sonner';

export default function CastPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="flex items-center justify-between px-5 h-14">
          <Link href="/cast/dashboard" className="font-serif tracking-[0.3em] text-sm font-bold text-[#171717]">
            ANIMO <span className="text-gold">PORTAL</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-14">
        {children}
      </main>

      <Toaster position="top-center" richColors />
    </div>
  );
}
