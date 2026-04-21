'use client';

import React, { useId, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { Magnetic } from '@/components/motion/Magnetic';
import { RevealText } from '@/components/motion/RevealText';
import { GsapRevealTitle } from '@/components/motion/GsapRevealTitle';
import { StaggerList } from '@/components/motion/StaggerList';
import { SilverDustBackground } from '@/components/motion/SilverDustBackground';
import {
  Sparkles,
  Gauge,
  Monitor,
  Smartphone,
  Wand2,
  Eye,
  Layers,
  BadgeCheck,
} from 'lucide-react';

type FrameMode = 'desktop' | 'mobile';
type RiskLevel = 'low' | 'medium' | 'high';

type DemoNote = {
  label: string;
  value: string;
};

type HeroDemo = {
  id: string;
  title: string;
  summary: string;
  library: string;
  character: string;
  risk: RiskLevel;
  fit: string;
  recommended?: boolean;
  overlay?: 'dust' | 'sweep' | 'gradient' | 'glow';
  mode?: 'title' | 'cta' | 'parallax';
};

type ScrollDemo = {
  id: string;
  title: string;
  summary: string;
  library: string;
  character: string;
  risk: RiskLevel;
  fit: string;
  recommended?: boolean;
  mode: 'fade' | 'stagger' | 'title' | 'parallax' | 'magnetic';
};

const heroDemos: HeroDemo[] = [
  {
    id: 'hero-title',
    title: 'Video + Title Reveal',
    summary: '動画は即表示し、タイトルだけを静かに立ち上げる王道パターン。',
    library: 'RevealText / GsapRevealTitle / Framer Motion',
    character: '重厚・静謐・高級感',
    risk: 'low',
    fit: 'トップの第一印象を整えたい時',
    mode: 'title',
  },
  {
    id: 'hero-dust',
    title: 'Video + Soft Dust',
    summary: '映像の上にごく薄い粒子を重ねて、空気感と余韻を作る。',
    library: 'SilverDustBackground',
    character: '艶・空気感・余韻',
    risk: 'medium',
    fit: 'Animo のラグジュアリー感を最も自然に補強',
    recommended: true,
    overlay: 'dust',
  },
  {
    id: 'hero-sweep',
    title: 'Video + Light Sweep',
    summary: '光が横切るようなハイライトで、ブランドの華やかさを出す。',
    library: 'Framer Motion / CSS gradient',
    character: '華やか・洗練・印象強め',
    risk: 'medium',
    fit: 'イベント時や短期の印象強化',
    overlay: 'sweep',
  },
  {
    id: 'hero-cta',
    title: 'Video + Staggered CTA',
    summary: 'コピーよりも行動導線を上品に見せる運用重視パターン。',
    library: 'StaggerList / Magnetic',
    character: '実用・上品・操作感',
    risk: 'low',
    fit: '出勤確認・料金確認など行動導線を強めたい時',
    mode: 'cta',
  },
  {
    id: 'hero-parallax',
    title: 'Video + Parallax Depth',
    summary: '前景と背景の奥行きを少しだけずらし、没入感を出す。',
    library: 'Framer Motion / ParallaxHero pattern',
    character: '没入感・深さ・映画的',
    risk: 'medium',
    fit: '特集ページやブランド訴求が強い場面',
    mode: 'parallax',
    overlay: 'glow',
  },
];

const scrollDemos: ScrollDemo[] = [
  {
    id: 'scroll-fade',
    title: 'Fade Reveal',
    summary: '要素を静かに見せる最も安全な基本演出。',
    library: 'FadeIn pattern / Framer Motion',
    character: '上品・無難・汎用',
    risk: 'low',
    fit: '本文セクション全般',
    recommended: true,
    mode: 'fade',
  },
  {
    id: 'scroll-stagger',
    title: 'Stagger List',
    summary: 'カードや特徴一覧を順番に出して密度を上げる。',
    library: 'StaggerList',
    character: '整理・テンポ・情報密度',
    risk: 'low',
    fit: '特徴一覧やFAQ導入',
    mode: 'stagger',
  },
  {
    id: 'scroll-title',
    title: 'Title Reveal',
    summary: 'セクション見出しだけを少し特別に見せる。',
    library: 'GsapRevealTitle / RevealText',
    character: '品格・演出感・見出し映え',
    risk: 'low',
    fit: '主要見出しや章区切り',
    mode: 'title',
  },
  {
    id: 'scroll-parallax',
    title: 'Parallax Block',
    summary: '画像や装飾を本文と別速度で動かして立体感を出す。',
    library: 'Framer Motion useScroll',
    character: '奥行き・余韻・高級感',
    risk: 'medium',
    fit: '店舗空間の見せ場や特集節',
    mode: 'parallax',
  },
  {
    id: 'scroll-magnetic',
    title: 'Magnetic CTA',
    summary: 'ボタンに微かな吸い付き感を持たせ、手触りを上げる。',
    library: 'Magnetic',
    character: '手触り・上質・控えめ',
    risk: 'low',
    fit: '主要CTAだけに限定利用',
    mode: 'magnetic',
  },
];

function riskClasses(level: RiskLevel) {
  if (level === 'low') return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200';
  if (level === 'medium') return 'border-amber-500/30 bg-amber-500/10 text-amber-200';
  return 'border-rose-500/30 bg-rose-500/10 text-rose-200';
}

function FrameShell({
  mode,
  children,
  className,
}: {
  mode: FrameMode;
  children: React.ReactNode;
  className?: string;
}) {
  const mobile = mode === 'mobile';

  return (
    <div
      className={cn(
        'mx-auto overflow-hidden rounded-[28px] border border-white/10 bg-[#0f1014] shadow-[0_30px_90px_rgba(0,0,0,0.45)]',
        mobile ? 'max-w-[390px]' : 'max-w-[1120px]',
        className
      )}
    >
      <div className="flex items-center justify-between border-b border-white/10 bg-[#14161c] px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff6b6b]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#f4d35e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#55d187]" />
        </div>
        <div className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[10px] uppercase tracking-[0.28em] text-[#bfb7aa]">
          {mobile ? 'Mobile Frame' : 'Desktop Frame'}
        </div>
      </div>
      <div className={cn('bg-[#111318]', mobile ? 'px-3 py-3' : 'px-4 py-4')}>{children}</div>
    </div>
  );
}

function AnnotationCard({
  library,
  character,
  risk,
  fit,
  recommended,
}: {
  library: string;
  character: string;
  risk: RiskLevel;
  fit: string;
  recommended?: boolean;
}) {
  const notes: DemoNote[] = [
    { label: 'Libraries', value: library },
    { label: 'Character', value: character },
    { label: 'Best Fit', value: fit },
  ];

  return (
    <div className="space-y-3 rounded-[20px] border border-white/10 bg-[#151820] p-4">
      <div className="flex items-center justify-between gap-3">
        <span className={cn('rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-[0.24em]', riskClasses(risk))}>
          Risk: {risk}
        </span>
        {recommended ? (
          <span className="inline-flex items-center gap-1 rounded-full border border-[#dfbd69]/30 bg-[#dfbd69]/12 px-2.5 py-1 text-[10px] uppercase tracking-[0.24em] text-[#f5deb0]">
            <BadgeCheck className="h-3.5 w-3.5" />
            Recommended
          </span>
        ) : null}
      </div>
      <div className="space-y-2">
        {notes.map((note) => (
          <div key={note.label} className="rounded-2xl border border-white/6 bg-white/[0.02] px-3 py-2.5">
            <p className="text-[10px] uppercase tracking-[0.24em] text-[#918778]">{note.label}</p>
            <p className="mt-1 text-xs leading-relaxed text-[#e2ddd4]">{note.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function HeroPreview({
  demo,
  animationsEnabled,
  reducedMotion,
}: {
  demo: HeroDemo;
  animationsEnabled: boolean;
  reducedMotion: boolean;
}) {
  const motionAllowed = animationsEnabled && !reducedMotion;
  const id = useId();

  return (
    <div className="overflow-hidden rounded-[24px] border border-white/10 bg-[#151821]">
      <div className="flex items-center justify-between border-b border-white/8 px-5 py-4">
        <div>
          <h3 className="text-sm font-semibold text-[#f4f1ea]">{demo.title}</h3>
          <p className="mt-1 text-xs leading-relaxed text-[#9f988c]">{demo.summary}</p>
        </div>
      </div>

      <div className="grid gap-0 lg:grid-cols-[minmax(0,1.55fr)_320px]">
        <div className="relative min-h-[420px] overflow-hidden bg-black">
          <video
            className={cn(
              'absolute inset-0 h-full w-full object-cover',
              motionAllowed && demo.mode === 'parallax' ? 'scale-[1.08]' : 'scale-100'
            )}
            autoPlay
            muted
            loop
            playsInline
            poster="/images/animo-main-chandelier-hero-poster.webp"
          >
            <source src="/videos/movie01_chandelier.mp4" type="video/mp4" />
          </video>

          <div className="absolute inset-0 bg-linear-to-b from-black/35 via-black/40 to-black/75" />

          {demo.overlay === 'dust' && motionAllowed ? (
            <SilverDustBackground particleCount={28} opacity={0.5} minSize={1} maxSize={2.8} />
          ) : null}

          {demo.overlay === 'sweep' ? (
            <motion.div
              className="absolute inset-y-0 left-[-30%] w-[40%] bg-linear-to-r from-transparent via-white/15 to-transparent blur-2xl"
              animate={motionAllowed ? { x: ['0%', '250%'] } : { x: '120%' }}
              transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1.2 }}
            />
          ) : null}

          {demo.overlay === 'glow' ? (
            <motion.div
              className="absolute inset-x-[-10%] top-[-15%] h-[58%] rounded-full bg-[#dfbd69]/18 blur-3xl"
              animate={motionAllowed ? { opacity: [0.2, 0.55, 0.2], scale: [1, 1.08, 1] } : { opacity: 0.28 }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
            />
          ) : null}

          <div className="relative z-10 flex min-h-[420px] flex-col justify-end px-6 py-7 md:px-8">
            <div className="mb-4 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.32em] text-[#d6c8ad]">
              <Sparkles className="h-3.5 w-3.5" />
              High Luxury Motion Study
            </div>

            {demo.mode === 'title' ? (
              <motion.div
                initial={motionAllowed ? { opacity: 0, y: 16 } : false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, ease: 'easeOut' }}
              >
                <h4 className="text-4xl font-semibold tracking-[-0.04em] text-white md:text-5xl">
                  <RevealText text="CLUB Animo" />
                </h4>
                <p className="mt-4 max-w-xl text-sm leading-[2.1] text-white/76 md:text-[15px]">
                  光と余韻だけを残しながら、映像の存在感はそのままに見せるヒーロー。
                </p>
              </motion.div>
            ) : null}

            {demo.mode === 'cta' ? (
              <div>
                <h4 className="text-4xl font-semibold tracking-[-0.04em] text-white md:text-5xl">
                  <GsapRevealTitle text="Reserve The Mood" />
                </h4>
                <p className="mt-4 max-w-xl text-sm leading-[2.1] text-white/76 md:text-[15px]">
                  情報よりも行動導線をきれいに見せる、運用寄りのヒーロー案です。
                </p>
                <div className="mt-6">
                  <StaggerList
                    className="grid gap-3 sm:grid-cols-2"
                    staggerDelay={motionAllowed ? 0.12 : 0}
                    delayChildren={motionAllowed ? 0.08 : 0}
                    viewportOnce={false}
                  >
                    <Magnetic strength={0.25}>
                      <button className="min-h-12 w-full rounded-full border border-[#dfbd69]/45 bg-[#dfbd69] px-5 py-3 text-sm font-medium text-[#171717]">
                        本日の出勤を見る
                      </button>
                    </Magnetic>
                    <Magnetic strength={0.18}>
                      <button className="min-h-12 w-full rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-medium text-white backdrop-blur-sm">
                        料金を確認する
                      </button>
                    </Magnetic>
                  </StaggerList>
                </div>
              </div>
            ) : null}

            {demo.mode === 'parallax' ? (
              <motion.div
                initial={false}
                animate={motionAllowed ? { y: [0, -8, 0] } : { y: 0 }}
                transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <h4 className="text-4xl font-semibold tracking-[-0.04em] text-white md:text-5xl">Velvet Depth</h4>
                <p className="mt-4 max-w-xl text-sm leading-[2.1] text-white/76 md:text-[15px]">
                  前景コピーと背景映像を少しだけズラして、没入感を足すパターンです。
                </p>
              </motion.div>
            ) : null}

            {!demo.mode && (
              <motion.div
                initial={motionAllowed ? { opacity: 0, y: 10 } : false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55 }}
              >
                <h4 className="text-4xl font-semibold tracking-[-0.04em] text-white md:text-5xl">{demo.title}</h4>
                <p className="mt-4 max-w-xl text-sm leading-[2.1] text-white/76 md:text-[15px]">{demo.summary}</p>
              </motion.div>
            )}

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                aria-describedby={`${id}-hero`}
                className="min-h-12 rounded-full border border-white/16 bg-white/10 px-5 py-3 text-sm font-medium text-white backdrop-blur-sm"
              >
                詳細を見る
              </button>
              <button
                className="min-h-12 rounded-full border border-[#dfbd69]/35 bg-[#dfbd69]/14 px-5 py-3 text-sm font-medium text-[#f4dfb9]"
              >
                体験を比較する
              </button>
            </div>
            <p id={`${id}-hero`} className="mt-3 text-xs text-white/45">
              すべて初回表示をブロックしない想定で、動画は即表示のまま比較しています。
            </p>
          </div>
        </div>

        <div className="border-t border-white/8 p-4 lg:border-l lg:border-t-0">
          <AnnotationCard
            library={demo.library}
            character={demo.character}
            risk={demo.risk}
            fit={demo.fit}
            recommended={demo.recommended}
          />
        </div>
      </div>
    </div>
  );
}

function ScrollParallaxCard({
  animationsEnabled,
  reducedMotion,
}: {
  animationsEnabled: boolean;
  reducedMotion: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const motionAllowed = animationsEnabled && !reducedMotion;

  return (
    <div ref={ref} className="relative min-h-[280px] overflow-hidden rounded-[24px] border border-white/10 bg-[#12161d]">
      <motion.div
        style={motionAllowed ? { y } : undefined}
        className="absolute inset-0 bg-[url('/images/animo-main-chandelier-interior.webp')] bg-cover bg-center opacity-45"
      />
      <div className="absolute inset-0 bg-linear-to-br from-black/45 via-black/30 to-black/70" />
      <div className="relative z-10 flex min-h-[280px] flex-col justify-end p-6">
        <span className="text-[10px] uppercase tracking-[0.28em] text-[#d1c4a9]">Parallax Block</span>
        <h4 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-white">Depth Through Motion</h4>
        <p className="mt-3 max-w-md text-sm leading-[1.95] text-white/72">
          画像や面を本文と少し違う速度で動かすことで、静かな奥行きを作ります。
        </p>
      </div>
    </div>
  );
}

function ScrollPreview({
  demo,
  animationsEnabled,
  reducedMotion,
}: {
  demo: ScrollDemo;
  animationsEnabled: boolean;
  reducedMotion: boolean;
}) {
  const motionAllowed = animationsEnabled && !reducedMotion;

  return (
    <div className="overflow-hidden rounded-[24px] border border-white/10 bg-[#151820]">
      <div className="border-b border-white/8 px-5 py-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-[#f4f1ea]">{demo.title}</h3>
            <p className="mt-1 text-xs leading-relaxed text-[#9f988c]">{demo.summary}</p>
          </div>
          {demo.recommended ? (
            <span className="inline-flex items-center gap-1 rounded-full border border-[#dfbd69]/30 bg-[#dfbd69]/12 px-2.5 py-1 text-[10px] uppercase tracking-[0.24em] text-[#f5deb0]">
              <BadgeCheck className="h-3.5 w-3.5" />
              Recommended
            </span>
          ) : null}
        </div>
      </div>

      <div className="space-y-4 p-4">
        {demo.mode === 'fade' ? (
          <motion.div
            initial={motionAllowed ? { opacity: 0, y: 18 } : false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: '-30px' }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            className="rounded-[22px] border border-white/8 bg-white/[0.03] p-6"
          >
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#9a907f]">Section Reveal</p>
            <h4 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-[#f7f4ee]">Quiet Entrance</h4>
            <p className="mt-3 max-w-md text-sm leading-[1.95] text-[#c7c0b2]">
              もっとも使い勝手がよく、本文や案内ブロックを壊しにくい見せ方です。
            </p>
          </motion.div>
        ) : null}

        {demo.mode === 'stagger' ? (
          <StaggerList
            className="grid gap-3 md:grid-cols-3"
            staggerDelay={motionAllowed ? 0.1 : 0}
            delayChildren={motionAllowed ? 0.06 : 0}
            viewportOnce={false}
          >
            {['接客品質', '空間の余白', '明朗会計'].map((label) => (
              <div key={label} className="rounded-[22px] border border-white/8 bg-white/[0.03] p-5">
                <p className="text-[10px] uppercase tracking-[0.28em] text-[#9a907f]">Feature</p>
                <p className="mt-3 text-lg font-medium text-[#f3efe7]">{label}</p>
                <p className="mt-2 text-sm leading-[1.85] text-[#b9b1a3]">
                  順番に出すと情報が整理され、詰まって見えにくくなります。
                </p>
              </div>
            ))}
          </StaggerList>
        ) : null}

        {demo.mode === 'title' ? (
          <div className="rounded-[22px] border border-white/8 bg-white/[0.03] p-6">
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#9a907f]">Title Treatment</p>
            <div className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[#f7f4ee]">
              <GsapRevealTitle text="The Lounge Mood" />
            </div>
            <p className="mt-4 max-w-md text-sm leading-[1.95] text-[#c7c0b2]">
              見出しだけを少し格上げしたい時に向いています。本文まで強く動かさないのがコツです。
            </p>
          </div>
        ) : null}

        {demo.mode === 'parallax' ? (
          <ScrollParallaxCard animationsEnabled={animationsEnabled} reducedMotion={reducedMotion} />
        ) : null}

        {demo.mode === 'magnetic' ? (
          <div className="rounded-[22px] border border-white/8 bg-white/[0.03] p-6">
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#9a907f]">Interaction</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Magnetic strength={motionAllowed ? 0.24 : 0}>
                <button className="min-h-12 rounded-full border border-[#dfbd69]/35 bg-[#dfbd69] px-5 py-3 text-sm font-medium text-[#171717]">
                  Reserve Tonight
                </button>
              </Magnetic>
              <Magnetic strength={motionAllowed ? 0.16 : 0}>
                <button className="min-h-12 rounded-full border border-white/12 bg-white/8 px-5 py-3 text-sm font-medium text-[#f5f0e6]">
                  View Access
                </button>
              </Magnetic>
            </div>
            <p className="mt-4 max-w-md text-sm leading-[1.95] text-[#c7c0b2]">
              ボタン数が多い画面ではなく、主要CTAだけに絞ると上質に見えます。
            </p>
          </div>
        ) : null}

        <AnnotationCard
          library={demo.library}
          character={demo.character}
          risk={demo.risk}
          fit={demo.fit}
          recommended={demo.recommended}
        />
      </div>
    </div>
  );
}

export function AnimationPreviewLab() {
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [frameMode, setFrameMode] = useState<FrameMode>('desktop');

  return (
    <div className="space-y-8 font-inter">
      <div className="rounded-[28px] border border-white/10 bg-linear-to-br from-[#181a21] via-[#111319] to-[#0b0d12] p-6 md:p-8">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#dfbd69]/25 bg-[#dfbd69]/8 px-3 py-1 text-[10px] uppercase tracking-[0.32em] text-[#d8c3a0]">
              <Wand2 className="h-3.5 w-3.5" />
              Animation Preview Lab
            </div>
            <h1 className="mt-4 text-2xl font-semibold tracking-[-0.05em] text-[#f4f1ea] md:text-[34px]">
              Hero と Scroll の演出を
              <span className="text-[#dfbd69]"> 1ページで比較</span>
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-[2] text-[#b7af9f] md:text-[15px]">
              高級感を強めた候補だけを並べつつ、実運用で重くなりすぎないものに絞って比較しています。
              ここでは「見栄え」と「本番適性」を同時に判断できます。
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:min-w-[420px]">
            <Button
              variant={animationsEnabled ? 'secondary' : 'outline'}
              size="lg"
              className="min-h-12 justify-start rounded-2xl border-white/12 bg-white/6 text-[#f4f1ea] hover:bg-white/10"
              onClick={() => setAnimationsEnabled((current) => !current)}
            >
              <Eye className="mr-2 h-4 w-4" />
              Animation {animationsEnabled ? 'On' : 'Off'}
            </Button>
            <Button
              variant={reducedMotion ? 'secondary' : 'outline'}
              size="lg"
              className="min-h-12 justify-start rounded-2xl border-white/12 bg-white/6 text-[#f4f1ea] hover:bg-white/10"
              onClick={() => setReducedMotion((current) => !current)}
            >
              <Gauge className="mr-2 h-4 w-4" />
              Reduced Motion {reducedMotion ? 'On' : 'Off'}
            </Button>
            <Button
              variant={frameMode === 'desktop' ? 'secondary' : 'outline'}
              size="lg"
              className="min-h-12 justify-start rounded-2xl border-white/12 bg-white/6 text-[#f4f1ea] hover:bg-white/10"
              onClick={() => setFrameMode('desktop')}
            >
              <Monitor className="mr-2 h-4 w-4" />
              Desktop Frame
            </Button>
            <Button
              variant={frameMode === 'mobile' ? 'secondary' : 'outline'}
              size="lg"
              className="min-h-12 justify-start rounded-2xl border-white/12 bg-white/6 text-[#f4f1ea] hover:bg-white/10"
              onClick={() => setFrameMode('mobile')}
            >
              <Smartphone className="mr-2 h-4 w-4" />
              Mobile Frame
            </Button>
          </div>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-3">
          <div className="rounded-[22px] border border-white/8 bg-white/[0.03] p-4">
            <p className="text-[10px] uppercase tracking-[0.28em] text-[#928878]">Homepage Safe</p>
            <p className="mt-2 text-sm font-medium text-[#f4f1ea]">Video + title reveal + subtle dust</p>
          </div>
          <div className="rounded-[22px] border border-white/8 bg-white/[0.03] p-4">
            <p className="text-[10px] uppercase tracking-[0.28em] text-[#928878]">Section Safe</p>
            <p className="mt-2 text-sm font-medium text-[#f4f1ea]">Fade + stagger + selective title reveal</p>
          </div>
          <div className="rounded-[22px] border border-white/8 bg-white/[0.03] p-4">
            <p className="text-[10px] uppercase tracking-[0.28em] text-[#928878]">Avoid By Default</p>
            <p className="mt-2 text-sm font-medium text-[#f4f1ea]">Heavy 3D intros and blocking openers</p>
          </div>
        </div>
      </div>

      <section className="space-y-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-[#dfbd69]/12 text-[#dfbd69]">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold tracking-[-0.03em] text-[#f4f1ea]">Hero Effects</h2>
            <p className="text-xs text-[#8c8578]">動画上の見せ方を比較して、トップの第一印象を決めるためのブロックです。</p>
          </div>
        </div>

        <FrameShell mode={frameMode}>
          <div className="space-y-5">
            {heroDemos.map((demo) => (
              <HeroPreview
                key={demo.id}
                demo={demo}
                animationsEnabled={animationsEnabled}
                reducedMotion={reducedMotion}
              />
            ))}
          </div>
        </FrameShell>
      </section>

      <section className="space-y-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-[#8cb8ff]/12 text-[#8cb8ff]">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold tracking-[-0.03em] text-[#f4f1ea]">Scroll Effects</h2>
            <p className="text-xs text-[#8c8578]">本文やセクションの見せ方を比較して、情報密度と高級感のバランスを判断します。</p>
          </div>
        </div>

        <FrameShell mode={frameMode}>
          <div className="space-y-5">
            {scrollDemos.map((demo) => (
              <ScrollPreview
                key={demo.id}
                demo={demo}
                animationsEnabled={animationsEnabled}
                reducedMotion={reducedMotion}
              />
            ))}
          </div>
        </FrameShell>
      </section>
    </div>
  );
}
