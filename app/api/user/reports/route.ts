import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { MongoClient, ObjectId } from "mongodb"

const MONGO_URI = process.env.MONGODB_URI

function validate(body: any) {
  if (!body) return "Missing body"
  if (!body.title || typeof body.title !== "string") return "title is required"
  if (!body.description || typeof body.description !== "string") return "description is required"
  if (body.images && !Array.isArray(body.images)) return "images must be an array"
  return null
}

export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      status: 204,
      headers: {
        Allow: "GET,POST,OPTIONS",
      },
    }
  )
}

export async function GET() {
  return NextResponse.json({ ok: true, message: "POST to this endpoint to create reports" })
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null)
    const err = validate(body)
    if (err) return NextResponse.json({ error: err }, { status: 400 })

    const cookieStore = await cookies()
    const userRole = cookieStore.get("userRole")?.value ?? null
    const userId = cookieStore.get("userId")?.value ?? null

    if (userRole !== "admin") {
      if (!userId) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
      if (!ObjectId.isValid(userId)) return NextResponse.json({ error: "Invalid userId" }, { status: 400 })
    }

    if (!MONGO_URI) return NextResponse.json({ error: "Database not configured" }, { status: 500 })

    const client = new MongoClient(MONGO_URI)
    await client.connect()
    const db = client.db() // uses DB from URI
    const reports = db.collection("reports")

    const newDoc: any = {
      title: body.title.trim(),
      description: body.description.trim(),
      category: body.category ?? "general",
      images: Array.isArray(body.images) ? body.images : [],
      location: body.location ?? null,
      status: "pending",
      createdAt: new Date(),
      createdBy: userRole === "admin" ? "admin" : new ObjectId(userId!),
    }

    const result = await reports.insertOne(newDoc)
    await client.close()

    return NextResponse.json({ ok: true, id: result.insertedId.toString() }, { status: 201 })
  } catch (e: any) {
    console.error("POST /api/user/reports error:", e)
    return NextResponse.json({ error: e?.message ?? "Internal error" }, { status: 500 })
  }
}
