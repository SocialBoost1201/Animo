'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useTransition, useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useDebounce } from 'use-debounce';

export function SearchBar({ placeholder = '検索...' }: { placeholder?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentQuery = searchParams.get('q') || '';
  const [text, setText] = useState(currentQuery);
  const [debouncedText] = useDebounce(text, 400);

  useEffect(() => {
    setText(currentQuery);
  }, [currentQuery]);

  useEffect(() => {
    if (debouncedText === currentQuery) return;

    startTransition(() => {
      const newParams = new URLSearchParams(searchParams.toString());
      if (debouncedText) {
        newParams.set('q', debouncedText);
      } else {
        newParams.delete('q');
      }
      router.push(`${pathname}?${newParams.toString()}`);
    });
  }, [currentQuery, debouncedText, pathname, router, searchParams]);

  return (
    <div className="relative flex items-center w-full max-w-sm">
      <Search size={16} className="absolute left-3 text-[#b7af9f]" />
      <input
        type="text"
        placeholder={placeholder}
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full pl-9 pr-8 py-2.5 text-sm border border-[#dfbd69]/22 rounded-[12px] focus:outline-none focus:border-gold/60 focus:ring-1 focus:ring-gold/30 bg-[#1c1d22] text-[#f4f1ea] transition-all placeholder:text-[#978d7d] shadow-[0_8px_22px_rgba(0,0,0,0.18)]"
      />
      {text && (
        <button
          onClick={() => setText('')}
          className="absolute right-2 text-[#b7af9f] hover:text-[#f4f1ea] transition-colors p-1"
        >
          <X size={14} />
        </button>
      )}
      {isPending && (
        <div className="absolute right-8 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-gold border-t-transparent animate-spin" />
      )}
    </div>
  );
}
