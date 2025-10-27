export interface Report {
  id: number
  title: string
  description: string
  category: string
  location: string
  imageUrl?: string
  status: "Pending" | "In Progress" | "Resolved"
  reporterId: number
  createdAt: string
  points: number
}

export interface User {
  id: number
  name: string
  email: string
  points: number
  reports: number
  badge: string
  rank: number
}

export interface Game {
  id: number
  title: string
  description: string
  pointsReward: number
  difficulty: "Easy" | "Medium" | "Hard"
}
