import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { findUserById } from "@/lib/auth"

export async function GET() {
  try {
    // cookies() is synchronous — don't await it. use optional chaining to avoid undefined errors.
    const cookieStore = await cookies()
    const userId = cookieStore?.get("userId")?.value ?? null
    const userRole = cookieStore?.get("userRole")?.value ?? null

    // short-circuit admin sessions (no DB lookup / ObjectId required)
    if (userRole === "admin") {
      return NextResponse.json({
        ok: true,
        user: {
          _id: "admin",
          email: process.env.ADMIN_EMAIL ?? "admin",
          role: "admin",
        },
      })
    }

    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const user = await findUserById(userId)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const { password: _, ...userWithoutPassword } = user
    return NextResponse.json({ ok: true, user: userWithoutPassword })
  } catch (error: any) {
    console.error("auth/me error:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch user" }, { status: 500 })
  }
}
