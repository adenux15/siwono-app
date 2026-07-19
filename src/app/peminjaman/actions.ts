"use server"

import { db } from "@/db"
import { archives, loans, loanTransfers, notifications } from "@/db/schema"
import { eq, desc, and, lt, count } from "drizzle-orm"

export async function createPeminjaman(data: {
  nomorWarkah: string
  namaPeminjam: string
  tanggalPinjam: string
  durasiHari: string
  catatan: string
}) {
  try {
    // 1. Find the archive by nomorWarkah
    const archiveResult = await db
      .select()
      .from(archives)
      .where(eq(archives.archiveNumber, data.nomorWarkah))
      .limit(1)

    const archive = archiveResult[0]

    if (!archive) {
      return { success: false, error: "Arsip tidak ditemukan." }
    }

    if (archive.status !== "Tersedia") {
      return { success: false, error: "Arsip sedang dipinjam atau tidak tersedia." }
    }

    // 2. Calculate dates
    const borrowDate = new Date(data.tanggalPinjam)
    const dueDate = new Date(borrowDate)
    dueDate.setDate(dueDate.getDate() + parseInt(data.durasiHari, 10))

    // Use a transaction to ensure both records are updated atomically
    await db.transaction(async (tx) => {
      // 3. Create loan record
      // Note: 'usr_1' is a mock initial user ID since authentication is not fully implemented yet
      await tx.insert(loans).values({
        id: crypto.randomUUID(),
        archiveId: archive.id,
        initialUserId: 'usr_1',
        borrowerName: data.namaPeminjam,
        borrowDate: borrowDate,
        dueDate: dueDate,
        notes: data.catatan,
        status: 'Berjalan',
        createdAt: new Date(),
      })

      // 4. Update archive status
      await tx
        .update(archives)
        .set({ status: 'Dipinjam' })
        .where(eq(archives.id, archive.id))
    })

    return { success: true }
  } catch (error) {
    console.error("Error creating peminjaman:", error)
    return { success: false, error: "Terjadi kesalahan pada sistem." }
  }
}

export async function getRiwayatPeminjaman(userId: string = 'usr_1') {
  try {
    const result = await db
      .select({
        id: loans.id,
        borrowDate: loans.borrowDate,
        dueDate: loans.dueDate,
        status: loans.status,
        borrowerName: loans.borrowerName,
        archiveNumber: archives.archiveNumber,
        docType: archives.docType,
      })
      .from(loans)
      .innerJoin(archives, eq(loans.archiveId, archives.id))
      .where(eq(loans.initialUserId, userId))
      .orderBy(desc(loans.createdAt))

    return { success: true, data: result }
  } catch (error) {
    console.error("Error fetching riwayat peminjaman:", error)
    return { success: false, error: "Gagal mengambil riwayat peminjaman." }
  }
}

export async function getLoanDetail(loanId: string) {
  try {
    const loanResult = await db
      .select({
        id: loans.id,
        borrowDate: loans.borrowDate,
        dueDate: loans.dueDate,
        status: loans.status,
        borrowerName: loans.borrowerName,
        notes: loans.notes,
        archiveNumber: archives.archiveNumber,
        docType: archives.docType,
        initialUserId: loans.initialUserId,
      })
      .from(loans)
      .innerJoin(archives, eq(loans.archiveId, archives.id))
      .where(eq(loans.id, loanId))
      .limit(1)

    const loan = loanResult[0]
    if (!loan) {
      return { success: false, error: "Peminjaman tidak ditemukan." }
    }

    const transfers = await db
      .select({
        id: loanTransfers.id,
        transferDate: loanTransfers.transferDate,
        notes: loanTransfers.notes,
        fromUserId: loanTransfers.fromUserId,
        toUserId: loanTransfers.toUserId,
      })
      .from(loanTransfers)
      .where(eq(loanTransfers.loanId, loanId))
      .orderBy(desc(loanTransfers.transferDate))

    return { success: true, data: { loan, transfers } }
  } catch (error) {
    console.error("Error fetching loan detail:", error)
    return { success: false, error: "Gagal mengambil detail peminjaman." }
  }
}

export async function checkAndUpdateOverdueLoans() {
  try {
    const now = new Date()

    const overdueLoans = await db
      .select({
        id: loans.id,
        initialUserId: loans.initialUserId,
      })
      .from(loans)
      .where(
        and(
          eq(loans.status, 'Berjalan'),
          lt(loans.dueDate, now)
        )
      )

    if (overdueLoans.length === 0) {
      return { success: true, message: "Tidak ada pinjaman terlambat." }
    }

    await db.transaction(async (tx) => {
      for (const loan of overdueLoans) {
        await tx.update(loans)
          .set({ status: 'Terlambat' })
          .where(eq(loans.id, loan.id))
          
        await tx.insert(notifications).values({
          id: crypto.randomUUID(),
          userId: loan.initialUserId,
          loanId: loan.id,
          message: "Peminjaman arsip telah melewati batas waktu (Terlambat).",
          createdAt: new Date(),
        })
      }
    })

    return { success: true, count: overdueLoans.length }
  } catch (error) {
    console.error("Error checking overdue loans:", error)
    return { success: false, error: "Gagal memeriksa status keterlambatan." }
  }
}

export async function getNotifications(userId: string = 'usr_1') {
  try {
    const result = await db
      .select({
        id: notifications.id,
        message: notifications.message,
        isRead: notifications.isRead,
        createdAt: notifications.createdAt,
        loanId: notifications.loanId,
        archiveNumber: archives.archiveNumber,
      })
      .from(notifications)
      .leftJoin(loans, eq(notifications.loanId, loans.id))
      .leftJoin(archives, eq(loans.archiveId, archives.id))
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt))

    return { success: true, data: result }
  } catch (error) {
    console.error("Error fetching notifications:", error)
    return { success: false, error: "Gagal mengambil notifikasi." }
  }
}

export async function markNotificationAsRead(notificationId: string) {
  try {
    await db.update(notifications)
      .set({ isRead: true })
      .where(eq(notifications.id, notificationId))
      
    return { success: true }
  } catch (error) {
    console.error("Error updating notification:", error)
    return { success: false, error: "Gagal memperbarui notifikasi." }
  }
}

export async function getNotificationHistory(userId: string = 'usr_1', options?: { status?: string, page?: number, limit?: number }) {
  try {
    const page = options?.page || 1
    const limit = options?.limit || 10
    const offset = (page - 1) * limit
    
    const conditions = [eq(notifications.userId, userId)]
    if (options?.status === 'read') {
      conditions.push(eq(notifications.isRead, true))
    } else if (options?.status === 'unread') {
      conditions.push(eq(notifications.isRead, false))
    }

    const whereClause = and(...conditions)

    const result = await db
      .select({
        id: notifications.id,
        message: notifications.message,
        isRead: notifications.isRead,
        createdAt: notifications.createdAt,
        loanId: notifications.loanId,
        archiveNumber: archives.archiveNumber,
      })
      .from(notifications)
      .leftJoin(loans, eq(notifications.loanId, loans.id))
      .leftJoin(archives, eq(loans.archiveId, archives.id))
      .where(whereClause)
      .orderBy(desc(notifications.createdAt))
      .limit(limit)
      .offset(offset)

    const totalResult = await db
      .select({ count: count() })
      .from(notifications)
      .where(whereClause)
      
    const total = totalResult[0].count

    return { success: true, data: result, total, page, limit, totalPages: Math.ceil(total / limit) }
  } catch (error) {
    console.error("Error fetching notification history:", error)
    return { success: false, error: "Gagal mengambil riwayat notifikasi." }
  }
}




export async function returnPeminjaman(loanId: string) {
  try {
    const loanResult = await db
      .select()
      .from(loans)
      .where(eq(loans.id, loanId))
      .limit(1)

    const loan = loanResult[0]
    if (!loan) {
      return { success: false, error: "Peminjaman tidak ditemukan." }
    }

    if (loan.status === 'Selesai') {
      return { success: false, error: "Peminjaman sudah diselesaikan." }
    }

    await db.transaction(async (tx) => {
      // 1. Mark loan as Selesai
      await tx
        .update(loans)
        .set({ status: 'Selesai' })
        .where(eq(loans.id, loanId))

      // 2. Mark archive as Tersedia
      await tx
        .update(archives)
        .set({ status: 'Tersedia' })
        .where(eq(archives.id, loan.archiveId))
        
      // 3. Add a history record indicating return
      await tx.insert(loanTransfers).values({
        id: crypto.randomUUID(),
        loanId: loanId,
        fromUserId: loan.initialUserId,
        toUserId: loan.initialUserId,
        transferDate: new Date(),
        notes: "Dikembalikan ke ruang arsip",
        createdAt: new Date(),
      })
    })

    return { success: true }
  } catch (error) {
    console.error("Error returning peminjaman:", error)
    return { success: false, error: "Gagal memproses pengembalian." }
  }
}

export async function transferPeminjaman(data: {
  loanId: string
  newBorrowerName: string
  notes: string
}) {
  try {
    const loanResult = await db
      .select()
      .from(loans)
      .where(eq(loans.id, data.loanId))
      .limit(1)

    const loan = loanResult[0]
    if (!loan) {
      return { success: false, error: "Peminjaman tidak ditemukan." }
    }

    if (loan.status !== 'Berjalan') {
      return { success: false, error: "Peminjaman tidak dalam status Berjalan." }
    }

    await db.transaction(async (tx) => {
      // 1. Update loan's borrower name
      await tx
        .update(loans)
        .set({ borrowerName: data.newBorrowerName })
        .where(eq(loans.id, data.loanId))
        
      // 2. Add a transfer history record
      await tx.insert(loanTransfers).values({
        id: crypto.randomUUID(),
        loanId: data.loanId,
        fromUserId: loan.initialUserId, // Currently using mock user
        toUserId: 'usr_2', // Mock new user ID until auth is added
        transferDate: new Date(),
        notes: `Dialihkan ke ${data.newBorrowerName}. Catatan: ${data.notes}`,
        createdAt: new Date(),
      })
    })

    return { success: true }
  } catch (error) {
    console.error("Error transferring peminjaman:", error)
    return { success: false, error: "Gagal mengalihkan peminjaman." }
  }
}
