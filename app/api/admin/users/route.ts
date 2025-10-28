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
    const users = await usersCollection.find({}).project({ password: 0 }).toArray()

    return NextResponse.json({ users }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch users" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const userRole = cookieStore.get("userRole")?.value

    if (userRole !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    const { userId, role, status } = await request.json()
    const db = await getDatabase()
    const usersCollection = db.collection("users")

    const updateData: any = {}
    if (role) updateData.role = role
    if (status) updateData.status = status

    await usersCollection.updateOne({ _id: userId }, { $set: updateData })

    return NextResponse.json({ message: "User updated successfully" }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update user" }, { status: 500 })
  }
}
