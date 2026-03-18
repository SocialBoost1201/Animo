/**
 * シフト関連のユーティリティ関数（クライアント・サーバー共用）
 * 'use server' を持たないため、クライアントコンポーネントからも安全にインポートできます。
 */

/**
 * 対象週月曜日を取得するユーティリティ
 */
export function getTargetWeekMonday(baseDate: Date = new Date()): Date {
  const date = new Date(baseDate);
  const day = date.getDay();
  // day: 0=Sun, 1=Mon, ..., 6=Sat
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(date.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  return monday;
}
