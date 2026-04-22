import Link from "next/link"
import { auth } from "@/auth"
import LogoutButton from "./LogoutButton"
import {
  LayoutDashboard,
  Users,
  ArrowLeftRight,
  Utensils,
  ClipboardList,
  Truck,
  School,
  UserCircle,
  FileSpreadsheet,
  AlertTriangle
} from "lucide-react"

export default async function Sidebar() {
  const session = await auth()
  const role = (session?.user as any)?.role

  const NavLink = ({ href, icon: Icon, children }: any) => (
    <Link
      href={href}
      className="flex items-center gap-3 p-3 hover:bg-slate-700/50 rounded-lg transition-all text-slate-300 hover:text-white group"
    >
      <Icon size={20} className="text-slate-400 group-hover:text-blue-400 transition-colors" />
      <span className="font-medium">{children}</span>
    </Link>
  )

  const SectionTitle = ({ children }: any) => (
    <div className="px-3 pt-6 pb-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
      {children}
    </div>
  )

  return (
    <div className="w-64 bg-slate-900 text-white min-h-screen p-4 flex flex-col border-r border-slate-800">
      <div className="flex items-center gap-3 px-3 py-6 mb-4 border-b border-slate-800">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-black text-white italic">
          3F
        </div>
        <div className="text-xl font-bold tracking-tight">SAE <span className="text-blue-500 italic text-sm">v1.0</span></div>
      </div>

      <nav className="space-y-1 flex-1 overflow-y-auto custom-scrollbar">
        <NavLink href="/dashboard" icon={LayoutDashboard}>Inicio</NavLink>
        <NavLink href="/dashboard/profile" icon={UserCircle}>Mi Perfil</NavLink>

        {role === "ADMIN" && (
          <>
            <SectionTitle>Administración</SectionTitle>
            <NavLink href="/dashboard/admin/users" icon={Users}>Usuarios</NavLink>
          </>
        )}

        {(role === "ADMIN" || role === "STAFF") && (
          <>
            <SectionTitle>Gestión SAE</SectionTitle>
            <NavLink href="/dashboard/admin/assignments" icon={ArrowLeftRight}>Asignaciones</NavLink>
            <NavLink href="/dashboard/admin/reports" icon={FileSpreadsheet}>Reportes</NavLink>
            <NavLink href="/dashboard/staff/menu" icon={Utensils}>Menú Semanal</NavLink>
            <NavLink href="/dashboard/staff/requests" icon={ClipboardList}>Solicitudes</NavLink>
          </>
        )}


        {role === "PROVIDER" && (
          <>
            <SectionTitle>Proveedor</SectionTitle>
            <NavLink href="/dashboard/provider/menu" icon={Utensils}>Mi Menú</NavLink>
            <NavLink href="/dashboard/provider/deliveries" icon={Truck}>Entregas</NavLink>
            <NavLink href="/dashboard/provider/claims" icon={AlertTriangle}>Reclamos</NavLink>
          </>
        )}

        {role === "SCHOOL" && (
          <>
            <SectionTitle>Escuela</SectionTitle>
            <NavLink href="/dashboard/school/menu" icon={Utensils}>Menú Semanal</NavLink>
            <NavLink href="/dashboard/school/deliveries" icon={School}>Recepción</NavLink>
            <NavLink href="/dashboard/school/requests" icon={ClipboardList}>Mis Pedidos</NavLink>
          </>
        )}
      </nav>

      <div className="pt-4 border-t border-slate-800 mt-4">
        <div className="px-3 py-2 mb-2">
          <div className="text-xs font-medium text-slate-400 truncate">{session?.user?.name}</div>
          <div className="text-[10px] text-slate-500 uppercase">{role}</div>
        </div>
        <LogoutButton />
      </div>
    </div>
  )
}
