import { type NextRequest, NextResponse } from "next/server"

// Mock database
const reports: any[] = []

export async function GET() {
  return NextResponse.json(reports)
}

export async function POST(request: NextRequest) {
  const data = await request.json()

  const newReport = {
    id: reports.length + 1,
    ...data,
    status: "Pending",
    createdAt: new Date().toISOString(),
  }

  reports.push(newReport)

  return NextResponse.json(newReport, { status: 201 })
}
