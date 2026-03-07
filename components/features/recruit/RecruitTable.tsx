'use client';

import React from 'react';

export type RecruitTableData = {
  label: string;
  value: React.ReactNode;
  subColumn?: {
    label: string;
    value: React.ReactNode;
  };
};

export type RecruitTag = {
  label: string;
  active?: boolean;
};

interface RecruitTableProps {
  title?: string;
  data: RecruitTableData[];
  tags: RecruitTag[];
}

export function RecruitTable({ title, data, tags }: RecruitTableProps) {
  return (
    <div className="w-full">
      {title && (
        <h3 className="text-xl md:text-2xl font-serif text-center mb-10 text-foreground luxury-tracking uppercase">
          {title}
        </h3>
      )}
      
      <div className="border border-gray-200 bg-white overflow-hidden shadow-sm">
        {data.map((row, index) => (
          <div key={index} className={`flex flex-col md:flex-row ${index !== data.length - 1 ? 'border-b border-gray-200' : ''}`}>
            {/* 1列目 ラベル (モバイル: 上部固定, PC: 左固定幅) */}
            <div className="bg-[#f4ebe1]/40 md:w-56 shrink-0 flex items-center justify-center p-3 md:p-6 border-b md:border-b-0 md:border-r border-gray-200">
              <span className="text-xs font-bold tracking-widest text-[#171717]">{row.label}</span>
            </div>
            {/* 1列目 値 */}
            <div className={`p-4 md:p-6 text-xs md:text-sm text-gray-700 font-serif leading-loose ${row.subColumn ? 'md:w-1/2 md:border-r border-gray-200' : 'flex-1'} whitespace-pre-wrap`}>
              {row.value}
            </div>
            
            {/* 2列目 (職種・エリアのような分割用) */}
            {row.subColumn && (
              <>
                {/* 2列目 ラベル */}
                <div className="bg-[#f4ebe1]/40 md:w-40 shrink-0 flex items-center justify-center p-3 border-y md:border-y-0 md:border-r border-gray-200">
                  <span className="text-xs font-bold tracking-widest text-[#171717]">{row.subColumn.label}</span>
                </div>
                {/* 2列目 値 */}
                <div className="p-4 md:p-6 text-xs md:text-sm text-gray-700 font-serif leading-loose flex-1 whitespace-pre-wrap">
                  {row.subColumn.value}
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Tags */}
      {tags && tags.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-2 md:gap-3 justify-center">
          {tags.map((tag, i) => (
            <span 
              key={i} 
              className={`text-[10px] md:text-xs font-serif luxury-tracking px-4 py-2.5 text-center min-w-[100px] rounded-sm transition-colors ${
                tag.active 
                  ? 'bg-[#8c7a6b] text-white shadow-sm' 
                  : 'bg-gray-100 text-gray-400 border border-gray-200/60'
              }`}
            >
              {tag.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
