import React from "react";
import { Header } from "@/components/layouts/Header";
import { Footer } from "@/components/layouts/Footer";
import { StickyCTA } from "@/components/layouts/StickyCTA";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen relative">
      <Header />
      <main className="flex-grow pt-24 md:pt-32 pb-24 md:pb-0">
        {children}
      </main>
      <Footer />
      <StickyCTA />
    </div>
  );
}
