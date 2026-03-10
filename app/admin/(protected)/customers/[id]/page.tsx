import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, User, Phone, Mail, Smartphone, Calendar, MessageSquare, Edit3, Save } from 'lucide-react';
import { revalidatePath } from 'next/cache';
import { updateCustomer } from '@/lib/actions/customers';

export const dynamic = 'force-dynamic';

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  // 1. Fetch Customer Info
  const { data: customer, error: customerError } = await supabase
    .from('customers')
    .select('*')
    .eq('id', id)
    .single();

  if (customerError || !customer) {
    notFound();
  }

  // 2. Fetch Contact / Reserve Timeline
  const { data: contacts } = await supabase
    .from('contacts')
    .select('*')
    .eq('customer_id', id)
    .order('created_at', { ascending: false });

  // Update CRM Form Action
  async function saveCrmData(formData: FormData) {
    'use server';
    const rank = formData.get('rank') as string;
    const notes = formData.get('notes') as string;
    const total_visits = parseInt(formData.get('total_visits') as string) || 0;
    
    await updateCustomer(id, { rank, notes, total_visits });
  }

  const ranks = [
    { value: 'normal', label: 'Normal / 一般' },
    { value: 'bronze', label: 'Bronze / 常連' },
    { value: 'silver', label: 'Silver / 上客' },
    { value: 'gold',   label: 'Gold / VIP' },
    { value: 'vip',    label: 'VIP / 最重要' },
    { value: 'black',  label: 'Black / 出禁・注意' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/customers" 
          className="p-2 bg-white border border-gray-200 rounded-sm hover:bg-gray-50 transition-colors text-gray-500"
        >
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 className="text-2xl font-serif tracking-widest text-[#171717]">顧客詳細 / CRM</h1>
          <p className="text-sm text-gray-400 mt-1">顧客ごとの情報とこれまでのアプローチ履歴</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: CRM Profile Form */}
        <div className="lg:col-span-1 border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 shrink-0">
              <User size={24} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#171717]">{customer.name} 様</h2>
              <div className="text-[10px] text-gray-400 font-mono mt-0.5">ID: {customer.id.split('-')[0]}</div>
            </div>
          </div>

          <div className="space-y-4 mb-6 text-sm text-gray-600">
            {customer.phone && <div className="flex items-center gap-2"><Phone size={14} className="text-gray-400" /> {customer.phone}</div>}
            {customer.email && <div className="flex items-center gap-2"><Mail size={14} className="text-gray-400" /> {customer.email}</div>}
            {customer.line_id && <div className="flex items-center gap-2"><Smartphone size={14} className="text-gray-400" /> {customer.line_id}</div>}
          </div>

          <form action={saveCrmData} className="space-y-5">
            <div>
              <label className="block text-xs font-bold tracking-widest text-gray-500 mb-2">顧客ランク</label>
              <select 
                name="rank" 
                defaultValue={customer.rank}
                className="w-full text-sm border border-gray-200 rounded-sm p-2.5 focus:border-gold focus:ring-1 focus:ring-gold outline-none"
              >
                {ranks.map(r => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-bold tracking-widest text-gray-500 mb-2">累計来店回数</label>
              <input 
                type="number" 
                name="total_visits" 
                defaultValue={customer.total_visits}
                className="w-full text-sm border border-gray-200 rounded-sm p-2.5 focus:border-gold focus:ring-1 focus:ring-gold outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold tracking-widest text-gray-500 mb-2">対応メモ・特記事項</label>
              <textarea 
                name="notes" 
                defaultValue={customer.notes || ''}
                rows={5}
                placeholder="好みのキャスト、飲むお酒、要注意事項など..."
                className="w-full text-sm border border-gray-200 rounded-sm p-2.5 focus:border-gold focus:ring-1 focus:ring-gold outline-none resize-none"
              />
            </div>

            <button type="submit" className="w-full bg-[#171717] hover:bg-gold text-white px-4 py-3 rounded-sm text-sm font-bold tracking-widest flex items-center justify-center gap-2 transition-colors">
              <Save size={16} /> 保存する
            </button>
          </form>
        </div>

        {/* Right Column: Timeline */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-sm font-bold tracking-widest uppercase text-gray-500 mb-4 px-2">Timeline</h3>
          
          {contacts && contacts.length > 0 ? (
            <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-linear-to-b before:from-transparent before:via-gray-200 before:to-transparent">
              {contacts.map((contact: {
                id: string;
                type: string;
                created_at: string;
                date?: string;
                time?: string;
                people?: number;
                cast_name?: string;
                message?: string;
                reply_text?: string;
                replied_at?: string;
              }) => (
                <div key={contact.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-gray-100 text-gray-400 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                    {contact.type === 'reserve' ? <Calendar size={16} className="text-purple-500" /> : <MessageSquare size={16} className="text-blue-500" />}
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-sm border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                       <span className="text-xs text-gray-400 font-mono">{new Date(contact.created_at).toLocaleString('ja-JP')}</span>
                       <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${contact.type === 'reserve' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                         {contact.type === 'reserve' ? '予約' : '問い合わせ'}
                       </span>
                    </div>
                    {contact.type === 'reserve' ? (
                      <div className="text-sm text-gray-600 space-y-1">
                        <p><span className="font-bold">希望日時:</span> {contact.date} {contact.time?.slice(0, 5)}</p>
                        <p><span className="font-bold">人数:</span> {contact.people} 名</p>
                        {contact.cast_name && <p><span className="font-bold">指名:</span> {contact.cast_name}</p>}
                        {contact.message && <p className="mt-2 text-xs bg-gray-50 p-2 rounded">{contact.message}</p>}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-600 whitespace-pre-wrap">{contact.message}</p>
                    )}
                    
                    {contact.reply_text && (
                      <div className="mt-3 pt-3 border-t border-gray-50 text-xs">
                          <p className="font-bold text-green-600 mb-1">返信済み ({contact.replied_at ? new Date(contact.replied_at).toLocaleDateString() : ''})</p>
                        <p className="text-gray-500 bg-green-50/50 p-2 rounded">{contact.reply_text}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
             <div className="bg-white border border-gray-100 p-12 text-center text-gray-400 text-sm">
               履歴がありません
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
