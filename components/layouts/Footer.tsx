import React from 'react';
import Link from 'next/link';
import { Instagram, MapPin, Phone } from 'lucide-react';
import { SilverDustBackground } from '@/components/motion/SilverDustBackground';

export const Footer = () => {
  return (
    <footer className="relative bg-[#111111] text-white pt-20 pb-12 mt-auto overflow-hidden">
      <SilverDustBackground particleCount={120} opacity={0.4} className="z-0" />
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          {/* Brand Info */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-block mb-8">
              <span className="font-serif luxury-tracking-super text-xl font-normal">
                CLUB Animo
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              関内の大人の社交場。煌びやかなシャンデリアの下で、特別な時間をお過ごしください。極上のキャストが最高の夜を演出いたします。
            </p>
            <div className="flex items-center space-x-4">
              <a
                href="https://www.instagram.com/kannai_club_animo/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://www.instagram.com/kannai_club_animo/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 text-xs font-serif luxury-tracking hover:text-gold transition-colors"
              >
                @kannai_club_animo
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-serif mb-8 uppercase luxury-tracking text-gold font-medium">
              Discover
            </h3>
            <ul className="space-y-5">
              <li><Link href="/concept" className="text-gray-400 hover:text-white transition-colors text-xs font-serif uppercase luxury-tracking">Concept</Link></li>
              <li><Link href="/guide" className="text-gray-400 hover:text-white transition-colors text-xs font-serif uppercase luxury-tracking">First Visit Guide</Link></li>
              <li><Link href="/system" className="text-gray-400 hover:text-white transition-colors text-xs font-serif uppercase luxury-tracking">System</Link></li>
              <li><Link href="/cast" className="text-gray-400 hover:text-white transition-colors text-xs font-serif uppercase luxury-tracking">Cast</Link></li>
              <li><Link href="/news" className="text-gray-400 hover:text-white transition-colors text-xs font-serif uppercase luxury-tracking">News</Link></li>
              <li><Link href="/shift" className="text-gray-400 hover:text-white transition-colors text-xs font-serif uppercase luxury-tracking">Today&apos;s Shift</Link></li>
              <li><Link href="/gallery" className="text-gray-400 hover:text-white transition-colors text-xs font-serif uppercase luxury-tracking">Gallery</Link></li>
              <li><Link href="/faq" className="text-gray-400 hover:text-white transition-colors text-xs font-serif uppercase luxury-tracking">FAQ</Link></li>
            </ul>
          </div>

          {/* Recruit Info */}
          <div>
            <h3 className="text-sm font-serif mb-8 uppercase luxury-tracking text-gold font-medium">
              Recruit
            </h3>
            <ul className="space-y-5">
              <li><Link href="/recruit/cast" className="text-gray-400 hover:text-white transition-colors text-xs font-serif uppercase luxury-tracking">Cast Recruit</Link></li>
              <li><Link href="/recruit/staff" className="text-gray-400 hover:text-white transition-colors text-xs font-serif uppercase luxury-tracking">Staff Recruit</Link></li>
              <li><Link href="/privacy" className="text-gray-400 hover:text-white transition-colors text-xs font-serif luxury-tracking">採用プライバシー</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-serif mb-8 uppercase luxury-tracking text-gold font-medium">
              Access
            </h3>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li className="flex items-start">
                <MapPin className="w-5 h-5 mr-3 mt-1 flex-shrink-0 text-gold" />
                <span>
                  〒231-0012<br />
                  神奈川県横浜市中区相生町３丁目５３<br />
                  グランドパークビル2F
                </span>
              </li>
              <li className="flex items-center mt-4">
                <Phone className="w-5 h-5 mr-3 flex-shrink-0 text-gold" />
                <a href="tel:045-263-6961" className="hover:text-white transition-colors">
                  045-263-6961
                </a>
              </li>
              <li className="mt-6 pt-6 border-t border-white/10">
                <p className="font-serif text-white luxury-tracking-super text-sm">OPEN 21:00 - LAST</p>
                <p className="text-xs uppercase mt-2 font-serif luxury-tracking text-gray-500">Closed on Sundays & Holidays</p>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal & Copyright */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-gray-500 text-xs text-center md:text-left space-y-1">
            <p>
              &copy; {new Date().getFullYear()}{' '}
              <Link href="/tokusho" className="hover:text-gray-300 transition-colors">株式会社KTG COBOMO</Link>
              {' '}（Club Animo）. All rights reserved.
            </p>
            <p>20歳未満の方のご入店はお断りしております。</p>
          </div>
          <div className="flex space-x-6 text-xs text-gray-500">
            <Link href="/tokusho" className="hover:text-white transition-colors">運営会社</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
