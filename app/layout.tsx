import type { Metadata } from "next";
import {
  Playfair_Display,
  Noto_Serif_JP,
  Inter,
  Noto_Sans_JP,
} from "next/font/google";
import "./globals.css";

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
  title: "Club Animo | 関内の高級キャバクラ",
  description:
    "関内の大人の社交場、Club Animo（クラブアニモ）。煌びやかなシャンデリアの下で特別な時間をお過ごしください。極上のキャストがおもてなしいたします。",
  openGraph: {
    title: "Club Animo | 関内の高級キャバクラ",
    description:
      "関内の大人の社交場、Club Animo（クラブアニモ）。煌びやかなシャンデリアの下で特別な時間をお過ごしください。極上のキャストがおもてなしいたします。",
    images: ["/images/ogp.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${playfair.variable} ${notoSerif.variable} ${inter.variable} ${notoSans.variable} antialiased bg-background text-foreground`}
      >
        {children}
      </body>
    </html>
  );
}
