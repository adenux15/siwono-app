import { NextResponse } from 'next/server';
import { db } from '@/db';
import { sql } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const result = await db.execute(sql`SELECT table_name FROM information_schema.tables WHERE table_schema='public'`);
    return NextResponse.json({ success: true, tables: result });
  } catch (e: any) {
    const errObj = { message: e.message, code: e.code, name: e.name, stack: e.stack, detail: e.detail, hint: e.hint, internalQuery: e.query, parameters: e.parameters };
    return NextResponse.json({ success: false, error: errObj });
  }
}
