import { connectDB } from "@/lib/db"
import User from "@/models/usermodel"
import bcrypt from "bcryptjs"
import NextAuth, { type AuthOptions } from "next-auth"
import Credentials from "next-auth/providers/credentials"

export const authOptions: AuthOptions = {
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        await connectDB()

        if (!credentials?.email || !credentials.password) return null

        const user = await User.findOne({ email: credentials.email })
        if (!user) return null

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
      },
    }),
  ],

  pages: {
    signIn: "/login",
  },

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.username = user.username
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.username = token.username as string
      }
      return session
    },
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
