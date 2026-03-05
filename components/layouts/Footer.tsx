import React from 'react';
import Link from 'next/link';
import { Instagram, MapPin, Phone } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-[#111111] text-white pt-20 pb-12 mt-auto">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          {/* Brand Info */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-block mb-6">
              <span className="font-serif tracking-widest uppercase text-2xl font-bold">
                Club Animo
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              関内の大人の社交場。煌びやかなシャンデリアの下で、特別な時間をお過ごしください。極上のキャストが最高の夜を演出いたします。
            </p>
            <div className="flex space-x-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[var(--color-gold)] transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-serif mb-6 uppercase tracking-wider text-[var(--color-gold)]">
              Discover
            </h3>
            <ul className="space-y-4">
              <li><Link href="/system" className="text-gray-400 hover:text-white transition-colors text-sm uppercase tracking-wider">System</Link></li>
              <li><Link href="/cast" className="text-gray-400 hover:text-white transition-colors text-sm uppercase tracking-wider">Cast</Link></li>
              <li><Link href="/shift" className="text-gray-400 hover:text-white transition-colors text-sm uppercase tracking-wider">Today&apos;s Shift</Link></li>
              <li><Link href="/gallery" className="text-gray-400 hover:text-white transition-colors text-sm uppercase tracking-wider">Gallery</Link></li>
            </ul>
          </div>

          {/* Recruit Info */}
          <div>
            <h3 className="text-lg font-serif mb-6 uppercase tracking-wider text-[var(--color-gold)]">
              Recruit
            </h3>
            <ul className="space-y-4">
              <li><Link href="/recruit/cast" className="text-gray-400 hover:text-white transition-colors text-sm uppercase tracking-wider">Cast Recruit</Link></li>
              <li><Link href="/recruit/staff" className="text-gray-400 hover:text-white transition-colors text-sm uppercase tracking-wider">Staff Recruit</Link></li>
              <li><Link href="/privacy" className="text-gray-400 hover:text-white transition-colors text-sm">採用プライバシーポリシー</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-serif mb-6 uppercase tracking-wider text-[var(--color-gold)]">
              Access
            </h3>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li className="flex items-start">
                <MapPin className="w-5 h-5 mr-3 mt-1 flex-shrink-0 text-[var(--color-gold)]" />
                <span>
                  〒231-0014<br />
                  神奈川県横浜市中区常盤町X-X-X<br />
                  アニモビル X階
                </span>
              </li>
              <li className="flex items-center mt-4">
                <Phone className="w-5 h-5 mr-3 flex-shrink-0 text-[var(--color-gold)]" />
                <a href="tel:045-xxxx-xxxx" className="hover:text-white transition-colors">
                  045-XXXX-XXXX
                </a>
              </li>
              <li className="mt-4 pt-4 border-t border-white/10">
                <p className="font-serif text-white tracking-widest">OPEN 20:00 - LAST</p>
                <p className="text-xs uppercase mt-1">Closed on Sundays & Holidays</p>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal & Copyright */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-xs text-center md:text-left">
            &copy; {new Date().getFullYear()} Club Animo. All rights reserved. <br className="md:hidden" />
            <span className="md:ml-2">20歳未満の方のご入店はお断りしております。</span>
          </p>
          <div className="flex space-x-6 text-xs text-gray-500">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
