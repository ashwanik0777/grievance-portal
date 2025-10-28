import { MongoClient } from "mongodb"

const MONGODB_URI = "mongodb+srv://gbuofficial001_db_user:zcfREVD4jFlnoSwF@notes.6r5sjbl.mongodb.net/"
const DB_NAME = "grevience"

if (!MONGODB_URI) {
  throw new Error('Invalid/missing environment variable: "MONGODB_URI"')
}

let cachedClient: MongoClient | null = null
let cachedDb: any = null

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb }
  }

  const client = new MongoClient(MONGODB_URI)
  await client.connect()
  const db = client.db(DB_NAME)

  cachedClient = client
  cachedDb = db

  return { client, db }
}

export async function getDatabase() {
  const { db } = await connectToDatabase()
  return db
}
