import { auth } from "@/auth"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import {
  Users,
  ClipboardList,
  Truck,
  AlertTriangle,
  CheckCircle2,
  Clock,
  School as SchoolIcon,
  Utensils,
  ChevronRight,
  History
} from "lucide-react"
import Link from "next/link"

export default async function DashboardPage() {
  const session = await auth()
  if (!session) redirect("/login")

  const user: any = session.user
  const role = user.role
  const userId = user.id

  // Métricas generales según el rol
  let metrics: any = []
  let urgentAlerts: any = []
  let pendingSchools: any = []

  if (role === "ADMIN" || role === "STAFF") {
    const [userCount, pendingRequests, pendingClaims, activeDeliveriesData] = await Promise.all([
      prisma.user.count(),
      prisma.quotaChangeRequest.count({ where: { status: "PENDING" } }),
      prisma.claim.count({ where: { status: "PENDING" } }),
      prisma.deliveryNote.findMany({
        where: { status: "PENDING" },
        include: { school: true }
      })
    ])

    pendingSchools = activeDeliveriesData.map(d => d.school.name)
    const uniquePendingSchools = Array.from(new Set(pendingSchools))

    metrics = [
      { label: "Usuarios", value: userCount, icon: Users, color: "bg-blue-600", href: "/dashboard/admin/users" },
      { label: "Pedidos de Cupos", value: pendingRequests, icon: ClipboardList, color: "bg-amber-600", href: "/dashboard/staff/requests" },
      { label: "Reclamos Pendientes", value: pendingClaims, icon: AlertTriangle, color: "bg-red-600", href: "/dashboard/staff/requests" },
      {
        label: "Remitos Pendientes",
        value: uniquePendingSchools.length,
        icon: Clock,
        color: "bg-indigo-600",
        modalData: uniquePendingSchools
      }
    ]

    const latestClaims = await prisma.claim.findMany({
      where: { status: "PENDING" },
      take: 3,
      include: { school: true },
      orderBy: { createdAt: 'desc' }
    })
    urgentAlerts = latestClaims.map(c => ({
      title: `Reclamo de ${c.school.name}`,
      desc: c.description,
      type: "CLAIM",
      id: c.id
    }))
  }

  if (role === "SCHOOL") {
    const school = await prisma.school.findUnique({ where: { userId } })
    if (school) {
      const [pendingNotes, myClaims, authorizedReplacements] = await Promise.all([
        prisma.deliveryNote.count({ where: { schoolId: school.id, status: "PENDING" } }),
        prisma.claim.count({ where: { schoolId: school.id, status: "PENDING", isResolvedBySchool: false } }),
        prisma.claim.findMany({
          where: {
            schoolId: school.id,
            isReplacementAuthorized: true,
            isResolvedBySchool: false
          }
        })
      ])

      metrics = [
        { label: "Remitos Pendientes", value: pendingNotes, icon: Clock, color: "bg-amber-600", href: "/dashboard/school/deliveries" },
        { label: "Mis Reclamos", value: myClaims, icon: AlertTriangle, color: "bg-red-600", href: "/dashboard/school/requests" },
        { label: "Reposiciones Listas", value: authorizedReplacements.length, icon: CheckCircle2, color: "bg-green-600", href: "/dashboard/school/requests" }
      ]

      urgentAlerts = authorizedReplacements.map(r => ({
        title: "Reposición Autorizada",
        desc: `Se autorizó la reposición para: ${r.description}. Por favor, confirma cuando se haya resuelto.`,
        type: "REPLACEMENT",
        id: r.id
      }))
    }
  }

  if (role === "PROVIDER") {
    const provider = await prisma.provider.findUnique({ where: { userId } })
    if (provider) {
      const [pendingDeliveries, signedToday, pendingReplacements] = await Promise.all([
        prisma.deliveryNote.count({ where: { providerId: provider.id, status: "PENDING" } }),
        prisma.deliveryNote.count({
          where: {
            providerId: provider.id,
            status: "SIGNED",
            signedAt: { gte: new Date(new Date().setHours(0,0,0,0)) }
          }
        }),
        prisma.claim.count({
            where: { school: { providerId: provider.id }, status: "APPROVED", isResolvedBySchool: false }
        })
      ])

      metrics = [
        { label: "Por Entregar", value: pendingDeliveries, icon: Truck, color: "bg-amber-600", href: "/dashboard/provider/deliveries" },
        { label: "Entregas Hoy", value: signedToday, icon: CheckCircle2, color: "bg-green-600", href: "/dashboard/provider/deliveries" },
        { label: "Reposiciones", value: pendingReplacements, icon: AlertTriangle, color: "bg-red-600", href: "/dashboard/provider/claims" }
      ]
    }
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <header className="relative py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight italic uppercase">
                Panel <span className="text-blue-600">SAE</span>
            </h1>
            <p className="text-slate-500 font-medium mt-1 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                Bienvenido, {session.user?.name} • Tres de Febrero
            </p>
          </div>
          <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Estado del Sistema</p>
                <p className="text-xs font-bold text-slate-700">Conectado / Producción</p>
            </div>
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white">
                <SchoolIcon size={20} />
            </div>
          </div>
        </div>
      </header>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((m: any, i: number) => {
          const Content = (
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-5 group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className={`${m.color} w-16 h-16 rounded-[1.2rem] flex items-center justify-center text-white shadow-lg shadow-current/20 group-hover:scale-110 transition-transform`}>
                <m.icon size={32} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">{m.label}</p>
                <p className="text-4xl font-black text-slate-900">{m.value}</p>
              </div>
            </div>
          )

          if (m.modalData) {
            return (
                <div key={i} className="relative group">
                    {Content}
                    <div className="absolute top-full left-0 right-0 mt-4 bg-slate-900 text-white p-6 rounded-3xl shadow-2xl z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 scale-95 group-hover:scale-100">
                        <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                            <Clock size={14} /> Escuelas Pendientes
                        </h4>
                        <ul className="space-y-2">
                            {m.modalData.map((name: string, idx: number) => (
                                <li key={idx} className="text-sm font-bold border-b border-white/10 pb-2 last:border-0">{name}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            )
          }

          return m.href ? (
            <Link key={i} href={m.href}>
              {Content}
            </Link>
          ) : (
            <div key={i}>{Content}</div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          {urgentAlerts.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3 italic">
                <span className="w-8 h-1 bg-red-600 rounded-full" />
                Atención Requerida
              </h2>
              <div className="grid gap-4">
                {urgentAlerts.map((alert: any, i: number) => (
                    <div key={i} className={`p-6 rounded-[2rem] border-2 flex justify-between items-center group transition-all ${
                        alert.type === 'CLAIM' ? 'bg-red-50 border-red-100' : 'bg-green-50 border-green-100'
                    }`}>
                        <div className="space-y-1">
                            <h3 className={`font-black uppercase tracking-tight ${alert.type === 'CLAIM' ? 'text-red-900' : 'text-green-900'}`}>
                                {alert.title}
                            </h3>
                            <p className={`text-sm font-medium ${alert.type === 'CLAIM' ? 'text-red-700' : 'text-green-700'}`}>
                                {alert.desc}
                            </p>
                        </div>
                        <Link
                            href={role === 'SCHOOL' ? '/dashboard/school/requests' : '/dashboard/staff/requests'}
                            className={`p-3 rounded-2xl shadow-lg transition-all group-hover:scale-110 ${
                                alert.type === 'CLAIM'
                                    ? 'bg-red-900 text-white shadow-red-200'
                                    : 'bg-green-900 text-white shadow-green-200'
                            }`}
                        >
                            <ChevronRight size={24} />
                        </Link>
                    </div>
                ))}
              </div>
            </section>
          )}

          {/* Quick Actions */}
          <section className="space-y-4">
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight italic flex items-center gap-3">
               <span className="w-8 h-1 bg-slate-900 rounded-full" />
               Accesos Rápidos
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {role === "ADMIN" && (
                <Link href="/dashboard/admin/users/new" className="p-8 rounded-[2rem] border-2 border-dashed border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-all group relative overflow-hidden">
                  <div className="relative z-10">
                    <Users className="text-slate-400 group-hover:text-blue-600 mb-4" size={40} />
                    <h3 className="font-black text-slate-900 text-lg uppercase italic tracking-tight">Crear Usuario</h3>
                    <p className="text-sm text-slate-500 font-medium">Gestionar personal y proveedores.</p>
                  </div>
                </Link>
              )}
              {(role === "ADMIN" || role === "STAFF") && (
                <Link href="/dashboard/staff/menu/new" className="p-8 rounded-[2rem] border-2 border-dashed border-slate-200 hover:border-purple-500 hover:bg-purple-50 transition-all group relative overflow-hidden">
                  <div className="relative z-10">
                    <Utensils className="text-slate-400 group-hover:text-purple-600 mb-4" size={40} />
                    <h3 className="font-black text-slate-900 text-lg uppercase italic tracking-tight">Armar Menú</h3>
                    <p className="text-sm text-slate-500 font-medium">Configurar platos y gramajes.</p>
                  </div>
                </Link>
              )}
              {role === "PROVIDER" && (
                <Link href="/dashboard/provider/deliveries/new" className="p-8 rounded-[2rem] border-2 border-dashed border-slate-200 hover:border-orange-500 hover:bg-orange-50 transition-all group relative overflow-hidden">
                  <div className="relative z-10">
                    <Truck className="text-slate-400 group-hover:text-orange-600 mb-4" size={40} />
                    <h3 className="font-black text-slate-900 text-lg uppercase italic tracking-tight">Nuevo Remito</h3>
                    <p className="text-sm text-slate-500 font-medium">Cargar entrega de raciones.</p>
                  </div>
                </Link>
              )}
              {role === "SCHOOL" && (
                <Link href="/dashboard/school/requests/new-claim" className="p-8 rounded-[2rem] border-2 border-dashed border-slate-200 hover:border-red-500 hover:bg-red-50 transition-all group relative overflow-hidden">
                  <div className="relative z-10">
                    <AlertTriangle className="text-slate-400 group-hover:text-red-600 mb-4" size={40} />
                    <h3 className="font-black text-slate-900 text-lg uppercase italic tracking-tight">Cargar Reclamo</h3>
                    <p className="text-sm text-slate-500 font-medium">Reportar faltantes o mal estado.</p>
                  </div>
                </Link>
              )}
              <Link href="/dashboard/profile" className="p-8 rounded-[2rem] border-2 border-dashed border-slate-200 hover:border-slate-800 hover:bg-slate-50 transition-all group relative overflow-hidden">
                  <div className="relative z-10">
                    <Users className="text-slate-400 group-hover:text-slate-900 mb-4" size={40} />
                    <h3 className="font-black text-slate-900 text-lg uppercase italic tracking-tight">Mi Perfil</h3>
                    <p className="text-sm text-slate-500 font-medium">Gestión de seguridad y cuenta.</p>
                  </div>
              </Link>
            </div>
          </section>
        </div>

        <aside className="space-y-8">
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
            <div className="relative z-10 space-y-6">
                <div className="bg-white/10 w-12 h-12 rounded-2xl flex items-center justify-center">
                    <History className="text-blue-400" />
                </div>
                <h2 className="text-2xl font-black italic tracking-tighter uppercase leading-none">Estado de la <br />Plataforma</h2>
                <div className="space-y-4 pt-4 border-t border-white/10">
                    <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Último Login</span>
                        <span className="text-xs font-black">{new Date().toLocaleTimeString('es-AR')}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Base de Datos</span>
                        <span className="text-xs font-black text-green-400">OPERATIVA</span>
                    </div>
                </div>
            </div>
            <div className="absolute -right-16 -bottom-16 opacity-10">
                <SchoolIcon size={250} />
            </div>
          </div>

          <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm space-y-6">
            <h2 className="font-black text-slate-900 uppercase italic tracking-tight text-lg">Soporte SAE 3F</h2>
            <p className="text-sm text-slate-500 leading-relaxed font-medium">Si encuentras algún error en la plataforma digital, contacta con el administrador del sistema.</p>
            <button className="w-full py-4 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-2xl text-xs font-black uppercase tracking-widest transition-all">
              Ver Manual de Usuario
            </button>
          </div>
        </aside>
      </div>
    </div>
  )
}
