//app/api/register/route.ts
import { connectDB } from "@/lib/db"
import User from "@/models/usermodel"
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
    await connectDB()
    const { username, email, password } = await req.json()

    const exists = await User.findOne({ email })
    if (exists) return NextResponse.json({ error: "User already exists" }, { status: 400 })

    const newUser = await User.create({ username, email, password })
    return NextResponse.json(
        { message: "Registered successfully", userId: newUser._id },
        { status: 201 }
    )
}
