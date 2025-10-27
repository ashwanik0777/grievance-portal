import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getDatabase } from "@/lib/mongodb"

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const userRole = cookieStore.get("userRole")?.value

    if (userRole !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    const db = await getDatabase()
    const usersCollection = db.collection("users")
    const reportsCollection = db.collection("reports")

    const totalUsers = await usersCollection.countDocuments({ role: "user" })
    const totalReports = await reportsCollection.countDocuments()
    const resolvedReports = await reportsCollection.countDocuments({ status: "resolved" })
    const pendingReports = await reportsCollection.countDocuments({ status: "pending" })
    const inProgressReports = await reportsCollection.countDocuments({ status: "in-progress" })

    const usersWithPoints = await usersCollection.find({ role: "user" }).toArray()
    const totalPoints = usersWithPoints.reduce((sum, user) => sum + (user.points || 0), 0)
    const averagePointsPerUser = totalUsers > 0 ? totalPoints / totalUsers : 0

    return NextResponse.json(
      {
        stats: {
          totalUsers,
          totalReports,
          resolvedReports,
          pendingReports,
          inProgressReports,
          totalPoints,
          averagePointsPerUser,
        },
      },
      { status: 200 },
    )
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch stats" }, { status: 500 })
  }
}
