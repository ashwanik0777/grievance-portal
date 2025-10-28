import type { NextRequest } from "next/server"
import { cookies } from "next/headers"

export async function withAuth(request: NextRequest, requiredRole?: string) {
  const cookieStore = await cookies()
  const userId = cookieStore.get("userId")?.value
  const userRole = cookieStore.get("userRole")?.value

  if (!userId) {
    return {
      authenticated: false,
      user: null,
      error: "Not authenticated",
    }
  }

  if (requiredRole && userRole !== requiredRole) {
    return {
      authenticated: false,
      user: null,
      error: "Insufficient permissions",
    }
  }

  return {
    authenticated: true,
    userId,
    userRole,
    error: null,
  }
}
