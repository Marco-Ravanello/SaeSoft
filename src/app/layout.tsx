import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SaeSoft 3F - Sistema de Gestión SAE",
  description: "Plataforma para el Servicio Alimentario Escolar de Tres de Febrero",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className="antialiased">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
