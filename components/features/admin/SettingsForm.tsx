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
      <div className="h-full rounded-[18px] border border-[#ffffff0f] bg-[#17181c] p-6 flex flex-col">
        <div className="mb-6 flex items-start justify-between gap-4 border-b border-[#ffffff0a] pb-4">
          <div>
            <h2 className={`text-[14px] font-semibold tracking-[-0.1px] ${F.heading}`}>サイト設定</h2>
            <p className="mt-1 text-[11px] leading-relaxed text-[#8a8478]">サイト全体の雰囲気とビジュアル演出を管理します</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 flex-1 flex flex-col">
          {/* Section: 本日のムード */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-[#dfbd69]" />
              <span className="text-[11px] font-semibold text-[#c7c0b2]">本日のムード</span>
            </div>

            <div className="group">
              <label htmlFor="today_mood" className={F.label}>トップページ見出しメッセージ</label>
              <p className="text-[12px] mb-3 text-[#8a8478] leading-relaxed">
                フロントページの最上部に表示されるメッセージです。店舗の今日の雰囲気やキャッチコピーを入力してください。
              </p>
              <input
                id="today_mood"
                name="today_mood"
                type="text"
                defaultValue={initialData?.today_mood || ''}
                className={`${F.input} h-11`}
                placeholder="本日も皆様のご来店を心よりお待ち申し上げております。"
              />
              <p className="mt-2 text-[11px] text-[#5a5650] opacity-0 group-focus-within:opacity-100 transition-opacity">保存するとフロントページに即時反映されます</p>
            </div>
          </div>

          {/* Section: ビジュアル演出 */}
          <div className="space-y-4 pt-5 border-t border-[#ffffff08]">
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-[#dfbd69]" />
              <span className="text-[11px] font-semibold text-[#c7c0b2]">ビジュアル演出</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="flex flex-col h-full">
                <label htmlFor="hero_transition_mode" className={F.label}>ヒーロー画像のトランジション</label>
                <div className="relative flex-1 min-h-[44px]">
                  <select
                    id="hero_transition_mode"
                    name="hero_transition_mode"
                    defaultValue={initialData?.hero_transition_mode || 'ripple'}
                    className={`${F.input} h-11 pr-10 appearance-none`}
                  >
                    <option value="ripple">リップル（シェーダークロスフェード）★ おすすめ</option>
                    <option value="fade">シンプルフェード（標準）</option>
                    <option value="slide">横スライド（クラシック）</option>
                    <option value="zoom">ズームイン（奥行き感）</option>
                    <option value="burn">露光フェード（アーティスティック）</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gold/80">
                    <Check size={15} />
                  </div>
                </div>
                <p className={`${F.noteText} mt-3 leading-relaxed`}>
                  「リップル」はWebGLシェーダーを使用した高品質なエフェクトです。その他のモードはCSSアニメーションで動作します。
                </p>
              </div>

              <div className="bg-[#1c1d22] border border-[#ffffff0f] p-4 rounded-[14px] flex flex-col justify-center">
                <p className="text-[11px] font-semibold text-[#dfbd69] mb-2">ヒント</p>
                <p className="text-[12px] text-[#8a8478] leading-relaxed">
                  「リップル」はカスタムシェーダーによる水面のようなクロスフェード効果で、Animoのブランドイメージに最もマッチしたプレミアムな演出です。
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-auto">
            <Button
              type="submit"
              disabled={isPending}
              className="w-full h-11 bg-gold text-black hover:bg-gold/90 text-[12px] font-bold tracking-[0.08em]"
            >
              {isPending ? (
                <Loader2 size={16} className="animate-spin text-black" />
              ) : (
                <Check size={16} className="text-black" />
              )}
              {isPending ? '保存中...' : '設定を保存する'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
