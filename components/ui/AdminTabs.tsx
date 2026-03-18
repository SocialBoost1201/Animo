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
    <div className="flex bg-gray-100 p-1 rounded-lg w-fit">
      {options.map((opt) => {
        const isActive = value === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`px-4 py-2 text-sm font-bold rounded-md transition-all ${
              isActive
                ? 'bg-white text-[#171717] shadow-sm'
                : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
