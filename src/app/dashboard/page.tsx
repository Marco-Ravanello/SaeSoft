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
  Utensils
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

  if (role === "ADMIN" || role === "STAFF") {
    const [userCount, pendingRequests, pendingClaims, activeDeliveries] = await Promise.all([
      prisma.user.count(),
      prisma.quotaChangeRequest.count({ where: { status: "PENDING" } }),
      prisma.claim.count({ where: { status: "PENDING" } }),
      prisma.deliveryNote.count({ where: { status: "PENDING" } })
    ])

    metrics = [
      { label: "Usuarios", value: userCount, icon: Users, color: "bg-blue-500" },
      { label: "Pedidos de Cupos", value: pendingRequests, icon: ClipboardList, color: "bg-amber-500" },
      { label: "Reclamos Pendientes", value: pendingClaims, icon: AlertTriangle, color: "bg-red-500" },
      { label: "Remitos en Camino", value: activeDeliveries, icon: Truck, color: "bg-indigo-500" }
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
        prisma.claim.count({ where: { schoolId: school.id, status: "PENDING" } }),
        prisma.claim.findMany({
          where: {
            schoolId: school.id,
            isReplacementAuthorized: true,
            isResolvedBySchool: false
          }
        })
      ])

      metrics = [
        { label: "Remitos Pendientes", value: pendingNotes, icon: Clock, color: "bg-amber-500" },
        { label: "Mis Reclamos", value: myClaims, icon: AlertTriangle, color: "bg-red-500" },
        { label: "Reposiciones Listas", value: authorizedReplacements.length, icon: CheckCircle2, color: "bg-green-500" }
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
      const [pendingDeliveries, signedToday] = await Promise.all([
        prisma.deliveryNote.count({ where: { providerId: provider.id, status: "PENDING" } }),
        prisma.deliveryNote.count({
          where: {
            providerId: provider.id,
            status: "SIGNED",
            signedAt: { gte: new Date(new Date().setHours(0,0,0,0)) }
          }
        })
      ])

      metrics = [
        { label: "Pendientes de Firma", value: pendingDeliveries, icon: Clock, color: "bg-amber-500" },
        { label: "Entregas Hoy", value: signedToday, icon: CheckCircle2, color: "bg-green-500" }
      ]
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Bienvenido, {session.user?.name}</h1>
        <p className="text-slate-500 mt-1">Panel de control del Servicio Alimentario Escolar - SAE 3F</p>
      </header>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((m: any, i: number) => (
          <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-5">
            <div className={`${m.color} w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-current/20`}>
              <m.icon size={28} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{m.label}</p>
              <p className="text-3xl font-black text-slate-800">{m.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Alerts & Important Stuff */}
        <div className="lg:col-span-2 space-y-6">
          {urgentAlerts.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <AlertTriangle className="text-amber-500" size={24} />
                Atención Requerida
              </h2>
              {urgentAlerts.map((alert: any, i: number) => (
                <div key={i} className={`p-5 rounded-3xl border ${
                  alert.type === 'CLAIM' ? 'bg-red-50 border-red-100' : 'bg-green-50 border-green-100'
                } flex justify-between items-start gap-4`}>
                  <div className="space-y-1">
                    <h3 className={`font-bold ${alert.type === 'CLAIM' ? 'text-red-900' : 'text-green-900'}`}>
                      {alert.title}
                    </h3>
                    <p className={`text-sm ${alert.type === 'CLAIM' ? 'text-red-700' : 'text-green-700'}`}>
                      {alert.desc}
                    </p>
                  </div>
                  <Link
                    href={role === 'SCHOOL' ? '/dashboard/school/requests' : '/dashboard/staff/requests'}
                    className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap shadow-sm ${
                      alert.type === 'CLAIM'
                        ? 'bg-red-900 text-white hover:bg-red-800'
                        : 'bg-green-900 text-white hover:bg-green-800'
                    }`}
                  >
                    Ver detalle
                  </Link>
                </div>
              ))}
            </div>
          )}

          {/* Quick Access Grid */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-800">Accesos Rápidos</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {role === "ADMIN" && (
                <Link href="/dashboard/admin/users/new" className="p-6 rounded-3xl border-2 border-dashed border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-all group">
                  <Users className="text-slate-400 group-hover:text-blue-600 mb-3" size={32} />
                  <h3 className="font-bold text-slate-800">Crear Usuario</h3>
                  <p className="text-sm text-slate-500">Añadir personal, escuela o proveedor.</p>
                </Link>
              )}
              {(role === "ADMIN" || role === "STAFF") && (
                <Link href="/dashboard/staff/menu/new" className="p-6 rounded-3xl border-2 border-dashed border-slate-200 hover:border-purple-500 hover:bg-purple-50 transition-all group">
                  <Utensils className="text-slate-400 group-hover:text-purple-600 mb-3" size={32} />
                  <h3 className="font-bold text-slate-800">Armar Menú</h3>
                  <p className="text-sm text-slate-500">Configurar gramajes y platos semanales.</p>
                </Link>
              )}
              {role === "PROVIDER" && (
                <Link href="/dashboard/provider/deliveries/new" className="p-6 rounded-3xl border-2 border-dashed border-slate-200 hover:border-orange-500 hover:bg-orange-50 transition-all group">
                  <Truck className="text-slate-400 group-hover:text-orange-600 mb-3" size={32} />
                  <h3 className="font-bold text-slate-800">Nuevo Remito</h3>
                  <p className="text-sm text-slate-500">Cargar entrega para una escuela.</p>
                </Link>
              )}
              {role === "SCHOOL" && (
                <Link href="/dashboard/school/requests/new-claim" className="p-6 rounded-3xl border-2 border-dashed border-slate-200 hover:border-red-500 hover:bg-red-50 transition-all group">
                  <AlertTriangle className="text-slate-400 group-hover:text-red-600 mb-3" size={32} />
                  <h3 className="font-bold text-slate-800">Nuevo Reclamo</h3>
                  <p className="text-sm text-slate-500">Informar faltantes o mal estado.</p>
                </Link>
              )}
              <Link href="/dashboard/profile" className="p-6 rounded-3xl border-2 border-dashed border-slate-200 hover:border-slate-500 hover:bg-slate-50 transition-all group">
                <Users className="text-slate-400 group-hover:text-slate-600 mb-3" size={32} />
                <h3 className="font-bold text-slate-800">Mi Perfil</h3>
                <p className="text-sm text-slate-500">Cambiar contraseña y datos.</p>
              </Link>
            </div>
          </div>
        </div>

        {/* Sidebar / Info Card */}
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-3xl p-6 text-white overflow-hidden relative">
            <div className="relative z-10 space-y-4">
              <h2 className="text-xl font-bold">Estado del Sistema</h2>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-slate-300">Conectado a Base de Datos</span>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-slate-500 uppercase font-bold">Última Sincronización</p>
                <p className="text-sm">{new Date().toLocaleString('es-AR')}</p>
              </div>
            </div>
            <div className="absolute -right-10 -bottom-10 opacity-10">
              <SchoolIcon size={180} />
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
            <h2 className="font-bold text-slate-800">Ayuda y Soporte</h2>
            <p className="text-sm text-slate-500">Si tienes problemas con la plataforma SAE, contacta al área técnica.</p>
            <button className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-sm font-bold transition-all">
              Consultar Manual
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
