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

                if (!credentials?.email || !credentials.password) return null;

                const user = await User.findOne({ email: credentials.email })
                if (!user) return null;
                const valid = await bcrypt.compare(
                    credentials.password,
                    user.password
                )
                if (!valid) return null

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
                session.user.id = token.id;//session.user is possibly undefined
                session.user.username = token.username;
            }
            return session;
        },
    }
})

export { handler as GET, handler as POST }