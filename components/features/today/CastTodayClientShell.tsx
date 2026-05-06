'use client'

import { useRef, useState } from 'react'
import { addReservation } from '@/lib/actions/today'
import { toast } from 'sonner'
import { CheckinForm, type CheckinFormHandle } from './CheckinForm'
import { ReservationForm, type PendingReservation } from './ReservationForm'

type ExistingCheckin = {
  has_change: boolean
  change_note?: string
  is_absent: boolean
  memo?: string
  approval_status?: 'pending' | 'approved' | 'rejected'
} | null

type ExistingDouhanReservation = {
  id: string
  visit_time: string
  guest_name: string
  guest_count?: number | null
  note?: string | null
} | null

type SavedReservation = {
  id: string
  visit_time: string
  guest_name: string
  guest_count?: number | null
  reservation_type: string
  note?: string
}

type Props = {
  checkinProps: {
    existing: ExistingCheckin
    existingDouhan?: ExistingDouhanReservation
    isSubmissionClosed: boolean
    deadlineLabel: string
    isMasterOverride?: boolean
  }
  reservationProps: {
    reservations: SavedReservation[]
    isSubmissionClosed: boolean
    deadlineLabel: string
  }
}

export function CastTodayClientShell({ checkinProps, reservationProps }: Props) {
  const checkinRef = useRef<CheckinFormHandle>(null)
  const [pendingReservations, setPendingReservations] = useState<PendingReservation[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleAddPending(r: PendingReservation) {
    setPendingReservations(prev => [...prev, r])
  }

  function handleRemovePending(id: string) {
    setPendingReservations(prev => prev.filter(r => r.id !== id))
  }

  async function handleUnifiedSubmit() {
    setIsSubmitting(true)
    try {
      const checkinResult = await checkinRef.current?.submit()
      if (checkinResult?.error) return

      const errors: string[] = []
      for (const r of pendingReservations) {
        const fd = new FormData()
        fd.set('visit_time', r.visit_time)
        fd.set('guest_name', r.guest_name)
        if (r.guest_count != null) fd.set('guest_count', String(r.guest_count))
        if (r.note) fd.set('note', r.note)
        fd.set('reservation_type', 'reservation')
        fd.set('visit_certainty', 'maybe')
        const result = await addReservation(fd)
        if (result.error) errors.push(result.error)
      }

      if (errors.length === 0) {
        if (pendingReservations.length > 0) {
          toast.success(`来店予定 ${pendingReservations.length} 件を送信しました`)
        }
        setPendingReservations([])
      } else {
        toast.error(`一部の来店予定の送信に失敗しました: ${errors.join(' / ')}`)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <CheckinForm ref={checkinRef} {...checkinProps} hideSubmitButton />
      <ReservationForm
        {...reservationProps}
        pendingReservations={pendingReservations}
        onAddPending={handleAddPending}
        onRemovePending={handleRemovePending}
      />
      {!checkinProps.isSubmissionClosed && (
        <button
          type="button"
          onClick={handleUnifiedSubmit}
          disabled={isSubmitting}
          className="h-[56px] w-full rounded-[16px] bg-[#c9a76a] text-[15px] font-bold text-[#0b0d12] transition-all disabled:opacity-50 hover:bg-[#d4b575] active:scale-[0.99]"
        >
          {isSubmitting ? '送信中...' : '本日の情報を送信する'}
        </button>
      )}
    </>
  )
}
