import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    // Admin 権限チェック（サービスロールキーが必要）
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    // 操作者の認証確認
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 操作者が owner であることを確認
    const { data: callerProfile } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (callerProfile?.role !== 'owner') {
      return NextResponse.json({ error: 'オーナー権限が必要です' }, { status: 403 });
    }

    const { email, role } = await req.json();

    if (!email || !role) {
      return NextResponse.json({ error: 'email と role は必須です' }, { status: 400 });
    }

    if (!['manager', 'staff'].includes(role)) {
      return NextResponse.json({ error: '招待できる権限は manager または staff のみです' }, { status: 400 });
    }

    const inviteRedirectUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? 'https://animo-lake.vercel.app'}/admin/login`;

    // Supabase Admin API でメール招待（招待メールが自動送信される）
    const { data: invitedUser, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(
      email,
      { redirectTo: inviteRedirectUrl }
    );

    if (inviteError) {
      return NextResponse.json({ error: inviteError.message }, { status: 500 });
    }

    // 招待されたユーザーの profiles レコードを事前作成して役職を設定
    if (invitedUser?.user?.id) {
      await supabaseAdmin.from('profiles').upsert({
        id: invitedUser.user.id,
        role,
        display_name: email.split('@')[0],
        updated_at: new Date().toISOString(),
      });
    }

    return NextResponse.json({ success: true, email });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
