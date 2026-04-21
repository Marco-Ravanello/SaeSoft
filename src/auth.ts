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
        const { default: prisma } = await import("@/lib/prisma")
        const bcrypt = await import("bcryptjs").then(m => m.default || m)

        const inputUsername = (credentials.username as string || "").trim()
        console.log(`[Auth] Intento de login: "${inputUsername}"`)

        try {
          const user = await prisma.user.findUnique({
            where: { username: inputUsername },
          })

          if (!user) {
            console.log(`[Auth] ❌ Usuario no encontrado: ${credentials.username}`)
            return null
          }

          // Verificamos que bcrypt tenga la función compare
          if (typeof bcrypt.compare !== 'function') {
            console.error("[Auth] ❌ Error: bcrypt.compare no es una función", bcrypt)
            return null
          }

          const isValid = await bcrypt.compare(credentials.password as string, user.password)
          console.log(`[Auth] Resultado para ${user.username}: ${isValid ? "✅ VÁLIDO" : "❌ INVÁLIDO"}`)

          if (isValid) {
            return {
              id: user.id,
              name: user.name,
              username: user.username,
              role: user.role,
            }
          }
          return null
        } catch (error) {
          console.error(`[Auth] Error crítico en authorize:`, error)
          return null
        }
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
