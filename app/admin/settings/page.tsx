"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import AdminSidebar from "@/components/admin-sidebar"

export default function AdminSettings() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [settings, setSettings] = useState({
    pointsPerReport: 10,
    pointsPerResolvedReport: 20,
    maxReportsPerDay: 10,
    maintenanceMode: false,
  })

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
      } catch (err) {
        console.error("Auth check failed")
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  const handleSaveSettings = async () => {
    try {
      const response = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      })

      if (response.ok) {
        alert("Settings saved successfully!")
      }
    } catch (err) {
      alert("Failed to save settings")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading Settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900">System Settings</h1>
            <p className="text-gray-600 mt-2">Configure system-wide settings and parameters</p>
          </div>

          {/* Settings Sections */}
          <div className="space-y-6">
            {/* Points Settings */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Points Configuration</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Points Per Report</label>
                  <input
                    type="number"
                    value={settings.pointsPerReport}
                    onChange={(e) => setSettings({ ...settings, pointsPerReport: Number.parseInt(e.target.value) })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900"
                  />
                  <p className="text-gray-600 text-sm mt-2">Points awarded when a user submits a report</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Points Per Resolved Report</label>
                  <input
                    type="number"
                    value={settings.pointsPerResolvedReport}
                    onChange={(e) =>
                      setSettings({ ...settings, pointsPerResolvedReport: Number.parseInt(e.target.value) })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900"
                  />
                  <p className="text-gray-600 text-sm mt-2">Bonus points when a report is resolved</p>
                </div>
              </div>
            </div>

            {/* Rate Limiting */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Rate Limiting</h2>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Max Reports Per Day</label>
                <input
                  type="number"
                  value={settings.maxReportsPerDay}
                  onChange={(e) => setSettings({ ...settings, maxReportsPerDay: Number.parseInt(e.target.value) })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900"
                />
                <p className="text-gray-600 text-sm mt-2">Maximum reports a user can submit per day</p>
              </div>
            </div>

            {/* Maintenance Mode */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Maintenance</h2>
              <div className="flex items-center gap-4">
                <input
                  type="checkbox"
                  checked={settings.maintenanceMode}
                  onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                  className="w-5 h-5 text-emerald-600 rounded focus:ring-2 focus:ring-emerald-500"
                />
                <label className="text-gray-900 font-semibold">Enable Maintenance Mode</label>
              </div>
              <p className="text-gray-600 text-sm mt-2">When enabled, only admins can access the system</p>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSaveSettings}
              className="w-full bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700 transition-colors font-semibold text-lg"
            >
              Save Settings
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
