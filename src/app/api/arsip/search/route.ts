import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { archives, albums, racks, rooms } from '@/db/schema';
import { like, or, eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json({ data: [] }, { status: 200 });
    }

    const searchPattern = `%${query}%`;

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
      .where(
        or(
          like(archives.archiveNumber, searchPattern),
          like(archives.ownerName, searchPattern),
          like(archives.regionCode, searchPattern)
        )
      )
      .limit(50); // Batasi hasil pencarian agar lebih ringan

    return NextResponse.json({ data: results }, { status: 200 });
  } catch (error) {
    console.error("Search API Error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat mencari arsip." },
      { status: 500 }
    );
  }
}
