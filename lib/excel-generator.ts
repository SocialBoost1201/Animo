import ExcelJS from 'exceljs';
import { MonthlyShiftDetail } from './actions/monthly-shifts';

export type ShiftExportData = {
  castId: string;
  stageName: string;
  shifts: Record<number, MonthlyShiftDetail>;
};

export async function generateMonthlyShiftExcel(year: number, month: number, shiftsData: ShiftExportData[]) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(`${year}年${month}月 シフト表`, {
    pageSetup: {
      paperSize: 9, // A4
      orientation: 'landscape', // 横向き
      fitToPage: true, // 1ページに収める
      fitToWidth: 1,
      fitToHeight: 1,
      margins: { left: 0.2, right: 0.2, top: 0.3, bottom: 0.3, header: 0.1, footer: 0.1 } // 余白最小化
    }
  });

  // タイトル行
  worksheet.mergeCells('A1:AF1');
  const titleCell = worksheet.getCell('A1');
  titleCell.value = `シフト表 ${year}年${month}月`;
  titleCell.font = { name: 'MS PGothic', size: 16, bold: true };
  titleCell.alignment = { vertical: 'middle', horizontal: 'center' };

  // 日付ヘッダー行作成 (A列=空白、B列〜AF列=1〜31)
  const daysInMonth = new Date(year, month, 0).getDate();
  const headerRow: Array<string | number> = ['キャスト名'];
  for (let i = 1; i <= daysInMonth; i++) {
    headerRow.push(i);
  }
  const header = worksheet.addRow(headerRow);
  
  header.font = { name: 'MS PGothic', size: 11, bold: true };
  header.alignment = { vertical: 'middle', horizontal: 'center' };

  // データ行の書き込み
  shiftsData.forEach(castData => {
    const rowContent: string[] = [castData.stageName];
    for (let day = 1; day <= daysInMonth; day++) {
       const detail = castData.shifts[day];
       let mark = '';

       if (detail) {
         if (detail.status === 'available') {
           if (detail.isDouhan) {
             mark = '同伴';
           } else if (detail.startTime) {
             // 21:00 => 21:00, or simplify "21" ? user requested: 20:00~
             mark = detail.startTime;
           } else {
             mark = '○';
           }
         } else if (detail.status === 'unavailable') {
           mark = '×';
         } else if (detail.status === 'maybe') {
           mark = '△';
         }
       }
       
       rowContent.push(mark);
    }
    const row = worksheet.addRow(rowContent);
    // 中央揃え
    row.alignment = { vertical: 'middle', horizontal: 'center' };
    row.getCell(1).alignment = { vertical: 'middle', horizontal: 'left' }; // 名前だけ左寄せ
  });

  // 列幅と罫線の設定
  worksheet.columns.forEach((col, index) => {
    col.width = index === 0 ? 18 : 5.5; // 名前列は広く、日付列は狭く(均等)。時間表記が入るため少し幅広に
    col.eachCell!({ includeEmpty: false }, (cell) => {
      // タイトル行以外に罫線を引く
      if (Number(cell.row) > 1) {
        cell.border = {
          top: {style:'thin'}, left: {style:'thin'}, bottom: {style:'thin'}, right: {style:'thin'}
        };
        cell.font = { name: 'MS PGothic', size: 10 }; // 10ptにして文字を詰めやすくする
        
        // 「同伴」の場合は少し目立たせる
        if (cell.value === '同伴' || cell.value === '△' || cell.value === '×') {
          cell.font = { name: 'MS PGothic', size: 10, color: { argb: cell.value === '×' ? 'FFFF0000' : 'FF000000' } };
        }
      }
    });
  });

  return workbook;
}
