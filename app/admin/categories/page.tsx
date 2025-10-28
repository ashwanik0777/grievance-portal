"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import AdminSidebar from "@/components/admin-sidebar"

interface Category {
  _id: string
  name: string
  description: string
  icon: string
  reportsCount: number
}

export default function AdminCategories() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [newCategory, setNewCategory] = useState({ name: "", description: "", icon: "" })
  const [showForm, setShowForm] = useState(false)

  const defaultCategories = [
    { name: "Road Damage", description: "Potholes, cracks, and road damage", icon: "🛣️" },
    { name: "Street Light", description: "Broken or non-functional street lights", icon: "💡" },
    { name: "Garbage", description: "Garbage and waste management issues", icon: "🗑️" },
    { name: "Water Supply", description: "Water supply and drainage issues", icon: "💧" },
    { name: "Pollution", description: "Air and noise pollution", icon: "💨" },
    { name: "Public Safety", description: "Safety and security concerns", icon: "🚨" },
  ]

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/me")
        if (!response.ok) {
          router.push("/login")
          return
        }

        const data = await response.json()
        if (data.user.role !== "admin") {
          router.push("/")
          return
        }

        // ensure each category has a unique _id so React keys are stable
        setCategories(
          defaultCategories.map((c, i) => ({
            _id: `default-${i}-${Date.now()}`,
            name: c.name,
            description: c.description,
            icon: c.icon,
            reportsCount: (c as any).reportsCount ?? 0,
          }))
        )
      } catch (err) {
        setError("Failed to load categories")
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  const handleAddCategory = () => {
    if (!newCategory.name || !newCategory.description || !newCategory.icon) {
      setError("Please fill all fields")
      return
    }

    setCategories([
      ...categories,
      {
        _id: Date.now().toString(),
        ...newCategory,
        reportsCount: 0,
      },
    ])

    setNewCategory({ name: "", description: "", icon: "" })
    setShowForm(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading Categories...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Report Categories</h1>
              <p className="text-gray-600 mt-2">Total Categories: {categories.length}</p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors font-semibold"
            >
              {showForm ? "Cancel" : "Add Category"}
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 font-medium">{error}</div>
          )}

          {/* Add Category Form */}
          {showForm && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Add New Category</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Category Name"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900"
                />
                <textarea
                  placeholder="Description"
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900"
                  rows={3}
                />
                <input
                  type="text"
                  placeholder="Icon (emoji)"
                  value={newCategory.icon}
                  onChange={(e) => setNewCategory({ ...newCategory, icon: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900"
                />
                <button
                  onClick={handleAddCategory}
                  className="w-full bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700 transition-colors font-semibold"
                >
                  Add Category
                </button>
              </div>
            </div>
          )}

          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <div key={category._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="text-5xl mb-4">{category.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{category.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{category.description}</p>
                <div className="flex justify-between items-center">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-semibold">
                    {category.reportsCount} reports
                  </span>
                  <button className="text-red-600 hover:text-red-700 font-semibold text-sm">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
