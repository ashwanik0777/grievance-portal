import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"

export async function GET(request: NextRequest) {
  try {
    const db = await getDatabase()
    const usersCollection = db.collection("users")

    const leaderboard = await usersCollection
      .find({ role: "user" })
      .project({ password: 0 })
      .sort({ points: -1 })
      .limit(50)
      .toArray()

    // Add rank to each user
    const rankedLeaderboard = leaderboard.map((user, index) => ({
      ...user,
      rank: index + 1,
    }))

    return NextResponse.json(rankedLeaderboard)
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch leaderboard" }, { status: 500 })
  }
}
