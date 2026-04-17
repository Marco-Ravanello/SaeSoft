"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"
import { UserPlus, AlertCircle, Loader2 } from "lucide-react"

export default function Page() {
  const [f, setF] = useState({ username: "", password: "", name: "", role: "STAFF" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter()

  const sub = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(f)
    })

    if (res.ok) {
      router.push("/dashboard/admin/users");
      router.refresh()
    } else {
      const data = await res.json();
      setError(data.error || "Error al crear usuario");
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-3xl shadow-xl border border-slate-100 mt-10">
      <div className="flex items-center gap-3 mb-6 border-b border-slate-50 pb-6">
        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
          <UserPlus size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight italic">Nuevo Usuario</h1>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Configuración de Acceso</p>
        </div>
      </div>

      <form onSubmit={sub} className="space-y-5">
        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Nombre Completo</label>
          <input
            type="text"
            placeholder="Ej: Juan Pérez"
            className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-blue-500 outline-none transition-all"
            onChange={e=>setF({...f, name:e.target.value})}
            required
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Nombre de Usuario (Login)</label>
          <input
            type="text"
            placeholder="ej: jperez"
            className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-blue-500 outline-none transition-all"
            onChange={e=>setF({...f, username:e.target.value})}
            required
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Contraseña Temporal</label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-blue-500 outline-none transition-all"
            onChange={e=>setF({...f, password:e.target.value})}
            required
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Rol de Usuario</label>
          <select
            className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-blue-500 outline-none transition-all appearance-none"
            onChange={e=>setF({...f, role:e.target.value})}
            value={f.role}
            disabled={loading}
          >
            <option value="ADMIN">Administrador General</option>
            <option value="STAFF">Personal Administrativo</option>
            <option value="PROVIDER">Proveedor de Alimentos</option>
            <option value="SCHOOL">Establecimiento Escolar</option>
          </select>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-600 bg-red-50 p-4 rounded-xl text-sm font-bold border border-red-100 animate-in fade-in zoom-in duration-200">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-slate-900 text-white p-5 rounded-2xl font-black text-xl hover:bg-blue-600 transition-all shadow-xl shadow-slate-200 disabled:bg-slate-300 active:scale-[0.98]"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="animate-spin" />
              CREANDO...
            </span>
          ) : (
            "CREAR USUARIO"
          )}
        </button>
      </form>
    </div>
  )
}
