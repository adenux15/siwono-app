"use server"

import { db } from "@/db"
import { rooms, racks, albums, archives } from "@/db/schema"
import { eq, desc, asc, like, or, and, count } from "drizzle-orm"
import { revalidatePath } from "next/cache"

export async function getRooms() {
  try {
    const data = await db.select().from(rooms)
    return { success: true, data }
  } catch (error) {
    console.error("Error fetching rooms:", error)
    return { success: false, error: "Gagal mengambil data ruang." }
  }
}

export async function getRacks(roomId?: string) {
  try {
    let query = db.select().from(racks)
    if (roomId) {
      query = query.where(eq(racks.roomId, roomId)) as any
    }
    const data = await query
    return { success: true, data }
  } catch (error) {
    console.error("Error fetching racks:", error)
    return { success: false, error: "Gagal mengambil data rak." }
  }
}

export async function getAlbums(rackId?: string) {
  try {
    let query = db.select().from(albums)
    if (rackId) {
      query = query.where(eq(albums.rackId, rackId)) as any
    }
    const data = await query
    return { success: true, data }
  } catch (error) {
    console.error("Error fetching albums:", error)
    return { success: false, error: "Gagal mengambil data album." }
  }
}

export async function createArchive(data: {
  archiveNumber: string
  ownerName: string
  regionCode: string
  docType: string
  albumId: string
}) {
  try {
    return await db.transaction(async (tx) => {
      // Find album and check capacity
      const albumResult = await tx.select().from(albums).where(eq(albums.id, data.albumId)).limit(1)
      const album = albumResult[0]

      if (!album) {
        return { success: false, error: "Album tidak ditemukan." }
      }

      if (album.currentFill >= album.capacity) {
        return { success: false, error: "Kapasitas album penuh." }
      }

      // Check if archiveNumber already exists
      const existingArchive = await tx.select().from(archives).where(eq(archives.archiveNumber, data.archiveNumber)).limit(1)
      if (existingArchive.length > 0) {
        return { success: false, error: "Nomor warkah sudah terdaftar." }
      }

      // Insert archive
      await tx.insert(archives).values({
        id: crypto.randomUUID(),
        archiveNumber: data.archiveNumber,
        ownerName: data.ownerName,
        regionCode: data.regionCode,
        docType: data.docType,
        albumId: data.albumId,
        status: "Tersedia",
        createdAt: new Date(),
      })

      // Update album capacity
      await tx.update(albums)
        .set({ currentFill: album.currentFill + 1 })
        .where(eq(albums.id, album.id))

      return { success: true }
    })
  } catch (error) {
    console.error("Error creating archive:", error)
    return { success: false, error: "Gagal menyimpan arsip baru." }
  } finally {
    revalidatePath("/arsip")
    revalidatePath("/dashboard")
  }
}

export async function getArchiveList({
  search = "",
  status,
  docType,
  sortBy = "createdAt",
  sortOrder = "desc",
  page = 1,
  limit = 10,
}: {
  search?: string
  status?: string
  docType?: string
  sortBy?: "createdAt" | "archiveNumber"
  sortOrder?: "asc" | "desc"
  page?: number
  limit?: number
}) {
  try {
    const conditions = []
    if (search) {
      conditions.push(or(like(archives.archiveNumber, `%${search}%`), like(archives.ownerName, `%${search}%`)))
    }
    if (status) {
      conditions.push(eq(archives.status, status))
    }
    if (docType) {
      conditions.push(eq(archives.docType, docType))
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined

    let orderByClause
    if (sortBy === "createdAt") {
      orderByClause = sortOrder === "asc" ? asc(archives.createdAt) : desc(archives.createdAt)
    } else {
      orderByClause = sortOrder === "asc" ? asc(archives.archiveNumber) : desc(archives.archiveNumber)
    }

    const offset = (page - 1) * limit

    const data = await db
      .select({
        id: archives.id,
        archiveNumber: archives.archiveNumber,
        ownerName: archives.ownerName,
        status: archives.status,
        regionCode: archives.regionCode,
        docType: archives.docType,
        albumCode: albums.code,
        rackCode: racks.code,
        roomName: rooms.name,
      })
      .from(archives)
      .leftJoin(albums, eq(archives.albumId, albums.id))
      .leftJoin(racks, eq(albums.rackId, racks.id))
      .leftJoin(rooms, eq(racks.roomId, rooms.id))
      .where(whereClause)
      .orderBy(orderByClause)
      .limit(limit)
      .offset(offset)

    const totalResult = await db
      .select({ count: count() })
      .from(archives)
      .where(whereClause)
      
    const total = totalResult[0].count

    return { success: true, data, total, page, limit, totalPages: Math.ceil(total / limit) }
  } catch (error) {
    console.error("Error fetching archives:", error)
    return { success: false, error: "Gagal mengambil daftar arsip." }
  }
}

export async function updateArchive(id: string, data: {
  archiveNumber?: string
  ownerName?: string
  regionCode?: string
  docType?: string
  status?: string
  albumId?: string
}) {
  try {
    return await db.transaction(async (tx) => {
      const existingResult = await tx.select().from(archives).where(eq(archives.id, id)).limit(1)
      const existing = existingResult[0]
      if (!existing) {
        return { success: false, error: "Arsip tidak ditemukan." }
      }

      if (data.albumId && data.albumId !== existing.albumId) {
        // Handle album capacity change
        const oldAlbumRes = await tx.select().from(albums).where(eq(albums.id, existing.albumId)).limit(1)
        const newAlbumRes = await tx.select().from(albums).where(eq(albums.id, data.albumId)).limit(1)
        
        if (newAlbumRes[0] && newAlbumRes[0].currentFill >= newAlbumRes[0].capacity) {
          return { success: false, error: "Kapasitas album tujuan penuh." }
        }

        if (oldAlbumRes[0]) {
          await tx.update(albums).set({ currentFill: Math.max(0, oldAlbumRes[0].currentFill - 1) }).where(eq(albums.id, existing.albumId))
        }
        if (newAlbumRes[0]) {
          await tx.update(albums).set({ currentFill: newAlbumRes[0].currentFill + 1 }).where(eq(albums.id, data.albumId))
        }
      }

      await tx.update(archives)
        .set(data)
        .where(eq(archives.id, id))

      return { success: true }
    })
  } catch (error) {
    console.error("Error updating archive:", error)
    return { success: false, error: "Gagal mengubah data arsip." }
  } finally {
    revalidatePath("/arsip")
    revalidatePath("/dashboard")
  }
}



