import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { CustomerForm } from '@/components/features/admin/customers/CustomerForm';

export const dynamic = 'force-dynamic';

export default async function CustomerDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();
  const { data: customer, error } = await supabase
    .from('customers')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error || !customer) notFound();

  return <CustomerForm initialData={customer} />;
}
