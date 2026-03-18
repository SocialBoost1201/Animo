'use client';

import { Download, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export function ExcelExportButton({ year, month }: { year: number, month: number }) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    toast.info('Excelファイルを作成しています...');
    
    try {
      // 実際にはブラウザの標準機能をトリガーする
      window.location.href = `/api/admin/export-shifts?year=${year}&month=${month}`;
      
      // location.href だと完了が検知できないため、擬似的に数秒後にローディング解除
      setTimeout(() => {
        setIsExporting(false);
        toast.success('ダウンロードを開始しました');
      }, 2500);

    } catch (error) {
      console.error(error);
      setIsExporting(false);
      toast.error('ダウンロードに失敗しました');
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={isExporting}
      className="flex items-center gap-2 bg-[#107c41] hover:bg-[#0b5a2f] text-white px-5 py-2.5 rounded-lg font-bold text-sm tracking-wider transition-colors shadow-sm disabled:opacity-50"
    >
      {isExporting ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
      {isExporting ? '作成中...' : 'Excel出力 (印刷用)'}
    </button>
  );
}
