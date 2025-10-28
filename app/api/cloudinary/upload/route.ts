import { NextResponse } from "next/server"
import { v2 as cloudinary } from "cloudinary"

// configure from env (server only)
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null)
    if (!body?.imageData) {
      return NextResponse.json({ error: "imageData (base64) required" }, { status: 400 })
    }

    // imageData should be a data URL or base64 string like "data:image/png;base64,...."
    const uploadResult = await cloudinary.uploader.upload(body.imageData, {
      folder: "smartcityfix",
      resource_type: "image",
      use_filename: true,
      unique_filename: true,
    })

    return NextResponse.json({ ok: true, result: uploadResult }, { status: 201 })
  } catch (err: any) {
    console.error("cloudinary/upload error:", err)
    return NextResponse.json({ error: err?.message ?? "Upload failed" }, { status: 500 })
  }
}