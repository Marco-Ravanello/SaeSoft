import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  debug: process.env.NODE_ENV !== 'production',
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: true, // Requerido para túneles HTTPS como Cloudflare
      },
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Usuario" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null

        // Importación dinámica para evitar cargar prisma/bcrypt en el middleware (Edge Runtime)
        const [{ default: prisma }, { default: bcrypt }] = await Promise.all([
          import("@/lib/prisma"),
          import("bcryptjs")
        ])

        const user = await prisma.user.findUnique({
          where: { username: credentials.username as string },
        })

        if (user && await (bcrypt.compare as any)(credentials.password as string, user.password)) {
          return {
            id: user.id,
            name: user.name,
            username: user.username,
            role: user.role,
          }
        }
        return null
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role
        token.id = user.id
        token.username = (user as any).username
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
        (session.user as any).username = token.username;
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
  },
})
