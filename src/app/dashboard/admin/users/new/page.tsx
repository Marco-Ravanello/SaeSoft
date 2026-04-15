"use client"; import { useState } from "react"; import { useRouter } from "next/navigation"
export default function Page() {
  const [f, setF] = useState({ username: "", password: "", name: "", role: "STAFF" }); const router = useRouter()
  const sub = async (e: any) => {
    e.preventDefault(); const res = await fetch("/api/admin/users", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(f) })
    if (res.ok) { router.push("/dashboard/admin/users"); router.refresh() }
  }
  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <h1 className="text-xl font-bold mb-4">Nuevo Usuario</h1>
      <form onSubmit={sub} className="space-y-4">
        <input type="text" placeholder="Nombre" className="w-full border p-2" onChange={e=>setF({...f, name:e.target.value})} required />
        <input type="text" placeholder="Usuario" className="w-full border p-2" onChange={e=>setF({...f, username:e.target.value})} required />
        <input type="password" placeholder="Contraseña" className="w-full border p-2" onChange={e=>setF({...f, password:e.target.value})} required />
        <select className="w-full border p-2" onChange={e=>setF({...f, role:e.target.value})}>
          <option value="ADMIN">Admin</option><option value="STAFF">Staff</option><option value="PROVIDER">Proveedor</option><option value="SCHOOL">Escuela</option>
        </select>
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">Crear</button>
      </form>
    </div>
  )
}
