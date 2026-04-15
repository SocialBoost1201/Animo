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
    <div className="max-w-4xl">
      <div className={`${F.card} p-6 md:p-12 relative overflow-hidden`}>
        {/* Subtle accent decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 blur-[100px] -mr-32 -mt-32 rounded-full" />
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

        <div className="mb-12 relative z-10">
          <h2 className={`text-2xl font-serif tracking-tight mb-2 ${F.heading}`}>Architecture & Atmosphere</h2>
          <p className="text-[10px] font-bold tracking-[3px] text-[#5a5650] uppercase italic">System-wide parameters and visual behavior</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-12 relative z-10">
          {/* Section: Emotional Branding */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-[1px] w-8 bg-gold/30" />
              <span className="text-[10px] font-bold tracking-[4px] text-[#5a5650] uppercase">Emotional Layer</span>
            </div>
            
            <div className="group">
              <label htmlFor="today_mood" className={F.label}>Today&apos;s Mood / Luxury Headline</label>
              <p className={`text-[11px] mb-4 text-[#8a8478] leading-relaxed`}>
                This message defines the current atmosphere of the establishment and appears prominently on the front stage.
              </p>
              <input
                id="today_mood"
                name="today_mood"
                type="text"
                defaultValue={initialData?.today_mood || ''}
                className={F.input}
                placeholder="本日も皆様のご来店を心よりお待ち申し上げております。"
              />
              <p className="mt-2 text-[9px] text-[#5a5650] tracking-widest uppercase italic opacity-0 group-focus-within:opacity-100 transition-opacity">Real-time update applies to public visitors</p>
            </div>
          </div>

          {/* Section: Visual Transitions */}
          <div className="space-y-6 pt-6 border-t border-white/5">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-[1px] w-8 bg-gold/30" />
              <span className="text-[10px] font-bold tracking-[4px] text-[#5a5650] uppercase">Visual Dynamics</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label htmlFor="hero_transition_mode" className={F.label}>Transition Architecture</label>
                <div className="relative">
                  <select
                    id="hero_transition_mode"
                    name="hero_transition_mode"
                    defaultValue={initialData?.hero_transition_mode || 'ripple'}
                    className={`${F.input} pr-10 appearance-none`}
                  >
                    <option value="ripple">Ripple (Shader cross-fade) ★ Premium Choice</option>
                    <option value="fade">Minimalist Fade (Standard)</option>
                    <option value="slide">Horizontal Motion (Classic)</option>
                    <option value="zoom">Immersive Scale (Depth)</option>
                    <option value="burn">Luminous Exposure (Artistic)</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gold/60">
                    <Check size={14} />
                  </div>
                </div>
                <p className={`${F.noteText} mt-4 leading-relaxed`}>
                  Shader-based transitions utilize WebGL for high-performance visual fidelity. Motion-based modes fall back to hardware-accelerated CSS animations.
                </p>
              </div>

              <div className="bg-white/[0.02] border border-white/5 p-6 rounded-sm flex flex-col justify-center">
                <p className="text-[10px] font-bold tracking-[2px] text-gold uppercase mb-2">Pro Tip</p>
                <p className="text-[11px] text-[#8a8478] leading-relaxed italic">
                  &ldquo;Ripple&rdquo; leverages custom fragment shaders to create a water-like cross-fade effect, highly recommended for the Animo luxury brand identity.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-10 flex justify-end">
            <button
              type="submit"
              disabled={isPending}
              className="w-full md:w-64 relative group h-14 bg-gold overflow-hidden rounded-sm transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_10px_30px_-10px_rgba(223,189,105,0.3)] flex items-center justify-center"
            >
              <div className="absolute inset-0 w-full h-full bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              <div className="relative z-10 flex items-center gap-3">
                {isPending ? (
                  <Loader2 size={16} className="animate-spin text-black" />
                ) : (
                  <Check size={16} className="text-black" />
                )}
                <span className="text-black text-[10px] font-bold tracking-[3px] uppercase">
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
