import { appendFileSync } from 'node:fs';
import { NextResponse } from 'next/server';

/** Dev-only: append one NDJSON line for Cursor debug sessions (client cannot write disk). */
const LOG_PATH =
  '/Users/takumashinnyo/workspace/projects/10_active_projects/Animo/.cursor/debug-a3392f.log';

export async function POST(req: Request) {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ ok: false }, { status: 404 });
  }
  try {
    const text = await req.text();
    appendFileSync(LOG_PATH, text.endsWith('\n') ? text : `${text}\n`);
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
