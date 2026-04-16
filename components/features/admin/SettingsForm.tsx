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
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

        <div className="mb-14 relative z-10">
          <h2 className={`text-3xl font-serif tracking-tight mb-3 ${F.heading}`}>Architecture & Atmosphere</h2>
          <p className="text-[11px] font-bold tracking-[4px] text-[#5a5650] uppercase italic">System-wide parameters and visual behavior</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-16 relative z-10 flex-1 flex flex-col">
          {/* Section: Emotional Branding */}
          <div className="space-y-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-[1px] w-12 bg-gold/40" />
              <span className="text-[11px] font-bold tracking-[5px] text-[#5a5650] uppercase">Emotional Layer</span>
            </div>
            
            <div className="group">
              <label htmlFor="today_mood" className={F.label}>Today&apos;s Mood / Luxury Headline</label>
              <p className={`text-[12px] mb-6 text-[#8a8478] leading-relaxed max-w-2xl`}>
                This message defines the current atmosphere of the establishment and appears prominently on the front stage.
              </p>
              <input
                id="today_mood"
                name="today_mood"
                type="text"
                defaultValue={initialData?.today_mood || ''}
                className={`${F.input} h-14 text-base`}
                placeholder="本日も皆様のご来店を心よりお待ち申し上げております。"
              />
              <p className="mt-3 text-[10px] text-[#5a5650] tracking-widest uppercase italic opacity-0 group-focus-within:opacity-100 transition-opacity">Real-time update applies to public visitors</p>
            </div>
          </div>

          {/* Section: Visual Transitions */}
          <div className="space-y-8 pt-10 border-t border-[#ffffff08]">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-[1px] w-12 bg-gold/40" />
              <span className="text-[11px] font-bold tracking-[5px] text-[#5a5650] uppercase">Visual Dynamics</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="flex flex-col h-full">
                <label htmlFor="hero_transition_mode" className={F.label}>Transition Architecture</label>
                <div className="relative flex-1 min-h-[56px]">
                  <select
                    id="hero_transition_mode"
                    name="hero_transition_mode"
                    defaultValue={initialData?.hero_transition_mode || 'ripple'}
                    className={`${F.input} h-full pr-12 appearance-none text-base`}
                  >
                    <option value="ripple">Ripple (Shader cross-fade) ★ Premium Choice</option>
                    <option value="fade">Minimalist Fade (Standard)</option>
                    <option value="slide">Horizontal Motion (Classic)</option>
                    <option value="zoom">Immersive Scale (Depth)</option>
                    <option value="burn">Luminous Exposure (Artistic)</option>
                  </select>
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gold/80">
                    <Check size={18} />
                  </div>
                </div>
                <p className={`${F.noteText} mt-5 leading-relaxed text-xs`}>
                  Shader-based transitions utilize WebGL for high-performance visual fidelity. Motion-based modes fall back to hardware-accelerated CSS animations.
                </p>
              </div>

              <div className="bg-white/[0.03] border border-white/10 p-8 rounded-[12px] flex flex-col justify-center min-h-[160px]">
                <p className="text-[11px] font-bold tracking-[3px] text-gold uppercase mb-3">Pro Tip</p>
                <p className="text-[13px] text-[#8a8478] leading-relaxed italic">
                  &ldquo;Ripple&rdquo; leverages custom fragment shaders to create a water-like cross-fade effect, highly recommended for the Animo luxury brand identity.
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
                  {isPending ? 'SYNCHRONIZING...' : 'COMMIT SETTINGS'}
                </span>
              </div>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
