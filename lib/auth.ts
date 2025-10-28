import bcrypt from "bcryptjs"
import { getDatabase } from "./mongodb"
import { ObjectId } from "mongodb"

export interface User {
  _id?: ObjectId
  email: string
  password: string
  name: string
  role: "user" | "admin"
  createdAt?: Date
  points?: number
  reportsCount?: number
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export async function createUser(userData: Omit<User, "_id" | "createdAt">): Promise<User | null> {
  const db = await getDatabase()
  const usersCollection = db.collection("users")

  const existingUser = await usersCollection.findOne({ email: userData.email })
  if (existingUser) {
    throw new Error("User already exists")
  }

  const hashedPassword = await hashPassword(userData.password)
  const newUser = {
    ...userData,
    password: hashedPassword,
    createdAt: new Date(),
    points: 0,
    reportsCount: 0,
  }

  const result = await usersCollection.insertOne(newUser)
  return { ...newUser, _id: result.insertedId } as User
}

export async function findUserByEmail(email: string): Promise<User | null> {
  const db = await getDatabase()
  const usersCollection = db.collection("users")
  return usersCollection.findOne({ email })
}

export async function findUserById(id?: string | null) {
  // guard: missing id
  if (!id) return null

  // validate id before constructing ObjectId to avoid BSONError
  if (!ObjectId.isValid(id)) {
    console.warn(`findUserById: invalid id provided: ${id}`)
    return null
  }

  try {
    const db = await getDatabase()
    const usersCollection = db.collection("users")
    return usersCollection.findOne({ _id: new ObjectId(id) })
  } catch (err) {
    console.error("findUserById error:", err)
    return null
  }
}

export async function authenticateUser(email: string, password: string): Promise<User | null> {
  const user = await findUserByEmail(email)
  if (!user) return null

  const isPasswordValid = await verifyPassword(password, user.password)
  if (!isPasswordValid) return null

  return user
}
