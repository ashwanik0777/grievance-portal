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
    const reportsCollection = db.collection("reports")
    const reports = await reportsCollection.find({}).toArray()

    return NextResponse.json({ reports }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch reports" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const userRole = cookieStore.get("userRole")?.value

    if (userRole !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    const { reportId, status } = await request.json()
    const db = await getDatabase()
    const reportsCollection = db.collection("reports")

    const result = await reportsCollection.updateOne({ _id: reportId }, { $set: { status, updatedAt: new Date() } })

    return NextResponse.json({ message: "Report updated successfully" }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update report" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const userRole = cookieStore.get("userRole")?.value

    if (userRole !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    const { reportId } = await request.json()
    const db = await getDatabase()
    const reportsCollection = db.collection("reports")

    await reportsCollection.deleteOne({ _id: reportId })

    return NextResponse.json({ message: "Report deleted successfully" }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete report" }, { status: 500 })
  }
}
