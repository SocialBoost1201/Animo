import React from 'react';
import { FadeIn } from '@/components/motion/FadeIn';
import { RevealText } from '@/components/motion/RevealText';
import { Accordion } from '@/components/ui/Accordion';

import { FAQ_CATEGORIES } from '@/lib/data/faq';

export const metadata = {
  title: 'FAQ | Club Animo',
  description: 'Club Animoのご利用に関するよくある質問。初めての方でも安心してご利用いただけます。',
  alternates: {
    canonical: '/faq',
  },
};

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-[var(--color-gray-light)] pb-32">
      {/* Header Section */}
      <section className="bg-white pt-12 pb-16 px-6 border-b border-gray-100">
        <div className="container mx-auto">
          <FadeIn direction="down" className="text-center">
            <h1 className="text-gold font-serif text-3xl md:text-5xl mb-4 tracking-widest uppercase">
              <RevealText text="FAQ" />
            </h1>
            <p className="text-[#171717] font-sans tracking-[0.2em] text-sm md:text-base uppercase">
              よくある質問
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-4 md:px-6">
        <div className="container mx-auto max-w-4xl">
          <FadeIn delay={0.2} className="mb-12 text-center">
            <p className="text-sm md:text-base text-gray-600 leading-loose max-w-2xl mx-auto">
              お客様からよくいただくご質問をまとめました。<br />
              掲載されていない内容につきましては、お電話またはお問い合わせフォームよりお気軽にご連絡ください。
            </p>
          </FadeIn>

          <FadeIn delay={0.4}>
            {/* Structured Data for SEO / GEO */}
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "FAQPage",
                  "mainEntity": FAQ_CATEGORIES.flatMap(cat => cat.items).map(item => ({
                    "@type": "Question",
                    "name": item.question,
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": item.answer
                    }
                  }))
                })
              }}
            />
            
            <div className="space-y-16">
              {FAQ_CATEGORIES.map((category) => (
                <div key={category.title}>
                  <h2 className="text-xl font-serif text-[#171717] mb-8 text-center flex items-center justify-center gap-4">
                    <span className="w-8 h-px bg-gold/50"></span>
                    <span className="tracking-widest">{category.title}</span>
                    <span className="w-8 h-px bg-gold/50"></span>
                  </h2>
                  <Accordion items={category.items} />
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
