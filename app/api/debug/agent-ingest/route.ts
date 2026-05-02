import { appendFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { NextResponse } from 'next/server';

/** Dev-only: append one NDJSON line for Cursor debug sessions (client cannot write disk). */
function logPath(): string {
  const dir = path.join(process.cwd(), '.cursor');
  try {
    mkdirSync(dir, { recursive: true });
  } catch {
    // ignore
  }
  return path.join(dir, 'debug-4da4d2.log');
}

export async function POST(req: Request) {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ ok: false }, { status: 404 });
  }
  try {
    const text = await req.text();
    appendFileSync(logPath(), text.endsWith('\n') ? text : `${text}\n`);
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
