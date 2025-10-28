"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import AdminSidebar from "@/components/admin-sidebar"

interface User {
  _id: string
  name: string
  email: string
  points: number
  reportsCount: number
  createdAt: string
  role: string
  status: string
}

export default function AdminUsers() {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRole, setFilterRole] = useState("all")

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

        // Fetch users
        const usersResponse = await fetch("/api/admin/users")
        if (usersResponse.ok) {
          const usersData = await usersResponse.json()
          setUsers(usersData.users || [])
        }
      } catch (err) {
        setError("Failed to load users")
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  const handleBanUser = async (userId: string) => {
    if (!confirm("Are you sure you want to ban this user?")) return

    try {
      const response = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, status: "banned" }),
      })

      if (response.ok) {
        setUsers(users.map((u) => (u._id === userId ? { ...u, status: "banned" } : u)))
      }
    } catch (err) {
      setError("Failed to ban user")
    }
  }

  const handlePromoteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to promote this user to admin?")) return

    try {
      const response = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: "admin" }),
      })

      if (response.ok) {
        setUsers(users.map((u) => (u._id === userId ? { ...u, role: "admin" } : u)))
      }
    } catch (err) {
      setError("Failed to promote user")
    }
  }

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = filterRole === "all" || u.role === filterRole
    return matchesSearch && matchesRole
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading Users...</p>
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
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900">Users Management</h1>
            <p className="text-gray-600 mt-2">Total Users: {users.length}</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 font-medium">{error}</div>
          )}

          {/* Search and Filter */}
          <div className="mb-6 space-y-4">
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900"
            />

            <div className="flex gap-2 flex-wrap">
              {["all", "user", "admin"].map((role) => (
                <button
                  key={role}
                  onClick={() => setFilterRole(role)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    filterRole === role
                      ? "bg-emerald-600 text-white shadow-md"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {filteredUsers.length === 0 ? (
              <div className="p-8 text-center text-gray-600">
                <p className="text-lg font-medium">No users found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Name</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Email</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Role</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Points</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Reports</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Joined</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user._id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm text-gray-900 font-medium">{user.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              user.role === "admin" ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-semibold">
                            {user.points || 0}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{user.reportsCount || 0}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-sm space-x-2">
                          {user.role !== "admin" && (
                            <button
                              onClick={() => handlePromoteUser(user._id)}
                              className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors text-xs font-semibold"
                            >
                              Promote
                            </button>
                          )}
                          {user.status !== "banned" && (
                            <button
                              onClick={() => handleBanUser(user._id)}
                              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-xs font-semibold"
                            >
                              Ban
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
