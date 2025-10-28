import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const adminEmail = process.env.ADMIN_EMAIL
    const adminPassword = process.env.ADMIN_PASSWORD

    if (!adminEmail || !adminPassword) {
      return NextResponse.json({ error: "Admin credentials not configured" }, { status: 500 })
    }

    if (email !== adminEmail || password !== adminPassword) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    const isProd = process.env.NODE_ENV === "production"
    const sameSite: "none" | "lax" = isProd ? "none" : "lax"
    const maxAge = 60 * 60 * 24 * 7 // 7 days

    const res = NextResponse.json({ ok: true })

    // Set HttpOnly cookies for admin session
    res.cookies.set("session", "admin-session", {
      httpOnly: true,
      path: "/",
      secure: isProd,
      sameSite,
      maxAge,
    })

    res.cookies.set("userRole", "admin", {
      httpOnly: true,
      path: "/",
      secure: isProd,
      sameSite,
      maxAge,
    })

    // minimal userId for admin; change if you want an actual id
    res.cookies.set("userId", "admin", {
      httpOnly: true,
      path: "/",
      secure: isProd,
      sameSite,
      maxAge,
    })

    return res
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Login failed" }, { status: 500 })
  }
}
