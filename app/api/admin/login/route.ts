import { authenticateUser } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const user = await authenticateUser(email, password)

    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    if (user.role !== "admin") {
      return NextResponse.json({ error: "Admin access only" }, { status: 403 })
    }

    const isProd = process.env.NODE_ENV === "production"
    const sameSite: "none" | "lax" = isProd ? "none" : "lax"
    const cookieOptions = {
      name: "session",
      value: user._id?.toString() || "",
      httpOnly: true,
      path: "/",
      secure: isProd,
      sameSite,
      maxAge: 60 * 60 * 24 * 7,
    }

    const res = NextResponse.json({ ok: true })
    res.cookies.set(cookieOptions)

    return res
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Login failed" }, { status: 500 })
  }
}
