'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

export function DashboardSearchBar() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && query.trim()) {
      router.push(`/admin/human-resources?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="flex items-center gap-3 px-4 py-2.5 bg-[#ffffff0a] rounded-[12px] border border-[#ffffff0f] w-64 transition-all focus-within:w-80 focus-within:border-[#dfbd6950] focus-within:bg-black/40">
      <Search size={13} className="shrink-0 text-[#dfbd69] opacity-70" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="キャスト名で検索... (Enter)"
        className="bg-transparent border-none outline-none text-[13px] text-[#c7c0b2] placeholder-[#c7c0b250] w-full"
      />
    </div>
  );
}
