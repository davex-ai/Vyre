// app/api/auth/[...nextauth]/route.ts
import { connectDB } from "@/lib/db";
import User from "@/models/usermodel";
import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { userAgent } from "next/server";

const handler = NextAuth({
    providers: [
        Credentials({
            name: "credentials",
            credentials: {
                email: {},
                password: {},
            },
            async authorize(credentials) {
                await connectDB()

                console.log("🔥 Credentials received:", credentials)

                if (!credentials?.email || !credentials.password) {
                    console.log("❌ Missing credentials")
                    return null
                }

                const user = await User.findOne({ email: credentials.email })
                console.log("🔥 User found:", user)

                if (!user) {
                    console.log("❌ No user with that email")
                    return null
                }

                const valid = await bcrypt.compare(credentials.password, user.password)
                console.log("🔥 Password is valid?", valid)

                if (!valid) {
                    console.log("❌ Wrong password")
                    return null
                }

                console.log("✅ Authorized user:", user.username)

                return {
                    id: user._id.toString(),
                    email: user.email,
                    username: user.username,
                }
            }

        })
    ],

    pages: {
        signIn: '/login'
    },
    session: {
        strategy: "jwt",
    },

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.username = user.username; //username doesnt exist on type User  
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id; //session.user is possibly undefined
                session.user.username = token.username; //session.user is possibly undefined
            }
            return session;
        },
    }
})

export { handler as GET, handler as POST }