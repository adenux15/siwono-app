import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { archives, albums, racks, rooms } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: archiveId } = await params;

    if (!archiveId) {
      return NextResponse.json({ error: "ID Arsip diperlukan." }, { status: 400 });
    }

    const results = await db
      .select({
        id: archives.id,
        archiveNumber: archives.archiveNumber,
        ownerName: archives.ownerName,
        status: archives.status,
        regionCode: archives.regionCode,
        docType: archives.docType,
        album: {
          id: albums.id,
          code: albums.code,
          rowPos: albums.rowPos,
          colPos: albums.colPos,
        },
        rack: {
          id: racks.id,
          code: racks.code,
        },
        room: {
          id: rooms.id,
          name: rooms.name,
          type: rooms.type,
        },
      })
      .from(archives)
      .leftJoin(albums, eq(archives.albumId, albums.id))
      .leftJoin(racks, eq(albums.rackId, racks.id))
      .leftJoin(rooms, eq(racks.roomId, rooms.id))
      .where(eq(archives.id, archiveId))
      .limit(1);

    if (results.length === 0) {
      return NextResponse.json(
        { error: "Arsip tidak ditemukan." },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: results[0] }, { status: 200 });
  } catch (error) {
    console.error("Detail API Error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat mengambil detail arsip." },
      { status: 500 }
    );
  }
}
