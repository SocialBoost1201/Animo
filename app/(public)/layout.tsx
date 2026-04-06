import React from "react";
import { Header } from "@/components/layouts/Header";
import { Footer } from "@/components/layouts/Footer";
import { StickyCTA } from "@/components/layouts/StickyCTA";
import { Analytics } from "@/components/seo/Analytics";
import { LocalBusinessSchema } from "@/components/seo/LocalBusinessSchema";
import { ReviewSchema } from "@/components/seo/ReviewSchema";
import { ToastContainer } from "@/components/ui/Toast";
import { DeferredLuxuryBackground } from "@/components/ui/DeferredLuxuryBackground";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <div className="flex flex-col min-h-screen relative">
      <LocalBusinessSchema />
      <ReviewSchema ratingValue={4.8} reviewCount={124} />
      <Header />
      <main className="flex-grow pt-24 md:pt-32 pb-[calc(6rem+env(safe-area-inset-bottom))] md:pb-0">
        {children}
      </main>
      <Footer />
      <StickyCTA />
      <DeferredLuxuryBackground />
      <ToastContainer />
      <Analytics
        gaId={process.env.NEXT_PUBLIC_GA_ID}
        clarityId={process.env.NEXT_PUBLIC_CLARITY_ID}
      />
    </div>
  );
}
