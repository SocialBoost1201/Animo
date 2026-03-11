import React from 'react';
import { Metadata } from 'next';
import { FadeIn } from '@/components/motion/FadeIn';
import { RevealText } from '@/components/motion/RevealText';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'English | CLUB Animo',
  description: 'Welcome to CLUB Animo, the finest luxury lounge in Kannai, Yokohama. Enjoy an unforgettable nightlife experience with our premium hospitality.',
};

export default function EnglishPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-32 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gold/10 via-transparent to-transparent opacity-50 z-0"></div>
      
      <section className="relative z-10 w-full px-6 flex flex-col items-center justify-center text-center">
        <FadeIn direction="down" delay={0.2}>
          <h1 className="text-gold font-serif text-3xl md:text-5xl mb-6 tracking-widest uppercase">
            <RevealText text="English Information" />
          </h1>
          <div className="w-px h-16 bg-linear-to-b from-gold to-transparent mx-auto mb-8 opacity-50" />
        </FadeIn>

        <FadeIn delay={0.4} className="max-w-2xl mx-auto space-y-6">
          <p className="text-white/80 font-sans leading-loose text-sm md:text-base">
            Welcome to CLUB Animo, the finest luxury lounge and cabaret in Kannai, Yokohama.
          </p>
          <p className="text-white/80 font-sans leading-loose text-sm md:text-base">
            We are currently preparing the full English version of our website to better serve our international guests.
            Please stay tuned for updates.
          </p>
          
          <div className="pt-12">
            <h2 className="text-gold font-serif text-xl mb-4 uppercase tracking-[0.2em]">Contact & Access</h2>
            <p className="text-white/70 font-sans text-sm md:text-base leading-loose mb-2">
              <strong>Address:</strong><br />
              [Insert Address Here], Yokohama, Japan<br />
              (2 minutes walk from Kannai Station)
            </p>
            <p className="text-white/70 font-sans text-sm md:text-base leading-loose">
              <strong>Phone:</strong><br />
              <a href="tel:08008888788" className="hover:text-gold transition-colors">0800-888-8788</a>
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.6} className="mt-16">
          <Link
            href="/"
            className="inline-block border border-gold/50 text-gold hover:bg-gold hover:text-white px-10 py-4 font-serif transition-colors text-sm tracking-widest uppercase"
          >
            Return to Japanese Top
          </Link>
        </FadeIn>
      </section>
    </div>
  );
}
