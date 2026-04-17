"use client"

import { signOut } from "next-auth/react"
import { LogOut } from "lucide-react"

export default function LogoutButton() {
  const handleLogout = async () => {
    // Forzar limpieza completa de cookies y sesión
    await signOut({ redirect: false })
    // Reemplazar el historial para evitar "volver atrás"
    window.location.replace("/login")
  }

  return (
    <button
      onClick={handleLogout}
      className="w-full flex items-center gap-3 p-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-all mt-auto font-medium"
    >
      <LogOut size={20} />
      <span>Salir</span>
    </button>
  )
}
