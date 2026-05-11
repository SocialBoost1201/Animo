import { createServiceClient } from '@/lib/supabase/service';

/**
 * 管理アクションの監査ログ用 action 種別。
 * Phase 1 では新しい種別が必要になれば union を追加する。
 */
export type AdminAuditAction =
  | 'approve'
  | 'reject'
  | 'delete'
  | 'publish'
  | 'unpublish'
  | 'attendance_toggle'
  | 'shift_change'
  | 'cast_info_change'
  | 'role_change'
  | 'line_notification_send'
  | 'admin_settings_change';

export type AdminAuditLogParams = {
  /** 操作したユーザーの auth.user_id */
  actorUserId: string;
  action: AdminAuditAction;
  /** 対象テーブル/エンティティ種別 (例: 'shift_submission', 'cast_post') */
  targetType: string;
  /** 対象レコードのID（uuid 文字列または複合 ID 文字列） */
  targetId?: string | null;
  /** 変更前データのスナップショット（任意項目のみ） */
  beforeData?: unknown;
  /** 変更後データのスナップショット（任意項目のみ） */
  afterData?: unknown;
  /** 補助情報（影響範囲・件数・備考など） */
  metadata?: Record<string, unknown>;
};

/**
 * 管理アクションを admin_audit_logs に記録する。
 *
 * - service_role で書き込むため RLS をバイパス
 * - 操作したユーザーのロールは user_roles から自動取得
 * - 失敗しても操作本体をブロックしない（fire-and-forget、warn のみ）
 */
export async function logAdminAction(params: AdminAuditLogParams): Promise<void> {
  try {
    const supabase = createServiceClient();

    // 操作者のロールを取得（記録時点のロールをスナップショット）
    let actorRole: string | null = null;
    try {
      const { data: roleRow } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', params.actorUserId)
        .maybeSingle();
      actorRole = roleRow?.role ?? null;
    } catch {
      // role lookup の失敗はログ本体を止めない
    }

    await supabase.from('admin_audit_logs').insert({
      actor_user_id: params.actorUserId,
      actor_role: actorRole,
      action: params.action,
      target_type: params.targetType,
      target_id: params.targetId ?? null,
      before_data: (params.beforeData ?? null) as never,
      after_data: (params.afterData ?? null) as never,
      metadata: (params.metadata ?? null) as never,
    });
  } catch (err) {
    console.warn('[admin-audit] log failed (non-critical):', err);
  }
}
