import React from "react";
import { Header } from "@/components/layouts/Header";
import { Footer } from "@/components/layouts/Footer";
import { StickyCTA } from "@/components/layouts/StickyCTA";
import { AvailabilityBanner } from "@/components/features/public/AvailabilityBanner";
import { createClient } from "@/lib/supabase/server";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // サーバー側で初期値を取得（Realtime購読はクライアント側で行う）
  const supabase = await createClient();
  const { data } = await supabase
    .from('site_settings')
    .select('availability')
    .eq('id', 1)
    .single();

  const availability = (data?.availability ?? 'available') as 'available' | 'limited' | 'full' | 'closed' | 'open';

  return (
    <div className="flex flex-col min-h-screen relative">
      <Header />
      <main className="flex-grow pt-24 md:pt-32 pb-24 md:pb-0">
        {children}
      </main>
      <Footer />
      <StickyCTA />
      <AvailabilityBanner initialAvailability={availability} />
    </div>
  );
}
