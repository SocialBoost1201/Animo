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
          <div
            key={index}
            className={`border-b border-gray-200 last:border-b-0`}
          >
            {/* ─ 通常行（subColumn なし）─ */}
            {!row.subColumn && (
              <div className="flex flex-col sm:flex-row">
                {/* ラベル */}
                <div className="bg-[#f4ebe1]/50 sm:w-44 md:w-56 shrink-0 flex items-center justify-center px-4 py-3 border-b sm:border-b-0 sm:border-r border-gray-200">
                  <span className="text-xs font-bold tracking-widest text-foreground text-center">
                    {row.label}
                  </span>
                </div>
                {/* 値 */}
                <div className="flex-1 p-4 md:p-6 text-xs md:text-sm text-gray-700 font-serif leading-loose whitespace-pre-wrap min-w-0">
                  {row.value}
                </div>
              </div>
            )}

            {/* ─ 2分割行（subColumn あり）─ */}
            {row.subColumn && (
              <>
                {/* PC: 1行で4セル / スマホ: 主項目を上、サブ項目を下に */}
                <div className="flex flex-col sm:flex-row">
                  {/* メインラベル */}
                  <div className="bg-[#f4ebe1]/50 sm:w-44 md:w-56 shrink-0 flex items-center justify-center px-4 py-3 border-b sm:border-b-0 sm:border-r border-gray-200">
                    <span className="text-xs font-bold tracking-widest text-foreground text-center">
                      {row.label}
                    </span>
                  </div>
                  {/* メイン値 */}
                  <div className="flex-1 p-4 md:p-6 text-xs md:text-sm text-gray-700 font-serif leading-loose whitespace-pre-wrap min-w-0 border-b sm:border-b-0 sm:border-r border-gray-200">
                    {row.value}
                  </div>
                  {/* サブラベル */}
                  <div className="bg-[#f4ebe1]/50 sm:w-28 md:w-36 shrink-0 flex items-center justify-center px-4 py-3 border-b sm:border-b-0 sm:border-r border-gray-200">
                    <span className="text-xs font-bold tracking-widest text-foreground text-center">
                      {row.subColumn.label}
                    </span>
                  </div>
                  {/* サブ値 */}
                  <div className="flex-1 p-4 md:p-6 text-xs md:text-sm text-gray-700 font-serif leading-loose whitespace-pre-wrap min-w-0">
                    {row.subColumn.value}
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Tags */}
      {tags && tags.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2 justify-center">
          {tags.map((tag, i) => (
            <span
              key={i}
              className={`text-xs font-serif luxury-tracking px-3 py-2 text-center rounded-sm transition-colors ${
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
