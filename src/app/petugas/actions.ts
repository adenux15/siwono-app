"use server"

import { db } from "@/db"
import { users } from "@/db/schema"
import { eq, or, like } from "drizzle-orm"

export async function getUsers(query?: string) {
  try {
    let result;
    
    if (query) {
      result = await db
        .select({
          id: users.id,
          name: users.name,
          username: users.username,
          email: users.email,
          role: users.role,
        })
        .from(users)
        .where(
          or(
            like(users.name, `%${query}%`),
            like(users.username, `%${query}%`),
            like(users.role, `%${query}%`)
          )
        )
    } else {
      result = await db
        .select({
          id: users.id,
          name: users.name,
          username: users.username,
          email: users.email,
          role: users.role,
        })
        .from(users)
    }

    return { success: true, data: result }
  } catch (error) {
    console.error("Error fetching users:", error)
    return { success: false, error: "Gagal mengambil data petugas." }
  }
}

export async function createUser(data: {
  name: string
  username: string
  email: string
  password?: string
  role: string
}) {
  try {
    const existingUsername = await db
      .select()
      .from(users)
      .where(eq(users.username, data.username))
      .limit(1)

    if (existingUsername.length > 0) {
      return { success: false, error: "Username sudah digunakan." }
    }

    const existingEmail = await db
      .select()
      .from(users)
      .where(eq(users.email, data.email))
      .limit(1)

    if (existingEmail.length > 0) {
      return { success: false, error: "Email sudah digunakan." }
    }

    await db.insert(users).values({
      id: crypto.randomUUID(),
      name: data.name,
      username: data.username,
      email: data.email,
      password: data.password || 'password123',
      role: data.role,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return { success: true }
  } catch (error) {
    console.error("Error creating user:", error)
    return { success: false, error: "Terjadi kesalahan saat menambahkan petugas." }
  }
}

export async function updateUser(id: string, data: {
  name?: string
  username?: string
  email?: string
  password?: string
  role?: string
}) {
  try {
    const updateData: any = { updatedAt: new Date() }
    if (data.name) updateData.name = data.name
    if (data.username) updateData.username = data.username
    if (data.email) updateData.email = data.email
    if (data.password) updateData.password = data.password
    if (data.role) updateData.role = data.role

    await db.update(users)
      .set(updateData)
      .where(eq(users.id, id))

    return { success: true }
  } catch (error) {
    console.error("Error updating user:", error)
    return { success: false, error: "Terjadi kesalahan saat memperbarui petugas." }
  }
}

export async function deleteUser(id: string) {
  try {
    await db.delete(users).where(eq(users.id, id))
    return { success: true }
  } catch (error) {
    console.error("Error deleting user:", error)
    // Could fail if user is referenced in other tables like loans/rooms
    return { success: false, error: "Gagal menghapus petugas. Pastikan petugas tidak memiliki data terkait." }
  }
}
