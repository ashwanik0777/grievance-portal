import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const userId = cookieStore.get("userId")?.value

    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const { points, gameId } = await request.json()

    if (!points || points <= 0) {
      return NextResponse.json({ error: "Invalid points" }, { status: 400 })
    }

    const db = await getDatabase()
    const usersCollection = db.collection("users")
    const pointsHistoryCollection = db.collection("pointsHistory")

    const result = await usersCollection.findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { $inc: { points: points } },
      { returnDocument: "after" },
    )

    await pointsHistoryCollection.insertOne({
      userId: new ObjectId(userId),
      points: points,
      gameId: gameId,
      type: "game",
      createdAt: new Date(),
    })

    return NextResponse.json({ message: "Points awarded", user: result.value }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to award points" }, { status: 500 })
  }
}
