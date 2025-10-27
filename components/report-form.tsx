"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Upload, MapPin, Send } from "lucide-react"

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
  const [error, setError] = useState("")

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData({ ...formData, image: file })
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/reports/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          category: formData.category,
          location: formData.location,
          image: preview,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        setError(data.error || "Failed to submit report")
        setLoading(false)
        return
      }

      setSubmitted(true)
      setTimeout(() => {
        setFormData({ title: "", description: "", category: "Pothole", location: "", image: null })
        setPreview(null)
        setSubmitted(false)
        router.refresh()
      }, 2000)
    } catch (err: any) {
      setError(err.message || "Failed to submit report")
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg shadow-sm p-8 space-y-6">
      {submitted && (
        <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg">
          Report submitted successfully! You earned 10 points.
        </div>
      )}

      {error && <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">{error}</div>}

      {/* Title */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">Issue Title</label>
        <input
          type="text"
          placeholder="e.g., Large pothole on Main Street"
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">Category</label>
        <select
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900"
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
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">Description</label>
        <textarea
          placeholder="Describe the issue in detail..."
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent h-32 resize-none text-gray-900"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
        />
      </div>

      {/* Location */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">Location</label>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter address or coordinates"
            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            required
          />
          <button
            type="button"
            className="bg-gray-100 text-gray-900 hover:bg-gray-200 px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors"
          >
            <MapPin size={20} />
          </button>
        </div>
      </div>

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">Upload Photo</label>
        <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center hover:border-emerald-500 transition-colors cursor-pointer">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            id="image-upload"
            required
          />
          <label htmlFor="image-upload" className="cursor-pointer">
            <Upload className="mx-auto mb-2 text-emerald-500" size={32} />
            <p className="font-semibold text-gray-900">Click to upload or drag and drop</p>
            <p className="text-sm text-gray-600">PNG, JPG, GIF up to 10MB</p>
          </label>
        </div>

        {preview && (
          <div className="mt-4">
            <p className="text-sm font-semibold text-gray-900 mb-2">Preview</p>
            <img src={preview || "/placeholder.svg"} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
          </div>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-400 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors"
      >
        <Send size={20} />
        {loading ? "Submitting..." : "Submit Report"}
      </button>
    </form>
  )
}
