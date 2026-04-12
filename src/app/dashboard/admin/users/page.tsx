import prisma from "@/lib/prisma"; import { auth } from "@/auth"
export default async function Page() {
  const users = await prisma.user.findMany({ orderBy: { createdAt: "desc" } })
  return (
    <div>
      <div className="flex justify-between items-center mb-6"><h1 className="text-2xl font-bold">Usuarios</h1><a href="/dashboard/admin/users/new" className="bg-blue-600 text-white px-4 py-2 rounded">Nuevo</a></div>
      <div className="bg-white shadow rounded overflow-hidden">
        <table className="min-w-full"><thead><tr className="bg-gray-100"><th className="p-3 text-left">Nombre</th><th className="p-3 text-left">Rol</th></tr></thead>
        <tbody>{users.map(u=>(<tr key={u.id} className="border-t"><td className="p-3">{u.name}</td><td className="p-3">{u.role}</td></tr>))}</tbody></table>
      </div>
    </div>
  )
}
