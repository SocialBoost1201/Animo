import { TemplateShiftEditor } from '@/components/features/admin/monthly-shifts/TemplateShiftEditor';
import { CalendarDays } from 'lucide-react';
import { TemplateShiftData } from '@/lib/actions/template-shifts';

export default async function TemplateShiftsPage() {
  // 初期データ（デモ用）
  // 実際はDBやCMSから取得してここへ流し込む想定の構造
  const now = new Date();
  const initialData: TemplateShiftData = {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    casts: [
      {
        name: 'あんな',
        shifts: {
          '1': '出勤',
          '2': '休み',
          '3': '出勤',
          '10': '出勤',
          '15': '休み',
          '20': '出勤',
          '30': '休み'
        }
      },
      {
        name: 'みさき',
        shifts: {
          '1': '休み',
          '2': '出勤',
          '5': '出勤',
          '14': '出勤'
        }
      }
    ]
  };

  return (
    <div className="space-y-6 print:space-y-0 print:m-0 print:p-0">
      <div className="print:hidden">
        <h1 className="text-2xl font-bold flex items-center gap-2 font-serif tracking-widest text-[#171717] dark:text-white">
          <CalendarDays className="text-gold" />
          TEMPLATE SHIFTS
        </h1>
        <p className="text-sm text-gray-500 mt-2">
          Excelテンプレート「animo_shift_template.xlsx」と連動するシフト管理画面です。<br/>
          日付や曜日は自動計算されます。「PDF / 印刷」ボタンを押すとA4横プリント用に最適化されます。
        </p>
      </div>

      <TemplateShiftEditor initialData={initialData} />
    </div>
  );
}
