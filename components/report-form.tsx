"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Upload, Send, AlertCircle, CheckCircle, Loader, Navigation } from "lucide-react"

const categories = ["Pothole", "Streetlight", "Garbage", "Road Damage", "Water Issue", "Other"]

export default function ReportForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Pothole",
    location: "",
    image: null as File | null,
  })

  const [preview, setPreview] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [gettingLocation, setGettingLocation] = useState(false)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError("File size must be less than 10MB")
        return
      }

      setFormData({ ...formData, image: file })
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      setError("")
    }
  }

  const handleGetLocation = () => {
    setGettingLocation(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setFormData({
            ...formData,
            location: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
          })
          setGettingLocation(false)
        },
        (error) => {
          setError("Unable to get location. Please enter manually.")
          setGettingLocation(false)
        },
      )
    } else {
      setError("Geolocation is not supported by your browser.")
      setGettingLocation(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // basic validation before starting async work
    if (!formData.title?.trim() || !formData.description?.trim()) {
      setError("Please provide title and description")
      return
    }

    setSubmitting(true)
    try {
      // upload attachments (if any) and wait for all to finish
      const uploadedImages = formData.image
        ? await Promise.all(
            [formData.image].map(async (file: File) => {
              const result = await uploadToCloudinary(file)
              return result?.secure_url ?? result?.url ?? result?.secureUrl ?? ""
            }),
          )
        : []

      const payload = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        images: uploadedImages,
        // include other fields your backend expects (location, tags, etc.)
      }

      const res = await fetch("/api/user/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        throw new Error(data?.error || "Failed to submit report")
      }

      // success: reset form and navigate or show success UI
      setFormData({ title: "", description: "", category: "Pothole", location: "", image: null })
      setPreview(null)
      setSubmitted(false)
      router.push("/report")
    } catch (err: any) {
      console.error("report submit error:", err)
      setError(err?.message ?? "Submission failed")
    } finally {
      // always clear submitting so UI doesn't stay stuck
      setSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-gray-200 rounded-xl shadow-sm p-8 space-y-6 hover:shadow-md transition-all duration-300"
    >
      {submitted && (
        <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg flex items-center gap-2 animate-slide-up">
          <CheckCircle size={20} />
          Report submitted successfully! You earned 10 points.
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-center gap-2 animate-slide-up">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      {/* Title */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-900">Issue Title</label>
        <input
          type="text"
          placeholder="e.g., Large pothole on Main Street"
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 transition-all duration-200 hover:border-gray-300"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>

      {/* Category */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-900">Category</label>
        <select
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 transition-all duration-200 hover:border-gray-300"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-900">Description</label>
        <textarea
          placeholder="Describe the issue in detail..."
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent h-32 resize-none text-gray-900 transition-all duration-200 hover:border-gray-300"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
        />
      </div>

      {/* Location */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-900">Location</label>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter address or coordinates"
            className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 transition-all duration-200 hover:border-gray-300"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            required
          />
          <button
            type="button"
            onClick={handleGetLocation}
            disabled={gettingLocation}
            className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-400 text-white px-4 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all duration-200 hover:shadow-md active:scale-95 disabled:cursor-not-allowed"
          >
            {gettingLocation ? <Loader size={20} className="animate-spin" /> : <Navigation size={20} />}
          </button>
        </div>
      </div>

      {/* Image Upload */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-900">Upload Photo</label>
        <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center hover:border-emerald-500 hover:bg-emerald-50 transition-all duration-300 cursor-pointer group">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            id="image-upload"
            required
          />
          <label htmlFor="image-upload" className="cursor-pointer">
            <Upload
              className="mx-auto mb-2 text-emerald-500 group-hover:scale-110 transition-transform duration-200"
              size={32}
            />
            <p className="font-semibold text-gray-900">Click to upload or drag and drop</p>
            <p className="text-sm text-gray-600">PNG, JPG, GIF up to 10MB</p>
          </label>
        </div>

        {preview && (
          <div className="mt-4 animate-scale-in">
            <p className="text-sm font-semibold text-gray-900 mb-2">Preview</p>
            <img
              src={preview || "/placeholder.svg"}
              alt="Preview"
              className="w-full h-48 object-cover rounded-lg shadow-md"
            />
          </div>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading || uploading}
        className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-400 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all duration-200 hover:shadow-lg hover:scale-105 active:scale-95 disabled:cursor-not-allowed"
      >
        {loading || uploading ? (
          <>
            <Loader size={20} className="animate-spin" />
            {uploading ? "Uploading..." : "Submitting..."}
          </>
        ) : (
          <>
            <Send size={20} />
            Submit Report
          </>
        )}
      </button>
    </form>
  )
}

async function uploadToCloudinary(file: File) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  if (!cloudName) throw new Error("Cloudinary cloud name is not configured (NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME)")

  // If user configured an unsigned preset, use it (convenience)
  const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
  if (preset) {
    const fd = new FormData()
    fd.append("file", file)
    fd.append("upload_preset", preset)
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: fd,
    })
    if (!res.ok) throw new Error("Cloudinary upload failed")
    return res.json()
  }

  // Signed upload flow: request signature from our server
  const sigRes = await fetch("/api/cloudinary/sign")
  if (!sigRes.ok) {
    const err = await sigRes.json().catch(() => ({ error: "sign endpoint failed" }))
    throw new Error(err?.error || "Failed to get Cloudinary signature")
  }
  const { timestamp, signature, apiKey } = await sigRes.json()

  const fd = new FormData()
  fd.append("file", file)
  fd.append("timestamp", String(timestamp))
  fd.append("api_key", apiKey)
  fd.append("signature", signature)

  const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body: fd,
  })
  if (!uploadRes.ok) throw new Error("Cloudinary signed upload failed")
  return uploadRes.json()
}
