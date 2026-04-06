import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// 管理者権限（Service Role Key）でSupabaseを初期化し、RLSをバイパスしてRPCを実行する
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { postId } = body;

    if (!postId) {
      return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
    }

    // クライアントのIPアドレス（プロキシ等のヘッダーを順番に確認）
    const forwardedFor = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const viewerIp = forwardedFor ? forwardedFor.split(',')[0].trim() : (realIp || 'unknown-ip');
    
    // User Agent
    const userAgent = request.headers.get('user-agent') || 'unknown-ua';

    // IPとUAを組み合わせてハッシュ化（プライバシー保護とスパム判定用）
    const viewerIpHash = Buffer.from(`${viewerIp}-${userAgent}`).toString('base64');

    // SupabaseのRPCを呼び出してPVを安全にインクリメント
    // (※SQL側で同一IPからの1時間以内の連打は無視されるようになっている)
    const { data: success, error } = await supabaseAdmin.rpc('increment_post_view_count', {
      target_post_id: postId,
      viewer_ip_hash: viewerIpHash,
      user_agent_text: userAgent,
    });

    if (error) {
      console.error('Error tracking view:', error);
      return NextResponse.json({ error: 'Failed to track view' }, { status: 500 });
    }

    return NextResponse.json({ success });
  } catch (error) {
    console.error('Track View Exception:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
