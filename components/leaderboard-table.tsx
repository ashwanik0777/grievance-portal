"use client"

import { useEffect, useState } from "react"
import { Trophy, Medal, Star, Flame } from "lucide-react"

interface User {
  _id: string
  name: string
  points: number
  reportsCount: number
  rank: number
}

export default function LeaderboardTable() {
  const [leaderboard, setLeaderboard] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch("/api/leaderboard")
        if (response.ok) {
          const data = await response.json()
          setLeaderboard(data)
        }
      } catch (err) {
        console.error("Failed to fetch leaderboard:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboard()
  }, [])

  const getBadgeColor = (rank: number) => {
    if (rank === 1) return "bg-yellow-100 text-yellow-800 border border-yellow-300"
    if (rank === 2) return "bg-gray-100 text-gray-800 border border-gray-300"
    if (rank === 3) return "bg-orange-100 text-orange-800 border border-orange-300"
    return "bg-emerald-50 text-emerald-700 border border-emerald-200"
  }

  const getBadgeName = (rank: number) => {
    if (rank === 1) return "Gold"
    if (rank === 2) return "Silver"
    if (rank === 3) return "Bronze"
    if (rank <= 10) return "Star"
    return "Active"
  }

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="text-yellow-500" size={24} />
    if (rank === 2) return <Medal className="text-gray-500" size={24} />
    if (rank === 3) return <Medal className="text-orange-500" size={24} />
    if (rank <= 10) return <Star className="text-emerald-500" size={24} />
    return <Flame className="text-red-500" size={20} />
  }

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8 text-center animate-pulse">
        <p className="text-gray-600">Loading leaderboard...</p>
      </div>
    )
  }

  if (leaderboard.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8 text-center">
        <p className="text-gray-600">No users yet. Be the first to report an issue!</p>
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-emerald-500 text-white">
            <tr>
              <th className="px-6 py-4 text-left font-bold">Rank</th>
              <th className="px-6 py-4 text-left font-bold">Name</th>
              <th className="px-6 py-4 text-left font-bold">Points</th>
              <th className="px-6 py-4 text-left font-bold">Reports</th>
              <th className="px-6 py-4 text-left font-bold">Badge</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((user, idx) => (
              <tr
                key={user._id}
                className={`border-t border-gray-200 ${
                  idx < 3 ? "bg-emerald-50 hover:bg-emerald-100" : "hover:bg-gray-50"
                } transition-all duration-200 group`}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                    {getRankIcon(user.rank)}
                  </div>
                </td>
                <td className="px-6 py-4 font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">
                  {user.name}
                </td>
                <td className="px-6 py-4">
                  <span className="text-lg font-bold text-emerald-600">{user.points || 0}</span>
                </td>
                <td className="px-6 py-4 text-gray-600">{user.reportsCount || 0} reports</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${getBadgeColor(user.rank)} transition-all duration-200`}
                  >
                    {getBadgeName(user.rank)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
