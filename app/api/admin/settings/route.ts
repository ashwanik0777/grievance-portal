import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getDatabase } from "@/lib/mongodb"

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const userRole = cookieStore.get("userRole")?.value

    if (userRole !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    const settings = await request.json()
    const db = await getDatabase()
    const settingsCollection = db.collection("settings")

    await settingsCollection.updateOne({ _id: "system_settings" }, { $set: settings }, { upsert: true })

    return NextResponse.json({ message: "Settings saved successfully" }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to save settings" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const userRole = cookieStore.get("userRole")?.value

    if (userRole !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    const db = await getDatabase()
    const settingsCollection = db.collection("settings")

    const settings = await settingsCollection.findOne({ _id: "system_settings" })

    return NextResponse.json(
      {
        settings: settings || {
          pointsPerReport: 10,
          pointsPerResolvedReport: 20,
          maxReportsPerDay: 10,
          maintenanceMode: false,
        },
      },
      { status: 200 },
    )
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch settings" }, { status: 500 })
  }
}
