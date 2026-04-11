import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const [pendingPosts, pendingShifts] = await Promise.all([
    supabase.from('cast_posts').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('shift_submissions').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
  ]);

  return NextResponse.json(
    {
      pendingPostsCount: pendingPosts.count || 0,
      pendingShiftsCount: pendingShifts.count || 0,
    },
    {
      status: 200,
      headers: {
        'Cache-Control': 'no-store',
      },
    }
  );
}

