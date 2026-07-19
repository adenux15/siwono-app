"use server"

import { db } from "@/db"
import { racks, rooms } from "@/db/schema"
import { eq, desc, asc, like, and, count, or } from "drizzle-orm"
import { revalidatePath } from "next/cache"

export async function getRackList({
  search = "",
  roomId,
  sortBy = "createdAt",
  sortOrder = "desc",
  page = 1,
  limit = 10,
}: {
  search?: string
  roomId?: string
  sortBy?: "createdAt" | "code"
  sortOrder?: "asc" | "desc"
  page?: number
  limit?: number
}) {
  try {
    const conditions = []
    if (search) {
      conditions.push(like(racks.code, `%${search}%`))
    }
    if (roomId) {
      conditions.push(eq(racks.roomId, roomId))
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined

    let orderByClause
    if (sortBy === "createdAt") {
      orderByClause = sortOrder === "asc" ? asc(racks.createdAt) : desc(racks.createdAt)
    } else {
      orderByClause = sortOrder === "asc" ? asc(racks.code) : desc(racks.code)
    }

    const offset = (page - 1) * limit

    const data = await db
      .select({
        id: racks.id,
        code: racks.code,
        roomId: racks.roomId,
        roomName: rooms.name,
        createdAt: racks.createdAt,
      })
      .from(racks)
      .leftJoin(rooms, eq(racks.roomId, rooms.id))
      .where(whereClause)
      .orderBy(orderByClause)
      .limit(limit)
      .offset(offset)

    const totalResult = await db
      .select({ count: count() })
      .from(racks)
      .where(whereClause)

    const total = totalResult[0].count

    return { success: true, data, total, page, limit, totalPages: Math.ceil(total / limit) }
  } catch (error) {
    console.error("Error fetching racks:", error)
    return { success: false, error: "Gagal mengambil daftar rak." }
  }
}

export async function createRack(data: {
  code: string
  roomId: string
}) {
  try {
    const existing = await db.select().from(racks).where(eq(racks.code, data.code)).limit(1)
    if (existing.length > 0) {
      return { success: false, error: "Kode rak sudah ada." }
    }

    await db.insert(racks).values({
      id: crypto.randomUUID(),
      code: data.code,
      roomId: data.roomId,
      createdAt: new Date(),
    })

    return { success: true }
  } catch (error) {
    console.error("Error creating rack:", error)
    return { success: false, error: "Gagal membuat rak baru." }
  } finally {
    revalidatePath("/rak")
    revalidatePath("/dashboard")
  }
}

export async function updateRack(id: string, data: {
  code?: string
  roomId?: string
}) {
  try {
    const existing = await db.select().from(racks).where(eq(racks.id, id)).limit(1)
    if (existing.length === 0) {
      return { success: false, error: "Rak tidak ditemukan." }
    }

    if (data.code && data.code !== existing[0].code) {
      const codeCheck = await db.select().from(racks).where(eq(racks.code, data.code)).limit(1)
      if (codeCheck.length > 0) {
        return { success: false, error: "Kode rak sudah ada." }
      }
    }

    await db.update(racks)
      .set(data)
      .where(eq(racks.id, id))

    return { success: true }
  } catch (error) {
    console.error("Error updating rack:", error)
    return { success: false, error: "Gagal mengubah data rak." }
  } finally {
    revalidatePath("/rak")
    revalidatePath("/dashboard")
  }
}
