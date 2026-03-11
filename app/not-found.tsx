import Link from 'next/link';
import type { Metadata } from 'next';
import { CalendarHeart, Home, MessageSquare } from 'lucide-react';

export const metadata: Metadata = {
  title: 'ページが見つかりません | CLUB Animo',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0c0c0c] flex flex-col items-center justify-center px-6 text-center relative overflow-hidden">
      {/* 背景装飾 */}
      <div className="absolute inset-0 bg-[url('/images/animo-stone-logo-wall.jpg')] bg-cover bg-center opacity-5" />
      <div className="absolute inset-0 bg-linear-to-b from-black/80 via-transparent to-black/80" />

      <div className="relative z-10 space-y-8 max-w-lg">
        {/* 404 */}
        <div>
          <p className="text-gold font-serif tracking-[0.5em] text-sm uppercase mb-4">Page Not Found</p>
          <h1 className="text-[120px] md:text-[160px] font-serif text-white/10 leading-none select-none">
            404
          </h1>
          <div className="w-16 h-px bg-gold/40 mx-auto my-6" />
          <p className="text-white/60 font-serif tracking-widest text-sm leading-loose">
            ご指定のページは存在しないか、<br />
            移動・削除された可能性がございます。
          </p>
        </div>

        {/* CTA群 */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gold text-black text-xs font-bold tracking-widest uppercase hover:bg-white transition-colors"
          >
            <Home size={14} />
            トップページへ
          </Link>
          <Link
            href="/reserve"
            className="flex items-center justify-center gap-2 px-6 py-3 border border-white/20 text-white/70 text-xs tracking-widest uppercase hover:border-gold hover:text-gold transition-colors font-serif"
          >
            <CalendarHeart size={14} />
            ご予約はこちら
          </Link>
          <Link
            href="/cast"
            className="flex items-center justify-center gap-2 px-6 py-3 border border-white/20 text-white/70 text-xs tracking-widest uppercase hover:border-gold hover:text-gold transition-colors font-serif"
          >
            <MessageSquare size={14} />
            キャスト一覧
          </Link>
        </div>

        {/* ロゴ */}
        <p className="text-white/20 font-serif tracking-[0.4em] text-xs uppercase">
          CLUB Animo — Kannai
        </p>
      </div>
    </div>
  );
}
