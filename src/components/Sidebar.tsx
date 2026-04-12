import Link from "next/link"; import { auth } from "@/auth"
export default async function Sidebar() {
  const session = await auth(); const role = (session?.user as any)?.role
  return (
    <div className="w-64 bg-slate-800 text-white min-h-screen p-4 flex flex-col">
      <div className="text-xl font-bold mb-8 text-blue-400">SAE 3F</div>
      <nav className="space-y-2 flex-1">
        <Link href="/dashboard" className="block p-2 hover:bg-slate-700 rounded">Inicio</Link>
        {role === "ADMIN" && (<><div className="pt-4 text-xs text-gray-400">ADMIN</div><Link href="/dashboard/admin/users" className="block p-2 hover:bg-slate-700 rounded">Usuarios</Link><Link href="/dashboard/admin/assignments" className="block p-2 hover:bg-slate-700 rounded">Asignaciones</Link></>)}
        {(role === "ADMIN" || role === "STAFF") && (<><div className="pt-4 text-xs text-gray-400">STAFF</div><Link href="/dashboard/staff/menu" className="block p-2 hover:bg-slate-700 rounded">Menú</Link><Link href="/dashboard/staff/requests" className="block p-2 hover:bg-slate-700 rounded">Solicitudes</Link></>)}
        {role === "PROVIDER" && (<><div className="pt-4 text-xs text-gray-400">PROVEEDOR</div><Link href="/dashboard/provider/deliveries" className="block p-2 hover:bg-slate-700 rounded">Entregas</Link></>)}
        {role === "SCHOOL" && (<><div className="pt-4 text-xs text-gray-400">ESCUELA</div><Link href="/dashboard/school/deliveries" className="block p-2 hover:bg-slate-700 rounded">Recepción</Link></>)}
      </nav>
      <Link href="/api/auth/signout" className="block p-2 text-red-400 hover:bg-slate-700 rounded">Salir</Link>
    </div>
  )
}
