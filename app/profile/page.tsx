"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Award, MapPin, TrendingUp } from "lucide-react"
import UserStats from "@/components/user-stats"
import UserReports from "@/components/user-reports"

interface User {
  _id: string
  name: string
  email: string
  points: number
  reportsCount: number
  createdAt: string
}

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/auth/me")
        if (!response.ok) {
          router.push("/login")
          return
        }

        const data = await response.json()
        setUser(data.user)
      } catch (err) {
        router.push("/login")
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
            <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center text-white text-4xl font-bold">
              {initials}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{user.name}</h1>
              <p className="text-gray-600 mb-4">{user.email}</p>
              <div className="flex flex-wrap gap-4">
                <div>
                  <p className="text-sm text-gray-600">Total Points</p>
                  <p className="text-2xl font-bold text-emerald-600">{user.points || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Reports Submitted</p>
                  <p className="text-2xl font-bold text-emerald-600">{user.reportsCount || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Member Since</p>
                  <p className="text-2xl font-bold text-emerald-600">{new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <UserStats icon={Award} label="Achievements" value={`${Math.floor((user.points || 0) / 100)}`} />
          <UserStats icon={TrendingUp} label="This Month" value={`${user.reportsCount || 0} reports`} />
          <UserStats icon={MapPin} label="Active" value="Community Member" />
        </div>

        {/* Recent Reports */}
        <UserReports />
      </div>
    </div>
  )
}
