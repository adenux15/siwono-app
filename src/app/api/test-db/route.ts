import { NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const result = await db.select().from(users).limit(1);
    return NextResponse.json({ success: true, data: result, env: process.env.DATABASE_URL?.substring(0, 20) + "..." });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message, stack: e.stack, code: e.code, env: process.env.DATABASE_URL?.substring(0, 20) + "..." });
  }
}
