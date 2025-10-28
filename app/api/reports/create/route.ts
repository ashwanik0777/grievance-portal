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

    const { title, description, category, location, image } = await request.json()

    if (!title || !description || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const db = await getDatabase()
    const reportsCollection = db.collection("reports")
    const usersCollection = db.collection("users")
    const pointsHistoryCollection = db.collection("points_history")

    const newReport = {
      userId: new ObjectId(userId),
      title,
      description,
      category,
      location,
      image, // Cloudinary URL
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await reportsCollection.insertOne(newReport)

    // Update user points and report count
    await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      {
        $inc: { points: 10, reportsCount: 1 },
      },
    )

    await pointsHistoryCollection.insertOne({
      userId: new ObjectId(userId),
      points: 10,
      reason: "Report submitted",
      reportId: result.insertedId,
      createdAt: new Date(),
    })

    return NextResponse.json({ message: "Report created successfully", reportId: result.insertedId }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create report" }, { status: 500 })
  }
}
