import { MongoClient } from "mongodb"
import * as bcrypt from "bcryptjs"

const MONGODB_URI = "mongodb+srv://gbuofficial001_db_user:zcfREVD4jFlnoSwF@notes.6r5sjbl.mongodb.net/grevience"

async function migrateData() {
  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()
    const db = client.db("grevience")

    console.log("[v0] Starting data migration...")

    // Create collections if they don't exist
    const collections = await db.listCollections().toArray()
    const collectionNames = collections.map((c) => c.name)

    if (!collectionNames.includes("users")) {
      await db.createCollection("users")
      console.log("[v0] Created users collection")
    }

    if (!collectionNames.includes("reports")) {
      await db.createCollection("reports")
      console.log("[v0] Created reports collection")
    }

    if (!collectionNames.includes("categories")) {
      await db.createCollection("categories")
      console.log("[v0] Created categories collection")
    }

    if (!collectionNames.includes("points_history")) {
      await db.createCollection("points_history")
      console.log("[v0] Created points_history collection")
    }

    // Create indexes
    const usersCollection = db.collection("users")
    await usersCollection.createIndex({ email: 1 }, { unique: true })
    console.log("[v0] Created email index on users")

    const reportsCollection = db.collection("reports")
    await reportsCollection.createIndex({ userId: 1 })
    await reportsCollection.createIndex({ createdAt: -1 })
    console.log("[v0] Created indexes on reports")

    // Seed demo users if they don't exist
    const userCount = await usersCollection.countDocuments()
    if (userCount === 0) {
      const hashedUserPassword = await bcrypt.hash("password123", 10)
      const hashedAdminPassword = await bcrypt.hash("admin123", 10)

      const demoUsers = [
        {
          name: "Demo User",
          email: "user@example.com",
          password: hashedUserPassword,
          role: "user",
          points: 0,
          reportsCount: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Admin User",
          email: "admin@example.com",
          password: hashedAdminPassword,
          role: "admin",
          points: 0,
          reportsCount: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]

      await usersCollection.insertMany(demoUsers)
      console.log("[v0] Seeded demo users")
    }

    // Seed categories if they don't exist
    const categoriesCollection = db.collection("categories")
    const categoryCount = await categoriesCollection.countDocuments()
    if (categoryCount === 0) {
      const categories = [
        { name: "Pothole", icon: "🕳️", description: "Road potholes and damage" },
        { name: "Streetlight", icon: "💡", description: "Broken or non-functional streetlights" },
        { name: "Garbage", icon: "🗑️", description: "Garbage and waste management issues" },
        { name: "Road Damage", icon: "🛣️", description: "General road damage and maintenance" },
        { name: "Water Issue", icon: "💧", description: "Water supply and drainage issues" },
        { name: "Other", icon: "📋", description: "Other civic issues" },
      ]

      await categoriesCollection.insertMany(categories)
      console.log("[v0] Seeded categories")
    }

    console.log("[v0] Data migration completed successfully!")
  } catch (error) {
    console.error("[v0] Migration error:", error)
    throw error
  } finally {
    await client.close()
  }
}

migrateData()
