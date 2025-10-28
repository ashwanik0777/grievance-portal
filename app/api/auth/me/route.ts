import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { findUserById } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const userId = cookieStore.get("userId")?.value
    const sessionExpiry = cookieStore.get("sessionExpiry")?.value

    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    if (sessionExpiry && new Date(sessionExpiry) < new Date()) {
      return NextResponse.json({ error: "Session expired" }, { status: 401 })
    }

    const user = await findUserById(userId)

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({ user: userWithoutPassword }, { status: 200 })
  } catch (error: any) {
    console.error("[v0] Auth error:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch user" }, { status: 500 })
  }
}
