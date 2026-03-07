import type { Metadata } from "next";
import {
  Playfair_Display,
  Noto_Serif_JP,
  Inter,
  Noto_Sans_JP,
} from "next/font/google";
import "./globals.css";
import { Analytics } from "@/components/seo/Analytics";
import { LocalBusinessSchema } from "@/components/seo/LocalBusinessSchema";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { LuxuryBackground } from "@/components/ui/LuxuryBackground";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const notoSerif = Noto_Serif_JP({
  variable: "--font-noto-serif",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const notoSans = Noto_Sans_JP({
  variable: "--font-noto-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://club-animo.com'),
  title: {
    default: 'Club Animo | 関内の高級キャバクラ',
    template: '%s | Club Animo 関内',
  },
  description:
    '関内の大人の社交場、Club Animo（クラブアニモ）。煌びやかなシャンデリアの下で特別な時間をお過ごしください。極上のキャストがおもてなしいたします。横浜・関内駅 徒歩5分。',
  keywords: [
    'Club Animo', 'クラブアニモ', 'キャバクラ', '関内', '横浜',
    '横浜キャバクラ', '関内キャバクラ', '高級キャバクラ', 'キャバ',
    '馬車道', '日本大通り', 'ナイトクラブ',
  ],
  openGraph: {
    title: 'Club Animo | 関内の高級キャバクラ',
    description:
      '関内の大人の社交場、Club Animo。煌びやかなシャンデリアの下で特別な時間を。横浜・関内駅 徒歩5分。',
    images: ['/images/ogp.jpg'],
    url: 'https://club-animo.com',
    siteName: 'Club Animo',
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Club Animo | 関内の高級キャバクラ',
    description: '関内の大人の社交場、Club Animo。煌びやかなシャンデリアの下で特別な時間を。横浜・関内駅 徒歩5分。',
    images: ['/images/ogp.jpg'],
  },
  alternates: {
    canonical: 'https://club-animo.com',
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
    <html lang="ja">
      <head>
        <LocalBusinessSchema />
      </head>
      <body
        className={`${playfair.variable} ${notoSerif.variable} ${inter.variable} ${notoSans.variable} antialiased bg-background text-foreground`}
      >
        <SmoothScrollProvider>
          {children}
          <LuxuryBackground />
        </SmoothScrollProvider>
        <Analytics 
          gaId={process.env.NEXT_PUBLIC_GA_ID} 
          clarityId={process.env.NEXT_PUBLIC_CLARITY_ID} 
        />
      </body>
    </html>
  );
}
