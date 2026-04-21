'use client';

import React, { useState } from 'react';
import { Download, Printer, Plus } from 'lucide-react';
import { generateDaysForSplit, type TemplateShiftData, type SplitDay } from '@/lib/template-shift-utils';
import { toast } from 'sonner';

export function TemplateShiftEditor({ initialData }: { initialData: TemplateShiftData }) {
  const [data, setData] = useState<TemplateShiftData>(initialData);
  const [isExporting, setIsExporting] = useState(false);

  // 1-15日 と 16-末日 の日付配列を生成
  const daysFirstHalf = generateDaysForSplit(data.year, data.month, 1, 15);
  const daysSecondHalf = generateDaysForSplit(data.year, data.month, 16, 31);

  const handlePrint = () => {
    window.print();
  };

  const handleExportExcel = async () => {
    setIsExporting(true);
    toast.info('Excelファイルを作成しています...');
    
    try {
      const res = await fetch('/api/admin/export-template-shifts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!res.ok) throw new Error('API Error');

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `shift_${data.year}_${data.month}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success('ダウンロードしました');
    } catch (err) {
      console.error(err);
      toast.error('Excel出力に失敗しました。');
    } finally {
      setIsExporting(false);
    }
  };

  // セルの値を変更するハンドラー
  const handleCellChange = (castIndex: number, day: number, value: string) => {
    const newData = { ...data };
    newData.casts[castIndex].shifts[day] = value;
    setData(newData);
  };
  
  // キャストを追加するハンドラー（デモ用）
  const handleAddCast = () => {
    setData({
      ...data,
      casts: [...data.casts, { name: '新規キャスト', shifts: {} }]
    });
  };

  // 年月を変更するハンドラー
  const handleDateChange = (type: 'year' | 'month', val: number) => {
    setData({ ...data, [type]: val });
  };

  // 印刷にも対応した共通テーブル描画関数
  const renderTable = (days: SplitDay[]) => (
    <div className="overflow-x-auto print:overflow-visible">
      <table className="w-full text-sm border-collapse border border-white/20 bg-black/50 print:bg-white print:border-gray-400">
        <thead>
          <tr>
            <th className="border border-white/20 p-2 bg-white/10 text-[#f4f1ea] print:bg-gray-100 print:text-black print:border-gray-400 font-bold min-w-[120px]">
              名前
            </th>
            {days.map(d => (
              <th 
                key={d.day} 
                className={`border border-white/20 p-1.5 text-center font-bold text-xs whitespace-nowrap print:border-gray-400
                  ${d.isWeekend ? 'text-red-400 print:text-red-600' : 'text-[#8a8478] print:text-black'}`}
              >
                {d.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.casts.map((cast, cIndex) => (
            <tr key={cIndex} className="hover:bg-white/5 print:hover:bg-transparent transition-colors">
              <td className="border border-white/20 p-0 text-center font-bold print:border-gray-400">
                <input
                  type="text"
                  value={cast.name}
                  onChange={(e) => {
                    const newData = { ...data };
                    newData.casts[cIndex].name = e.target.value;
                    setData(newData);
                  }}
                  className="w-full h-full p-2 text-center bg-transparent outline-none text-[#f4f1ea] print:text-black focus:bg-gold/10 print:border-none"
                />
              </td>
              {days.map(d => (
                <td key={d.day} className="border border-white/20 p-0 text-center text-xs print:border-gray-400">
                  <input
                    type="text"
                    value={cast.shifts[String(d.day)] || ''}
                    onChange={(e) => handleCellChange(cIndex, d.day, e.target.value)}
                    className="w-full h-full p-2 text-center bg-transparent outline-none text-[#f4f1ea] print:text-black focus:bg-gold/10 font-bold print:border-none"
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="space-y-8 print:m-0 print:p-0 print:space-y-4">

      {/* --- UI Tools (印刷時は非表示) --- */}
      <div className="print:hidden bg-black/95 p-4 md:p-6 rounded-2xl shadow-sm border border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <select 
              value={data.year} 
              onChange={(e) => handleDateChange('year', Number(e.target.value))}
              className="border border-white/10 rounded-lg px-3 py-2 bg-black text-[#f4f1ea] font-bold outline-none focus:border-gold/50"
            >
              {[2025, 2026, 2027].map(y => <option key={y} value={y}>{y}年</option>)}
            </select>
            <select 
              value={data.month} 
              onChange={(e) => handleDateChange('month', Number(e.target.value))}
              className="border border-white/10 rounded-lg px-3 py-2 bg-black text-[#f4f1ea] font-bold outline-none focus:border-gold/50"
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map(m => <option key={m} value={m}>{m}月</option>)}
            </select>
          </div>
          <button 
            onClick={handleAddCast}
            className="flex items-center gap-1 text-sm text-gold hover:text-gold/80 font-bold px-3 py-2 transition-colors"
          >
            <Plus size={16} /> 行を追加
          </button>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button 
            onClick={handlePrint} 
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-[#f4f1ea] hover:bg-white text-black px-5 py-2.5 rounded-lg font-bold text-sm tracking-wider shadow-sm transition-all active:scale-95"
          >
            <Printer size={16} /> PDF / 印刷
          </button>
          <button 
            onClick={handleExportExcel} 
            disabled={isExporting}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-[#107c41] hover:bg-[#0b5a2f] text-white px-5 py-2.5 rounded-lg font-bold text-sm tracking-wider shadow-sm transition-transform active:scale-95 disabled:opacity-50"
          >
            <Download size={16} /> Excel保存
          </button>
        </div>
      </div>

      <div className="print:hidden text-sm text-[#5a5650] mb-2 px-2">
        ※ 印刷時 (Ctrl + P) は自動的にA4横・2枚（1〜15日/16〜末日）に分割され、UIボタン等は隠れます。
      </div>

      {/* --- Page 1 (1〜15日) --- */}
      {/* print:break-after-page によりここで物理的な改ページが入る */}
      <div className="bg-black/95 print:bg-white p-4 md:p-6 rounded-2xl shadow-sm print:shadow-none border border-white/10 print:border-none print:break-after-page">
        <h3 className="text-xl font-bold mb-4 font-serif text-[#f4f1ea] print:text-black">
          {data.year}年 {data.month}月度 シフト表 <span className="text-[#5a5650] text-sm ml-2 print:text-gray-400">( 1日 〜 15日 )</span>
        </h3>
        {renderTable(daysFirstHalf)}
      </div>

      {/* --- Page 2 (16〜31日) --- */}
      <div className="bg-black/95 print:bg-white p-4 md:p-6 rounded-2xl shadow-sm print:shadow-none border border-white/10 print:border-none">
        <h3 className="text-xl font-bold mb-4 font-serif text-[#f4f1ea] print:text-black">
          {data.year}年 {data.month}月度 シフト表 <span className="text-[#5a5650] text-sm ml-2 print:text-gray-400">( 16日 〜 末日 )</span>
        </h3>
        {renderTable(daysSecondHalf)}
      </div>

      {/* 印刷用のグローバルスタイル注入 */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          @page {
            size: A4 landscape;
            margin: 10mm;
          }
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      `}} />
    </div>
  );
}
