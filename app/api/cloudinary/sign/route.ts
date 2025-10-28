import { NextResponse } from "next/server"
import crypto from "crypto"

export async function GET() {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  const apiKey = process.env.CLOUDINARY_API_KEY
  const apiSecret = process.env.CLOUDINARY_API_SECRET

  if (!cloudName || !apiKey || !apiSecret) {
    return NextResponse.json({ error: "Cloudinary not configured" }, { status: 500 })
  }

  const timestamp = Math.floor(Date.now() / 1000)
  // Cloudinary signature for params: sha1(string_to_sign + API_SECRET)
  // For only timestamp the string_to_sign is `timestamp=${timestamp}`
  const signature = crypto.createHash("sha1").update(`timestamp=${timestamp}${apiSecret}`).digest("hex")

  return NextResponse.json({ ok: true, timestamp, signature, apiKey, cloudName })
}