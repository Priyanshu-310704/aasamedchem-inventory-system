import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "./prisma"
import bcrypt from "bcryptjs"
import { NextAuthOptions } from "next-auth"

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",        // store session in JWT token, not database
  },

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email:    { label: "Email",    type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        // 1. Check if email and password were provided
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required")
        }

        // 2. Find user in database by email
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        // 3. If no user found
        if (!user) {
          throw new Error("No account found with this email")
        }

        // 4. Compare entered password with hashed password in DB
        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) {
          throw new Error("Incorrect password")
        }

        // 5. Return user object (this gets stored in the JWT token)
        return {
          id:    user.id,
          name:  user.name,
          email: user.email,
          role:  user.role,   // ADMIN / SELLER / BUYER
        }
      },
    }),
  ],

  callbacks: {
    // Called when JWT token is created/updated
    async jwt({ token, user }) {
      if (user) {
        token.id   = user.id
        token.role = user.role  // add role to token
      }
      return token
    },

    // Called when session is accessed in your app
    async session({ session, token }) {
      if (token) {
        session.user.id   = token.id as string
        session.user.role = token.role as string  // add role to session
      }
      return session
    },
  },

  pages: {
    signIn: "/login",   // redirect to your custom login page
  },

  secret: process.env.NEXTAUTH_SECRET,
}