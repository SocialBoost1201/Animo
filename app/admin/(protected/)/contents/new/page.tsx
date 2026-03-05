import { ContentForm } from '@/components/features/admin/ContentForm'

export default function NewContentPage() {
  return <ContentForm initialData={{ type: 'news' }} />
}
