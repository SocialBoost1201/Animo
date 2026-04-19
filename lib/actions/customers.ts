'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function linkContactToCustomer(
  _contactGroupId: string,
  name: string,
  phone: string | null,
  email: string | null,
  lineId: string | null,
) {
  const supabase = await createClient();
  let customerId = null;

  if (phone) {
    const { data } = await supabase.from('customers').select('id').eq('phone', phone).single();
    if (data) customerId = data.id;
  }

  if (!customerId && email) {
    const { data } = await supabase.from('customers').select('id').eq('email', email).single();
    if (data) customerId = data.id;
  }

  if (!customerId) {
    const { data: newCustomer, error: insertError } = await supabase
      .from('customers')
      .insert({ name, phone, email, line_id: lineId, rank: 'normal', total_visits: 0 })
      .select('id')
      .single();

    if (insertError) {
      console.error('Error creating customer:', insertError);
      throw new Error('Failed to create customer');
    }
    customerId = newCustomer.id;
  }

  if (phone) {
    await supabase.from('contacts').update({ customer_id: customerId }).eq('phone', phone);
  } else if (email) {
    await supabase.from('contacts').update({ customer_id: customerId }).eq('contact_method', email);
  } else {
    await supabase.from('contacts').update({ customer_id: customerId }).eq('name', name);
  }

  revalidatePath('/admin/customers');
  return customerId;
}

export async function createCustomer(formData: FormData) {
  const supabase = await createClient();

  const name  = (formData.get('name')  as string | null)?.trim() || null;
  const phone = (formData.get('phone') as string | null)?.trim() || null;
  const email = (formData.get('email') as string | null)?.trim() || null;
  const rank  = (formData.get('rank')  as string | null) || 'normal';
  const note  = (formData.get('note')  as string | null)?.trim() || null;

  if (!name) return { success: false as const, error: '顧客名は必須です' };

  const { error } = await supabase.from('customers').insert({
    name, phone, email, rank, note, total_visits: 0,
  });

  if (error) {
    console.error('Error creating customer:', error);
    return { success: false as const, error: '登録に失敗しました: ' + error.message };
  }

  revalidatePath('/admin/customers');
  return { success: true as const };
}

export async function updateCustomer(id: string, updates: Record<string, unknown>) {
  const supabase = await createClient();
  const { error } = await supabase.from('customers').update(updates).eq('id', id);

  if (error) {
    console.error('Error updating customer:', error);
    throw new Error('Failed to update customer');
  }

  revalidatePath('/admin/customers');
  revalidatePath(`/admin/customers/${id}`);
}

export async function updateCustomerFull(id: string, formData: FormData) {
  const supabase = await createClient();

  const name  = (formData.get('name')  as string | null)?.trim() || null;
  const phone = (formData.get('phone') as string | null)?.trim() || null;
  const email = (formData.get('email') as string | null)?.trim() || null;
  const rank  = (formData.get('rank')  as string | null) || 'normal';
  const note  = (formData.get('note')  as string | null)?.trim() || null;
  const totalVisitsRaw = formData.get('total_visits');
  const total_visits   = totalVisitsRaw ? parseInt(totalVisitsRaw as string, 10) : undefined;

  if (!name) return { success: false as const, error: '顧客名は必須です' };

  const updates: Record<string, unknown> = { name, phone, email, rank, note };
  if (total_visits !== undefined && !isNaN(total_visits)) updates.total_visits = total_visits;

  const { error } = await supabase.from('customers').update(updates).eq('id', id);

  if (error) {
    console.error('Error updating customer:', error);
    return { success: false as const, error: '更新に失敗しました: ' + error.message };
  }

  revalidatePath('/admin/customers');
  revalidatePath(`/admin/customers/${id}`);
  return { success: true as const };
}

export async function deleteCustomer(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('customers').delete().eq('id', id);

  if (error) {
    console.error('Error deleting customer:', error);
    throw new Error('顧客データの削除に失敗しました');
  }

  revalidatePath('/admin/customers');
  return { success: true as const };
}
