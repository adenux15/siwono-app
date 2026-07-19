import { NextResponse } from 'next/server'
import { db } from '@/db'
import { archives, rooms, racks, albums } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: Request) {
  try {
    const { data } = await request.json()

    if (!data || !Array.isArray(data)) {
      return NextResponse.json({ success: false, error: 'Format data tidak valid' }, { status: 400 })
    }

    let importedCount = 0

    // Fetch all locations to map them
    const allRooms = await db.select().from(rooms)
    const allRacks = await db.select().from(racks)
    const allAlbums = await db.select().from(albums)

    // Helper to find location
    const findAlbum = (roomName: string, rackCode: string, albumCode: string) => {
      const room = allRooms.find(r => r.name.toLowerCase() === roomName?.toLowerCase())
      if (!room) return null
      
      const rack = allRacks.find(r => r.roomId === room.id && r.code.toLowerCase() === rackCode?.toLowerCase())
      if (!rack) return null

      const album = allAlbums.find(a => a.rackId === rack.id && a.code.toLowerCase() === albumCode?.toLowerCase())
      return album
    }

    // Process each row
    for (const row of data) {
      // Expected columns: 'Nomor Warkah', 'Jenis', 'Pemilik', 'Ruang', 'Rak', 'Album'
      const archiveNumber = row['Nomor Warkah'] || row['nomor warkah'] || row['ID Warkah']
      const docType = row['Jenis'] || row['jenis'] || row['Jenis Dokumen'] || 'Warkah'
      const ownerName = row['Pemilik'] || row['pemilik'] || row['Nama Pemilik'] || '-'
      const roomName = row['Ruang'] || row['ruang'] || row['Ruangan'] || ''
      const rackCode = row['Rak'] || row['rak'] || ''
      const albumCode = row['Album'] || row['album'] || row['Box'] || ''

      if (!archiveNumber) continue // Skip empty rows

      const targetAlbum = findAlbum(String(roomName), String(rackCode), String(albumCode))
      if (!targetAlbum) continue

      await db.insert(archives).values({
        id: uuidv4(),
        archiveNumber: String(archiveNumber),
        docType: String(docType),
        ownerName: String(ownerName),
        albumId: targetAlbum.id,
        status: 'Tersedia',
        createdAt: new Date(),
      })

      importedCount++
    }

    return NextResponse.json({ success: true, count: importedCount })
  } catch (error) {
    console.error('Import error:', error)
    return NextResponse.json({ success: false, error: 'Terjadi kesalahan pada server' }, { status: 500 })
  }
}
