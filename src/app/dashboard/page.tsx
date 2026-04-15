import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const session = await auth()
  if (!session) redirect("/login")
  const role = (session.user as any).role
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-900">Bienvenido, {session.user?.name}</h1>
      <p className="text-gray-600 mb-8">Rol: {role}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {role === "ADMIN" && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 border-l-4 border-purple-500">
            <h2 className="font-bold text-lg mb-2">Panel de Control</h2>
            <p className="text-sm text-gray-500">Gestiona usuarios y asignaciones de proveedores.</p>
          </div>
        )}
        {(role === "ADMIN" || role === "STAFF") && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 border-l-4 border-blue-500">
            <h2 className="font-bold text-lg mb-2">Administración SAE</h2>
            <p className="text-sm text-gray-500">Gestiona menús semanales, solicitudes de cupos y reclamos.</p>
          </div>
        )}
        {role === "PROVIDER" && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 border-l-4 border-orange-500">
            <h2 className="font-bold text-lg mb-2">Portal de Proveedor</h2>
            <p className="text-sm text-gray-500">Genera remitos digitales y consulta el menú con gramajes.</p>
          </div>
        )}
        {role === "SCHOOL" && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 border-l-4 border-green-500">
            <h2 className="font-bold text-lg mb-2">Portal de Escuela</h2>
            <p className="text-sm text-gray-500">Firma remitos digitales y solicita cambios en el servicio.</p>
          </div>
        )}
      </div>
    </div>
  )
}
