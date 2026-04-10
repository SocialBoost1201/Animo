'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useTransition, useState, useEffect, useRef } from 'react'
import { Search, X, Loader2 } from 'lucide-react'
import { useDebounce } from 'use-debounce'

export function SearchBar({ placeholder = '検索...' }: { placeholder?: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const currentQuery = searchParams.get('q') || ''
  const [text, setText] = useState(currentQuery)
  const [debouncedText] = useDebounce(text, 400)

  const searchParamsRef = useRef(searchParams)
  searchParamsRef.current = searchParams

  useEffect(() => {
    const params = searchParamsRef.current
    if (params.get('q') === null && debouncedText === '') return

    startTransition(() => {
      const newParams = new URLSearchParams(params.toString())
      if (debouncedText) {
        newParams.set('q', debouncedText)
      } else {
        newParams.delete('q')
      }
      router.push(`${pathname}?${newParams.toString()}`)
    })
  }, [debouncedText, pathname, router])

  return (
    <div className="relative flex items-center w-full">
      <Search size={13} className="absolute left-3.5 text-[#5a5650]" />
      <input
        type="text"
        placeholder={placeholder}
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full h-[37px] pl-10 pr-9 text-[12px] font-medium bg-[#0e0e10] border border-[#ffffff14] rounded-[10px] text-[#f4f1ea] placeholder-[#5a5650] focus:outline-none focus:border-[#dfbd6940] transition-all"
      />
      {text && (
        <button
          onClick={() => setText('')}
          className="absolute right-2.5 text-[#5a5650] hover:text-[#c7c0b2] transition-colors p-1"
        >
          <X size={13} />
        </button>
      ) }
      {isPending && (
        <div className="absolute right-9 top-1/2 -translate-y-1/2">
          <Loader2 size={12} className="text-[#dfbd69] animate-spin" />
        </div>
      )}
    </div>
  )
}
