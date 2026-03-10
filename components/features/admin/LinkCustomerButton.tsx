'use client';

import { useState } from 'react';
import { UserPlus, Loader2 } from 'lucide-react';
import { linkContactToCustomer } from '@/lib/actions/customers';
import { toast } from 'sonner';

export function LinkCustomerButton({ 
  contactGroupId, 
  name, 
  phone, 
  email, 
  lineId 
}: { 
  contactGroupId: string;
  name: string;
  phone: string | null;
  email: string | null;
  lineId: string | null;
}) {
  const [isLinking, setIsLinking] = useState(false);

  async function handleLink() {
    setIsLinking(true);
    try {
      await linkContactToCustomer(contactGroupId, name, phone, email, lineId);
      toast.success('顧客リストに連携しました');
    } catch (error) {
       toast.error('連携に失敗しました');
    } finally {
      setIsLinking(false);
    }
  }

  return (
    <button 
      onClick={handleLink}
      disabled={isLinking}
      className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded transition-colors disabled:opacity-50"
    >
      {isLinking ? <Loader2 size={14} className="animate-spin" /> : <UserPlus size={14} />}
      CRMに登録・連携
    </button>
  );
}
