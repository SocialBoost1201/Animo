import { NextResponse } from 'next/server';
import path from 'path';
import XlsxPopulate from 'xlsx-populate';
import { type TemplateShiftData } from '@/lib/template-shift-utils';
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

export async function POST(req: Request) {
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

    const data: TemplateShiftData = await req.json();

    const templatePath = path.join(process.cwd(), 'data', 'templates', 'animo_shift_template.xlsx');
    
    // テンプレートを読み込む (xlsx-populate はフォーマットや関数の維持能力が非常に高い)
    const workbook = await XlsxPopulate.fromFileAsync(templatePath);
    
    const sheet1 = workbook.sheet(0);
    const sheet2 = workbook.sheet(1); // シート2 (16日〜31日用)

    if (!sheet1) {
      throw new Error('Template sheet not found');
    }

    // 2. 年月 (T1, T2) の設定
    sheet1.cell('T1').value(data.year);
    sheet1.cell('T2').value(data.month);
    sheet1.cell('C1').value(`Animo シフト表 ${data.year}年 ${data.month}月 前半`).style('horizontalAlignment', 'center');
    
    if (sheet2) {
      sheet2.cell('T1').value(data.year);
      sheet2.cell('T2').value(data.month);
      sheet2.cell('C1').value(`Animo シフト表 ${data.year}年 ${data.month}月 後半`).style('horizontalAlignment', 'center');
    }

    // 3. キャストデータの書き出し
    const startRow = 3; 
    
    data.casts.forEach((cast: { name: string; shifts: Record<string, string> }, index: number) => {
      const rowNum = startRow + index;
      
      // -- 前半 (1〜15日) の処理 --
      sheet1.cell(rowNum, 2).value(cast.name); // B列 (Col 2)
      
      for(let i = 1; i <= 15; i++) {
        const val = cast.shifts[String(i)];
        if(val) sheet1.cell(rowNum, 2 + i).value(val); // C列(3)〜
      }
      
      // -- 後半 (16〜31日) の処理 --
      if (sheet2) {
        sheet2.cell(rowNum, 2).value(cast.name); // B列 (Col 2)
        
        for(let i = 16; i <= 31; i++) {
          const val = cast.shifts[String(i)];
          // i=16のとき C列(3)になる計算 -> 2 + (i - 15)
          if(val) sheet2.cell(rowNum, 2 + (i - 15)).value(val);
        }
      }
    });

    // 4. Blob(バイナリ)として出力
    const buffer = await workbook.outputAsync();
    
    const headers = new Headers();
    // xlsx-populate の出力は base64 などのバッファ形式になるため、Uint8Array等の buffer そのまま返す
    headers.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    headers.set('Content-Disposition', `attachment; filename="shift_${data.year}_${data.month}.xlsx"`);

    return new NextResponse(buffer, { status: 200, headers });
  } catch (error: unknown) {
    console.error('Export Error:', error);
    return NextResponse.json(
      { error: 'Failed to export excel', details: getErrorMessage(error, 'Unknown error') },
      { status: 500 }
    );
  }
}
