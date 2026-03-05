import { CastForm } from '@/components/features/admin/CastForm'
import { getCastById } from '@/lib/actions/casts'

// For dynamic route types in Next.js 14/15
export default async function EditCastPage({ params }: { params: { id: string } }) {
  const cast = await getCastById(params.id)
  
  return <CastForm initialData={cast} />
}
