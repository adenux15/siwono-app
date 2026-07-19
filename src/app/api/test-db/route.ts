import { NextResponse } from 'next/server';
import { db } from '@/db';
import { sql } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const result = await db.execute(sql`SELECT table_name FROM information_schema.tables WHERE table_schema='public'`);
    return NextResponse.json({ success: true, tables: result });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message, stack: e.stack });
  }
}
