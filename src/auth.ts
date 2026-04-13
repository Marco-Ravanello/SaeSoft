import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import prisma from "@/lib/prisma"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: { username: { label: "Usuario" }, password: { label: "Contraseña", type: "password" } },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null
        const user = await prisma.user.findUnique({ where: { username: credentials.username as string } })
        if (user && user.password === credentials.password) return { id: user.id, name: user.name, role: user.role }
        return null
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) { if (user) { token.role = (user as any).role; token.id = user.id }; return token },
    async session({ session, token }) { if (session.user) { (session.user as any).role = token.role; (session.user as any).id = token.id }; return session },
  },
  pages: { signIn: "/login" },
})
