import React from 'react';

export function AdminTabs({
  options,
  value,
  onChange,
}: {
  options: { label: string; value: string }[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex bg-white/5 p-1 rounded-sm w-fit border border-white/10">
      {options.map((opt) => {
        const isActive = value === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`px-4 py-2 text-xs font-bold tracking-widest uppercase rounded-sm transition-all ${
              isActive
                ? 'bg-white/10 text-[#f4f1ea] shadow-lg'
                : 'text-[#8a8478] hover:text-[#f4f1ea] hover:bg-white/5'
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
