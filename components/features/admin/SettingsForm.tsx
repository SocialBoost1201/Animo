'use client'

import { updateSiteSettings } from '@/lib/actions/contents'
import { Button } from '@/components/ui/Button'
import { useState } from 'react'
import { Check, Loader2 } from 'lucide-react'
import { showToast } from '@/components/ui/Toast'
import { useAdminTheme } from '@/components/providers/AdminThemeProvider'

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

  const { F } = useAdminTheme()

  return (
    <div className={`${F.card} p-8 max-w-3xl`}>
      <form onSubmit={handleSubmit} className="space-y-8">

        {/* 全体告知（今日の気分など） */}
        <div>
          <label htmlFor="today_mood" className={`block text-sm font-bold tracking-widest uppercase mb-1 ${F.heading}`}>Today&apos;s Mood / Headline</label>
          <p className={`text-xs mb-4 ${F.subtle}`}>トップページなどに表示される、本日の一言メッセージです。</p>
          <input
            id="today_mood"
            name="today_mood"
            type="text"
            defaultValue={initialData?.today_mood || ''}
            className={F.input}
            placeholder="本日も皆様のご来店を心よりお待ち申し上げております。"
          />
        </div>

        {/* Curtain Room 空き状況は要件から除外 */}

        <div className={`border-t ${F.divider} pt-8 mt-8`}>
          <h3 className={`text-sm font-bold tracking-widest uppercase mb-1 ${F.heading}`}>Hero Section Settings</h3>
          <p className={`text-xs mb-4 ${F.subtle}`}>トップページ上部の動画ローテーション設定</p>

        <div>
          <label htmlFor="hero_transition_mode" className={F.label}>Transition Mode</label>
          <select
            id="hero_transition_mode"
            name="hero_transition_mode"
            defaultValue={initialData?.hero_transition_mode || 'ripple'}
            className={`${F.input} md:w-2/3`}
          >
            <option value="ripple">Ripple（波紋クロスフェード）★ デフォルト・最高品質</option>
            <option value="fade">Fade（シンプルなフェード）</option>
            <option value="slide">Slide（横スライド）</option>
            <option value="zoom">Zoom（ズームアウトして切替）</option>
            <option value="burn">Burn（明転して切替）</option>
          </select>
          <p className={`${F.noteText} mt-2`}>
            ※ ripple は WebGL シェーダーによる高品質エフェクトです。slide / zoom / burn は CSS アニメーションで動作します。
          </p>
        </div>
        </div>

        <div className={`pt-6 border-t ${F.divider}`}>
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
