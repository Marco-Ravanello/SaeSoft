"use client"

import { useState } from "react"
import { Trash2, Loader2 } from "lucide-react"

export default function DeleteUserButton({ userId }: { userId: string }) {
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!confirm("¿Está seguro de que desea eliminar este usuario? Se borrarán todos sus datos asociados.")) return

    setLoading(true)
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE"
      })
      if (res.ok) {
        window.location.reload()
      } else {
        alert("Error al eliminar")
        setLoading(false)
      }
    } catch (err) {
      alert("Error de conexión")
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-red-400 hover:text-red-600 transition-colors p-2 hover:bg-red-50 rounded-lg"
      title="Eliminar usuario"
    >
      {loading ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
    </button>
  )
}
