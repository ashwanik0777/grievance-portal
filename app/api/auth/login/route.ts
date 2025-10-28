import { authenticateUser } from "@/lib/auth"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
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

    // set cookie options appropriate for local dev vs production
    const isProd = process.env.NODE_ENV === "production"
    const sameSiteValue: "none" | "lax" = isProd ? "none" : "lax"
    const cookieOptions = {
      name: "session",
      value: userWithoutPassword._id?.toString() || "",
      httpOnly: true,
      path: "/",
      secure: isProd, // secure only in production (localhost won't be secure)
      sameSite: sameSiteValue, // none+secure for cross-site in prod; lax for local
      maxAge: 60 * 60 * 24 * 7, // 7 days
    }

    const res = NextResponse.json({ ok: true })
    // use (name, value, options) overload so the options object matches the ResponseCookie type
    res.cookies.set(cookieOptions.name, cookieOptions.value, {
      httpOnly: cookieOptions.httpOnly,
      path: cookieOptions.path,
      secure: cookieOptions.secure,
      sameSite: cookieOptions.sameSite,
      maxAge: cookieOptions.maxAge,
    })

    return res
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Login failed" }, { status: 500 })
  }
}
