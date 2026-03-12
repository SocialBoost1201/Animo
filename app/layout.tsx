import type { Metadata } from "next";
import {
  Cormorant_Garamond,
  Shippori_Mincho,
  Montserrat,
  Zen_Kaku_Gothic_New,
} from "next/font/google";
import "./globals.css";
import { Analytics } from "@/components/seo/Analytics";
import { LocalBusinessSchema } from "@/components/seo/LocalBusinessSchema";
import { ReviewSchema } from "@/components/seo/ReviewSchema";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { ReCaptchaProvider } from "@/components/providers/ReCaptchaProvider";
import { LuxuryBackground } from "@/components/ui/LuxuryBackground";
import { LoadingScreen } from "@/components/motion/LoadingScreen";
import { ToastContainer } from "@/components/ui/Toast";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const shippori = Shippori_Mincho({
  variable: "--font-shippori",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

const zenKaku = Zen_Kaku_Gothic_New({
  variable: "--font-zen-kaku",
  weight: ["300", "400", "500"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://club-animo.com'),
  title: {
    default: '関内キャバクラ CLUB Animo｜馬車道・横浜エリアの高級ラウンジ',
    template: '%s | CLUB Animo 関内キャバクラ',
  },
  alternates: {
    canonical: '/',
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
    images: ['/images/ogp.jpg'],
    url: 'https://club-animo.com',
    siteName: 'CLUB Animo',
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '関内キャバクラ CLUB Animo｜馬車道・横浜エリアの高級ラウンジ',
    description: '関内・馬車道エリアの高級キャバクラ「CLUB Animo」。洗練された空間と上質なキャストが大人の夜を演出します。',
    images: ['/images/ogp.jpg'],
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
        <ReviewSchema ratingValue={4.8} reviewCount={124} />
      </head>
      <body
        className={`${cormorant.variable} ${shippori.variable} ${montserrat.variable} ${zenKaku.variable} antialiased bg-background text-foreground overflow-x-hidden`}
      >
        <ReCaptchaProvider>
          <SmoothScrollProvider>
            <LoadingScreen />
            {children}
            <LuxuryBackground />
            <ToastContainer />
          </SmoothScrollProvider>
        </ReCaptchaProvider>
        <Analytics 
          gaId={process.env.NEXT_PUBLIC_GA_ID} 
          clarityId={process.env.NEXT_PUBLIC_CLARITY_ID} 
        />
      </body>
    </html>
  );
}
