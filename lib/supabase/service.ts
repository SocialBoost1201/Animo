import { createClient as createSupabaseClient } from '@supabase/supabase-js'

/**
 * RLSを完全にバイパスするサービスロールクライアント。
 * 公開データのSSR取得など、認証不要のサーバー側処理に限定して使用すること。
 * クライアントサイドに漏れないよう 'use server' ファイルのみで利用すること。
 */
export function createServiceClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}
