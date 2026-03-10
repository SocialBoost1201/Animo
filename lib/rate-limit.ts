import { NextRequest } from 'next/server';

type RateLimitRecord = {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

// クリーンアップ処理（一定時間ごとに古いIP記録を削除）
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of rateLimitStore.entries()) {
    if (record.resetAt < now) {
      rateLimitStore.delete(ip);
    }
  }
}, 60 * 1000); // 1分ごとに実行

export function checkRateLimit(req: NextRequest, limit: number, windowMs: number): { success: boolean, remaining: number } {
  const ip = req.headers.get('x-forwarded-for') || 'unknown-ip';
  const now = Date.now();

  const record = rateLimitStore.get(ip);

  if (!record) {
    // 新規IP
    rateLimitStore.set(ip, {
      count: 1,
      resetAt: now + windowMs
    });
    return { success: true, remaining: limit - 1 };
  }

  if (now > record.resetAt) {
    // 時間切れの場合はリセット
    record.count = 1;
    record.resetAt = now + windowMs;
    return { success: true, remaining: limit - 1 };
  }

  // カウントアップ
  record.count += 1;

  if (record.count > limit) {
    return { success: false, remaining: 0 };
  }

  return { success: true, remaining: limit - record.count };
}
