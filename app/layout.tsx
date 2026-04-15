import type { Metadata } from "next";
import { Noto_Sans_JP, Noto_Sans_Lao } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const notoSansLao = Noto_Sans_Lao({
  variable: "--font-noto-lao",
  weight: ["400", "700"],
  subsets: ["latin", "lao"],
  display: 'swap',
});

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://club-animo.jp'),
  title: {
    default: '関内キャバクラ CLUB Animo｜馬車道・横浜エリアの高級ラウンジ',
    template: '%s | CLUB Animo 関内キャバクラ',
  },
  alternates: {
    canonical: './',
    languages: {
      'ja': '/',
      'en': '/en',
    },
  },
  description:
    '関内・馬車道エリアの高級キャバクラ「CLUB Animo」。洗練された空間と上質なキャストが大人の夜を演出します。料金システムや在籍キャスト、出勤情報を掲載。',
  keywords: [
    'Club Animo', 'クラブアニモ', 'キャバクラ', '関内', '横浜',
    '横浜キャバクラ', '関内キャバクラ', '高級キャバクラ', 'キャバ',
    '馬車道', '日本大通り', 'ナイトクラブ',
  ],
  openGraph: {
    title: '関内キャバクラ CLUB Animo｜馬車道・横浜エリアの高級ラウンジ',
    description:
      '関内・馬車道エリアの高級キャバクラ「CLUB Animo」。洗練された空間と上質なキャストが大人の夜を演出します。',
    images: ['/images/ogp.webp'],
    siteName: 'CLUB Animo',
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '関内キャバクラ CLUB Animo｜馬車道・横浜エリアの高級ラウンジ',
    description: '関内・馬車道エリアの高級キャバクラ「CLUB Animo」。洗練された空間と上質なキャストが大人の夜を演出します。',
    images: ['/images/ogp.webp'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={cn("font-sans", notoSansLao.variable, notoSansJP.variable)} suppressHydrationWarning>
      <head />
      <body
        className={`${notoSansLao.variable} ${notoSansJP.variable} antialiased bg-background text-foreground overflow-x-hidden`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
