"use server"

import { db } from "@/db"
import { users } from "@/db/schema"
import { eq, and } from "drizzle-orm"
import { cookies } from "next/headers"

export async function loginUser(username: string, passwordInput: string) {
  try {
    const result = await db
      .select({
        id: users.id,
        name: users.name,
        username: users.username,
        role: users.role,
      })
      .from(users)
      .where(
        and(
          eq(users.username, username),
          eq(users.password, passwordInput)
        )
      )
      .limit(1)

    const user = result[0]

    if (!user) {
      return { success: false, error: "Username atau password salah!" }
    }

    // Since this is a dummy authentication, we just set a simple cookie
    const cookieStore = await cookies()
    cookieStore.set('session', JSON.stringify({
      id: user.id,
      name: user.name,
      username: user.username,
      role: user.role
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
    })

    return { success: true, user }
  } catch (error) {
    console.error("Login error:", error)
    return { success: false, error: "Terjadi kesalahan pada sistem." }
  }
}

export async function logoutUser() {
  try {
    const cookieStore = await cookies()
    cookieStore.delete('session')
    return { success: true }
  } catch (error) {
    return { success: false, error: "Terjadi kesalahan." }
  }
}
