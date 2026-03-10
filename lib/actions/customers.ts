'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function linkContactToCustomer(contactGroupId: string, name: string, phone: string | null, email: string | null, lineId: string | null) {
  const supabase = await createClient();

  // Check if customer exists with this phone or email
  let customerId = null;

  if (phone) {
    const { data } = await supabase.from('customers').select('id').eq('phone', phone).single();
    if (data) customerId = data.id;
  }
  
  if (!customerId && email) {
    const { data } = await supabase.from('customers').select('id').eq('email', email).single();
    if (data) customerId = data.id;
  }

  // Create new customer if not found
  if (!customerId) {
    const { data: newCustomer, error: insertError } = await supabase
      .from('customers')
      .insert({
        name,
        phone,
        email,
        line_id: lineId,
        rank: 'normal',
        total_visits: 0
      })
      .select('id')
      .single();

    if (insertError) {
      console.error('Error creating customer:', insertError);
      throw new Error('Failed to create customer');
    }
    customerId = newCustomer.id;
  }

  // Link contacts that match the phone, email, or exact name
  const query = supabase.from('contacts').update({ customer_id: customerId });
  
  if (phone) {
    await query.eq('phone', phone);
  } else if (email) {
     // fallback to email or contact_method
     await supabase.from('contacts').update({ customer_id: customerId }).eq('contact_method', email);
  } else {
    // fallback to name
    await supabase.from('contacts').update({ customer_id: customerId }).eq('name', name);
  }

  revalidatePath('/admin/customers');
  return customerId;
}

export async function updateCustomer(id: string, updates: Record<string, unknown>) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('customers')
    .update(updates)
    .eq('id', id);

  if (error) {
    console.error('Error updating customer:', error);
    throw new Error('Failed to update customer');
  }

  revalidatePath('/admin/customers');
  revalidatePath(`/admin/customers/${id}`);
}
