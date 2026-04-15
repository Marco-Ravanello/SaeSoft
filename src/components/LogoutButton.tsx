"use client"

import { signOut } from "next-auth/react"
import { LogOut } from "lucide-react"

export default function LogoutButton() {
  const handleLogout = async () => {
    // Redirección manual para asegurar que funcione en entornos de proxy/túnel
    await signOut({ redirect: false })
    window.location.href = "/login"
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
