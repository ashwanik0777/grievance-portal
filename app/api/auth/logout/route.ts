import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    cookieStore.delete("userId")
    cookieStore.delete("userRole")

    return NextResponse.json({ message: "Logout successful" }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Logout failed" }, { status: 500 })
  }
}
