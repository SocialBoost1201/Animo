'use client'

import { updateSiteSettings } from '@/lib/actions/contents'
import { Button } from '@/components/ui/Button'
import { useState } from 'react'
import { Check, Loader2 } from 'lucide-react'
import { showToast } from '@/components/ui/Toast'

type SettingsData = {
  today_mood?: string;
  hero_transition_mode?: string;
};

export function SettingsForm({ initialData }: { initialData?: SettingsData | null }) {
  const [isPending, setIsPending] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsPending(true)

    const formData = new FormData(e.currentTarget)

    try {
      const result = await updateSiteSettings(formData)
      if (result.error) {
        showToast(result.error, 'error')
      } else {
        showToast('サイト設定を更新しました。', 'success')
      }
    } catch (error: unknown) {
      const err = error as Error;
      showToast(err.message, 'error')
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="bg-[#18181c] border border-[#ffffff10] rounded-xl p-8 max-w-3xl shadow-[0_8px_32px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.06)]">
      <form onSubmit={handleSubmit} className="space-y-8">

        {/* 全体告知（今日の気分など） */}
        <div>
          <label htmlFor="today_mood" className="block text-sm font-bold tracking-widest text-[#f4f1ea] uppercase mb-1">Today&apos;s Mood / Headline</label>
          <p className="text-xs text-[#8a8478] mb-4">トップページなどに表示される、本日の一言メッセージです。</p>
          <input
            id="today_mood"
            name="today_mood"
            type="text"
            defaultValue={initialData?.today_mood || ''}
            className="w-full bg-[#0e0e10] border border-[#ffffff10] rounded-lg px-3 py-2 text-sm text-[#c7c0b2] placeholder-[#3a3830] focus:outline-none focus:border-[#dfbd69] transition-colors"
            placeholder="本日も皆様のご来店を心よりお待ち申し上げております。"
          />
        </div>

        {/* Curtain Room 空き状況は要件から除外 */}

        <div className="border-t border-[#ffffff08] pt-8 mt-8">
          <h3 className="text-sm font-bold tracking-widest text-[#f4f1ea] uppercase mb-1">Hero Section Settings</h3>
          <p className="text-xs text-[#8a8478] mb-4">トップページ上部の動画ローテーション設定</p>

        <div>
          <label htmlFor="hero_transition_mode" className="block text-xs font-bold tracking-widest text-[#8a8478] uppercase mb-2">Transition Mode</label>
          <select
            id="hero_transition_mode"
            name="hero_transition_mode"
            defaultValue={initialData?.hero_transition_mode || 'ripple'}
            className="w-full md:w-2/3 bg-[#0e0e10] border border-[#ffffff10] rounded-lg px-3 py-2 text-sm text-[#c7c0b2] focus:outline-none focus:border-[#dfbd69] transition-colors"
          >
            <option value="ripple">Ripple（波紋クロスフェード）★ デフォルト・最高品質</option>
            <option value="fade">Fade（シンプルなフェード）</option>
            <option value="slide">Slide（横スライド）</option>
            <option value="zoom">Zoom（ズームアウトして切替）</option>
            <option value="burn">Burn（明転して切替）</option>
          </select>
          <p className="text-xs text-[#5a5650] mt-2">
            ※ ripple は WebGL シェーダーによる高品質エフェクトです。slide / zoom / burn は CSS アニメーションで動作します。
          </p>
        </div>
        </div>

        <div className="pt-6 border-t border-[#ffffff08]">
          <Button
            type="submit"
            className="w-full md:w-auto pt-3 pb-3 px-8 font-bold tracking-widest text-sm flex justify-center items-center"
            disabled={isPending}
          >
            {isPending ? (
              <><Loader2 size={16} className="animate-spin mr-2" /> 更新中...</>
            ) : (
              <><Check size={16} className="mr-2" /> 設定を保存する</>
            )}
          </Button>
        </div>

      </form>
    </div>
  )
}
