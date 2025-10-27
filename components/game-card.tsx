"use client"

import { useState } from "react"
import { Play } from "lucide-react"

interface GameCardProps {
  game: {
    id: number
    title: string
    description: string
    pointsReward: number
    difficulty: string
    icon: string
  }
}

export default function GameCard({ game }: GameCardProps) {
  const [isPlaying, setIsPlaying] = useState(false)

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      case "Hard":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <span className="text-5xl">{game.icon}</span>
        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getDifficultyColor(game.difficulty)}`}>
          {game.difficulty}
        </span>
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{game.title}</h3>
      <p className="text-gray-600 text-sm mb-4">{game.description}</p>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-600">Reward</p>
          <p className="text-2xl font-bold text-emerald-600">+{game.pointsReward}</p>
        </div>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="bg-emerald-500 text-white hover:bg-emerald-600 px-6 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors"
        >
          <Play size={18} />
          {isPlaying ? "Playing..." : "Play"}
        </button>
      </div>
    </div>
  )
}
