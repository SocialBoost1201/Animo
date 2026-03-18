import { NextResponse } from 'next/server';
import { getAdminMonthlyShifts } from '@/lib/actions/monthly-shifts';
import { generateMonthlyShiftExcel } from '@/lib/excel-generator';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const paramYear = searchParams.get('year');
  const paramMonth = searchParams.get('month');

  // 現在年月をデフォルトとする
  const now = new Date();
  const year = paramYear ? parseInt(paramYear) : now.getFullYear();
  const month = paramMonth ? parseInt(paramMonth) : now.getMonth() + 1;

  if (isNaN(year) || isNaN(month)) {
    return NextResponse.json({ error: 'Invalid year or month' }, { status: 400 });
  }

  try {
    // 1. 指定年月の全キャストのシフトデータを取得 (Actionを再利用)
    const shiftsData = await getAdminMonthlyShifts(year, month);

    // 2. Excelワークブック生成
    const workbook = await generateMonthlyShiftExcel(year, month, shiftsData);

    // 3. バッファに書き込んでレスポンス
    const buffer = await workbook.xlsx.writeBuffer();

    const headers = new Headers();
    headers.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    const filename = `shifts_${year}_${String(month).padStart(2, '0')}.xlsx`;
    headers.set('Content-Disposition', `attachment; filename="${filename}"`);

    return new NextResponse(buffer, { status: 200, headers });
    
  } catch (error: any) {
    console.error('Error in export-shifts API:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
