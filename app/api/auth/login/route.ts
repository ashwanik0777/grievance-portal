import { type NextRequest, NextResponse } from "next/server"
import { authenticateUser } from "@/lib/auth"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const user = await authenticateUser(email, password)

    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    const cookieStore = await cookies()
    const maxAge = 60 * 60 * 24 // 24 hours

    cookieStore.set("userId", user._id?.toString() || "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: maxAge,
    })

    cookieStore.set("userRole", user.role, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: maxAge,
    })

    cookieStore.set("loginTime", new Date().toISOString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: maxAge,
    })

    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({ message: "Login successful", user: userWithoutPassword }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Login failed" }, { status: 500 })
  }
}
