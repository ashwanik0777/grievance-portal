"use client"

import { Gamepad2, Sparkles, Zap, Target, Lock } from "lucide-react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
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
  const [userPoints, setUserPoints] = useState(0)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchUserPoints = async () => {
      try {
        const response = await fetch("/api/auth/me", { cache: "no-store" })
        if (response.ok) {
          const data = await response.json()
          setUserPoints(data.user.points || 0)
          setIsAuthenticated(true)
        } else {
          setIsAuthenticated(false)
        }
      } catch (err) {
        setIsAuthenticated(false)
      } finally {
        setLoading(false)
      }
    }

    fetchUserPoints()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-200 border-t-emerald-600"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20 animate-slide-up">
            <Lock className="mx-auto mb-4 text-emerald-600" size={64} />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Login Required</h1>
            <p className="text-lg text-gray-600 mb-8">You need to login to play games and earn points.</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => router.push("/login")}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold transition-all duration-200 hover:shadow-lg active:scale-95"
              >
                Login
              </button>
              <button
                onClick={() => router.push("/signup")}
                className="px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-900 rounded-lg font-bold transition-all duration-200 hover:shadow-lg active:scale-95"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const handleGameComplete = (points: number) => {
    setUserPoints(userPoints + points)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 animate-slide-up">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-emerald-500 rounded-lg">
              <Gamepad2 className="text-white" size={40} />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Mini Games</h1>
          </div>
          <p className="text-lg text-gray-600 flex items-center gap-2">
            <Target size={20} className="text-emerald-600" />
            Play games and earn points to climb the leaderboard!
          </p>
        </div>

        {/* Points Balance */}
        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl shadow-lg p-8 mb-8 hover:shadow-xl transition-all duration-300 animate-scale-in hover-lift">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-emerald-100 flex items-center gap-2">
                <Zap size={16} />
                Your Points Balance
              </p>
              <p className="text-5xl font-bold mt-2">{userPoints} pts</p>
            </div>
            <Sparkles size={64} className="opacity-80 animate-pulse" />
          </div>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {games.map((game, idx) => (
            <div key={game.id} className="animate-slide-up" style={{ animationDelay: `${idx * 100}ms` }}>
              <GameCard game={game} onGameComplete={() => handleGameComplete(game.pointsReward)} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
