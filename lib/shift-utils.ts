/**
 * シフト関連のユーティリティ関数（クライアント・サーバー共用）
 * 'use server' を持たないため、クライアントコンポーネントからも安全にインポートできます。
 */

/**
 * Date オブジェクトを YYYY-MM-DD 形式の文字列に変換する
 * (ローカルタイムゾーンを維持)
 */
export function formatDate(date: Date): string {
  const d = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return d.toISOString().split('T')[0];
}

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

/**
 * 指定した月曜日から1週間分の日付リストを生成する
 */
export function getWeekDates(mondayStr: string): Date[] {
  const monday = new Date(mondayStr);
  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    days.push(d);
  }
  return days;
}
