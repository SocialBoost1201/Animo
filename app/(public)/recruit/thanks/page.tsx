import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const TYPE_MESSAGES: Record<string, { heading: string; returnHref: string; returnLabel: string }> = {
  cast: {
    heading: 'キャスト応募が完了いたしました',
    returnHref: '/recruit/cast',
    returnLabel: 'キャスト応募ページへ戻る',
  },
  staff: {
    heading: 'スタッフ応募が完了いたしました',
    returnHref: '/recruit/staff',
    returnLabel: 'スタッフ応募ページへ戻る',
  },
  escort: {
    heading: 'エスコート応募が完了いたしました',
    returnHref: '/recruit/staff',
    returnLabel: 'エスコート応募ページへ戻る',
  },
};

const DEFAULT_MESSAGE = TYPE_MESSAGES.cast;

type Props = {
  searchParams: Promise<{ type?: string }>;
};

export default async function RecruitThanksPage({ searchParams }: Props) {
  const { type } = await searchParams;
  const msg = (type && TYPE_MESSAGES[type]) ? TYPE_MESSAGES[type] : DEFAULT_MESSAGE;

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6 py-32">
      <div className="w-full max-w-lg">

        {/* Card */}
        <div className="bg-white border border-gold/20 shadow-luxury p-12 md:p-16 text-center relative">

          {/* Gold top bar */}
          <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-gold/60 to-transparent" />

          {/* Icon */}
          <div className="w-16 h-16 rounded-full border border-gold/30 bg-gold/5 flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 className="w-7 h-7 text-gold" />
          </div>

          {/* Label */}
          <p className="text-gold font-serif luxury-tracking text-xs uppercase tracking-widest mb-4">
            Application Complete
          </p>

          {/* Heading */}
          <h1 className="text-xl md:text-2xl font-serif text-foreground luxury-tracking mb-6 leading-relaxed">
            {msg.heading}
          </h1>

          {/* Divider */}
          <div className="w-8 h-px bg-gold/40 mx-auto mb-6" />

          {/* Body */}
          <p className="text-gray-500 font-serif luxury-tracking text-xs leading-[2.8] mb-2">
            内容を確認のうえ、<br className="hidden sm:block" />
            3営業日以内を目安にご連絡いたします。
          </p>
          <p className="text-gray-400 font-serif luxury-tracking text-xs leading-loose">
            ご不明な点はお電話にてお問い合わせください。
          </p>

          {/* Actions */}
          <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg" className="text-xs font-serif luxury-tracking uppercase px-8">
              <Link href="/">トップへ戻る</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-xs font-serif luxury-tracking uppercase px-8">
              <Link href={msg.returnHref}>{msg.returnLabel}</Link>
            </Button>
          </div>

        </div>

        {/* Below card note */}
        <p className="mt-8 text-center text-xs text-gray-400 font-serif luxury-tracking">
          このページをブックマークする必要はありません。
        </p>

      </div>
    </div>
  );
}
