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
    <div className="w-full">
      <div className={`${F.card} p-10 md:p-14 h-full relative overflow-hidden flex flex-col`}>
        {/* Subtle accent decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 blur-[120px] -mr-48 -mt-48 rounded-full" />
        <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-gold/30 to-transparent" />

        <div className="mb-14 relative z-10">
          <h2 className={`text-3xl font-serif tracking-tight mb-3 ${F.heading}`}>サイト設定</h2>
          <p className="text-[11px] font-bold tracking-[4px] text-[#5a5650] uppercase italic">サイト全体の雰囲気とビジュアル演出を管理します</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-16 relative z-10 flex-1 flex flex-col">
          {/* Section: 本日のムード */}
          <div className="space-y-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-px w-12 bg-gold/40" />
              <span className="text-[11px] font-bold tracking-[5px] text-[#5a5650] uppercase">本日のムード</span>
            </div>

            <div className="group">
              <label htmlFor="today_mood" className={F.label}>トップページ見出しメッセージ</label>
              <p className={`text-[12px] mb-6 text-[#8a8478] leading-relaxed max-w-2xl`}>
                フロントページの最上部に表示されるメッセージです。店舗の今日の雰囲気やキャッチコピーを入力してください。
              </p>
              <input
                id="today_mood"
                name="today_mood"
                type="text"
                defaultValue={initialData?.today_mood || ''}
                className={`${F.input} h-14 text-base`}
                placeholder="本日も皆様のご来店を心よりお待ち申し上げております。"
              />
              <p className="mt-3 text-[10px] text-[#5a5650] tracking-widest italic opacity-0 group-focus-within:opacity-100 transition-opacity">保存するとフロントページに即時反映されます</p>
            </div>
          </div>

          {/* Section: ビジュアル演出 */}
          <div className="space-y-8 pt-10 border-t border-[#ffffff08]">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-px w-12 bg-gold/40" />
              <span className="text-[11px] font-bold tracking-[5px] text-[#5a5650] uppercase">ビジュアル演出</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="flex flex-col h-full">
                <label htmlFor="hero_transition_mode" className={F.label}>ヒーロー画像のトランジション</label>
                <div className="relative flex-1 min-h-[56px]">
                  <select
                    id="hero_transition_mode"
                    name="hero_transition_mode"
                    defaultValue={initialData?.hero_transition_mode || 'ripple'}
                    className={`${F.input} h-full pr-12 appearance-none text-base`}
                  >
                    <option value="ripple">リップル（シェーダークロスフェード）★ おすすめ</option>
                    <option value="fade">シンプルフェード（標準）</option>
                    <option value="slide">横スライド（クラシック）</option>
                    <option value="zoom">ズームイン（奥行き感）</option>
                    <option value="burn">露光フェード（アーティスティック）</option>
                  </select>
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gold/80">
                    <Check size={18} />
                  </div>
                </div>
                <p className={`${F.noteText} mt-5 leading-relaxed text-xs`}>
                  「リップル」はWebGLシェーダーを使用した高品質なエフェクトです。その他のモードはCSSアニメーションで動作します。
                </p>
              </div>

              <div className="bg-white/3 border border-white/10 p-8 rounded-[12px] flex flex-col justify-center min-h-section">
                <p className="text-[11px] font-bold tracking-[3px] text-gold uppercase mb-3">ヒント</p>
                <p className="text-[13px] text-[#8a8478] leading-relaxed italic">
                  「リップル」はカスタムシェーダーによる水面のようなクロスフェード効果で、Animoのブランドイメージに最もマッチしたプレミアムな演出です。
                </p>
              </div>
            </div>
          </div>

          <div className="pt-12 mt-auto">
            <button
              type="submit"
              disabled={isPending}
              className="w-full relative group h-16 bg-gold overflow-hidden rounded-[10px] transition-all active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_15px_35px_-10px_rgba(223,189,105,0.4)] flex items-center justify-center"
            >
              <div className="absolute inset-0 w-full h-full bg-white/25 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              <div className="relative z-10 flex items-center gap-4">
                {isPending ? (
                  <Loader2 size={18} className="animate-spin text-black" />
                ) : (
                  <Check size={18} className="text-black" />
                )}
                <span className="text-black text-[12px] font-bold tracking-[4px] uppercase font-sans">
                  {isPending ? '保存中...' : '設定を保存する'}
                </span>
              </div>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
