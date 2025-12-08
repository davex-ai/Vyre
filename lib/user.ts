// lib/users.ts
import { connectDB } from "@/lib/db"
import User from "@/models/usermodel"
 
export async function getUserByUsername(username: string) {
  await connectDB()
  return User.findOne({ username }).lean()
}
