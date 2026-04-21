import { permanentRedirect } from 'next/navigation'
import { Metadata } from 'next'

export const metadata: Metadata = {
  alternates: {
    canonical: '/',
  },
}

export default function ShiftPage() {
  permanentRedirect('/#today-cast')
}
