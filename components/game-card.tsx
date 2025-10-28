"use client"

import { useState } from "react"
import { Play, Trophy, Zap, Award } from "lucide-react"

interface GameCardProps {
  game: {
    id: number
    title: string
    description: string
    pointsReward: number
    difficulty: string
    icon: string
  }
  onGameComplete: () => void
}

export default function GameCard({ game, onGameComplete }: GameCardProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [gameState, setGameState] = useState<"idle" | "playing" | "completed">("idle")
  const [score, setScore] = useState(0)
  const [gameProgress, setGameProgress] = useState(0)

  const getGameContent = () => {
    switch (game.id) {
      case 1: // City Quiz
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <p className="text-sm text-gray-600 mb-2">Question {Math.floor(gameProgress / 25) + 1} of 4</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${gameProgress}%` }}
                ></div>
              </div>
            </div>
            <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
              <p className="font-semibold text-gray-900 mb-4">What is the main cause of potholes?</p>
              <div className="space-y-2">
                {["Water infiltration", "Heavy traffic", "Poor maintenance", "Weather cycles"].map((option, i) => (
                  <button
                    key={i}
                    onClick={() => setGameProgress(Math.min(gameProgress + 25, 100))}
                    className="w-full p-3 text-left bg-white border border-gray-200 rounded-lg hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-200 font-medium text-gray-900"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )
      case 2: // Spot the Issue
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <p className="text-sm text-gray-600 mb-2">Issues Found: {Math.floor(gameProgress / 20)} of 5</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${gameProgress}%` }}
                ></div>
              </div>
            </div>
            <div className="bg-gray-100 rounded-lg p-8 text-center">
              <p className="text-gray-600 mb-4">Click on the issues you can spot in the image</p>
              <div className="grid grid-cols-3 gap-2">
                {[...Array(9)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setGameProgress(Math.min(gameProgress + 20, 100))}
                    className="aspect-square bg-white border-2 border-gray-300 rounded-lg hover:border-emerald-500 hover:bg-emerald-50 transition-all duration-200 font-bold text-gray-600"
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )
      case 3: // Spin the Wheel
        return (
          <div className="space-y-4 text-center">
            <p className="text-gray-600 mb-4">Spin the wheel to win points!</p>
            <div className="flex justify-center mb-6">
              <div
                className="w-32 h-32 rounded-full border-8 border-emerald-500 flex items-center justify-center bg-gradient-to-br from-yellow-300 to-orange-300 animate-spin"
                style={{ animationDuration: "2s" }}
              >
                <span className="text-4xl">🎡</span>
              </div>
            </div>
            <p className="text-sm text-gray-600">Spinning...</p>
          </div>
        )
      case 4: // Memory Match
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <p className="text-sm text-gray-600 mb-2">Matches: {Math.floor(gameProgress / 25)} of 4</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${gameProgress}%` }}
                ></div>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[...Array(8)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setGameProgress(Math.min(gameProgress + 25, 100))}
                  className="aspect-square bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg hover:shadow-lg transition-all duration-200 font-bold text-white text-2xl hover:scale-105 active:scale-95"
                >
                  ?
                </button>
              ))}
            </div>
          </div>
        )
      default:
        return null
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800 border border-green-300"
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border border-yellow-300"
      case "Hard":
        return "bg-red-100 text-red-800 border border-red-300"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "⭐"
      case "Medium":
        return "⭐⭐"
      case "Hard":
        return "⭐⭐⭐"
      default:
        return ""
    }
  }

  const handlePlayGame = () => {
    setGameState("playing")
    setIsPlaying(true)
    setGameProgress(0)
    const gameTime = 8000 + Math.random() * 4000
    setTimeout(() => {
      setGameState("completed")
      setScore(game.pointsReward)
    }, gameTime)
  }

  const handleCloseGame = async () => {
    if (gameState === "completed") {
      try {
        await fetch("/api/user/points", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ points: score, gameId: game.id }),
        })
        onGameComplete()
      } catch (err) {
        console.error("[v0] Failed to award points:", err)
      }
    }
    setGameState("idle")
    setIsPlaying(false)
    setScore(0)
    setGameProgress(0)
  }

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 hover:shadow-xl hover:border-emerald-300 transition-all duration-300 group hover-lift">
        <div className="flex items-start justify-between mb-4">
          <span className="text-5xl group-hover:scale-110 transition-transform duration-300">{game.icon}</span>
          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold ${getDifficultyColor(game.difficulty)} transition-all duration-200`}
          >
            {getDifficultyIcon(game.difficulty)}
          </span>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors duration-200">
          {game.title}
        </h3>
        <p className="text-gray-600 text-sm mb-4">{game.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="text-yellow-500" size={20} />
            <div>
              <p className="text-xs text-gray-600">Reward</p>
              <p className="text-2xl font-bold text-emerald-600">+{game.pointsReward}</p>
            </div>
          </div>
          <button
            onClick={handlePlayGame}
            disabled={isPlaying}
            className="bg-emerald-500 text-white hover:bg-emerald-600 disabled:bg-gray-400 px-6 py-2 rounded-lg font-bold flex items-center gap-2 transition-all duration-200 hover:shadow-lg active:scale-95 disabled:cursor-not-allowed"
          >
            <Play size={18} />
            {isPlaying ? "Playing..." : "Play"}
          </button>
        </div>
      </div>

      {/* Game Modal */}
      {isPlaying && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8 animate-scale-in">
            {gameState === "playing" && (
              <div className="text-center">
                <div className="mb-6 animate-bounce">
                  <span className="text-6xl">{game.icon}</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{game.title}</h2>
                <p className="text-gray-600 mb-6">Playing...</p>
                {getGameContent()}
              </div>
            )}

            {gameState === "completed" && (
              <div className="text-center animate-scale-in">
                <div className="mb-6 animate-bounce">
                  <Trophy className="text-yellow-500 mx-auto" size={64} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Congratulations!</h2>
                <p className="text-gray-600 mb-6">You completed {game.title}</p>
                <div className="bg-emerald-50 rounded-lg p-4 mb-6 border border-emerald-200">
                  <p className="text-sm text-gray-600 flex items-center justify-center gap-2">
                    <Award size={16} className="text-emerald-600" />
                    Points Earned
                  </p>
                  <p className="text-4xl font-bold text-emerald-600">+{score}</p>
                </div>
                <button
                  onClick={handleCloseGame}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg transition-all duration-200 hover:shadow-lg active:scale-95 flex items-center justify-center gap-2"
                >
                  <Trophy size={20} />
                  Claim Reward
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
