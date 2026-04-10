import { redirect } from 'next/navigation'

// Ensure this redirect stays non-permanent (avoid 308/permanent caching in some CDNs)
export const dynamic = 'force-dynamic'

export default function ShiftPage() {
  redirect('/#today-cast')
}
