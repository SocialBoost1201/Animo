import { NextResponse } from 'next/server';
import { getAdminMonthlyShifts } from '@/lib/actions/monthly-shifts';
import { generateMonthlyShiftExcel } from '@/lib/excel-generator';
import { createClient } from '@/lib/supabase/server';

const ALLOWED_ADMIN_ROLES = new Set(['owner', 'manager', 'admin']);

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

async function getAppRole(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string
) {
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .maybeSingle();

  if (profile?.role) {
    return profile.role;
  }

  const { data: userRole } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId)
    .maybeSingle();

  return userRole?.role ?? null;
}

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const role = await getAppRole(supabase, user.id);
    if (!role || !ALLOWED_ADMIN_ROLES.has(role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

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
    
  } catch (error: unknown) {
    console.error('Error in export-shifts API:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: getErrorMessage(error, 'Unknown error') },
      { status: 500 }
    );
  }
}
