"use client"

import { Gamepad2, Sparkles } from "lucide-react"
import GameCard from "@/components/game-card"

const games = [
  {
    id: 1,
    title: "City Quiz",
    description: "Test your knowledge about city infrastructure and environmental issues.",
    pointsReward: 100,
    difficulty: "Easy",
    icon: "🧠",
  },
  {
    id: 2,
    title: "Spot the Issue",
    description: "Identify problems in city images. Can you spot all the issues?",
    pointsReward: 150,
    difficulty: "Medium",
    icon: "👁️",
  },
  {
    id: 3,
    title: "Spin the Wheel",
    description: "Spin the wheel and win bonus points and special badges.",
    pointsReward: 200,
    difficulty: "Hard",
    icon: "🎡",
  },
  {
    id: 4,
    title: "Memory Match",
    description: "Match pairs of city issues and solutions in this memory game.",
    pointsReward: 120,
    difficulty: "Easy",
    icon: "🎮",
  },
]

export default function GamesPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Gamepad2 className="text-emerald-600" size={40} />
            <h1 className="text-4xl font-bold text-gray-900">Mini Games</h1>
          </div>
          <p className="text-lg text-gray-600">Use your points to unlock and play games. Earn even more rewards!</p>
        </div>

        {/* Points Balance */}
        <div className="bg-emerald-500 text-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-emerald-100">Your Points Balance</p>
              <p className="text-4xl font-bold">2,450 pts</p>
            </div>
            <Sparkles size={48} />
          </div>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </div>
    </div>
  )
}
