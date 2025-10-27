"use client"

import { useEffect, useState } from "react"

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
    if (rank === 1) return "bg-yellow-100 text-yellow-800"
    if (rank === 2) return "bg-gray-100 text-gray-800"
    if (rank === 3) return "bg-orange-100 text-orange-800"
    return "bg-emerald-50 text-emerald-700"
  }

  const getBadgeName = (rank: number) => {
    if (rank === 1) return "Gold"
    if (rank === 2) return "Silver"
    if (rank === 3) return "Bronze"
    if (rank <= 10) return "Star"
    return "Active"
  }

  const getMedalIcon = (rank: number) => {
    if (rank === 1) return "🥇"
    if (rank === 2) return "🥈"
    if (rank === 3) return "🥉"
    return rank
  }

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8 text-center">
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
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
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
                  idx < 3 ? "bg-emerald-50" : "hover:bg-gray-50"
                } transition-colors`}
              >
                <td className="px-6 py-4">
                  <span className="text-2xl font-bold text-emerald-600">{getMedalIcon(user.rank)}</span>
                </td>
                <td className="px-6 py-4 font-semibold text-gray-900">{user.name}</td>
                <td className="px-6 py-4">
                  <span className="text-lg font-bold text-emerald-600">{user.points || 0}</span>
                </td>
                <td className="px-6 py-4 text-gray-600">{user.reportsCount || 0} reports</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getBadgeColor(user.rank)}`}>
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
