"use client"

import { Trophy } from "lucide-react"
import LeaderboardTable from "@/components/leaderboard-table"

export default function LeaderboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="text-emerald-600" size={40} />
            <h1 className="text-4xl font-bold text-gray-900">Leaderboard</h1>
          </div>
          <p className="text-lg text-gray-600">Top contributors making a difference in our city</p>
        </div>

        <LeaderboardTable />
      </div>
    </div>
  )
}
