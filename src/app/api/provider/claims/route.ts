import { NextResponse } from "next/server"
import { auth } from "@/auth"
import prisma from "@/lib/prisma"

export async function GET(req: Request) {
  const session = await auth()
  if (!session || (session.user as any).role !== "PROVIDER") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const userId = (session.user as any).id

  try {
    const provider = await prisma.provider.findUnique({
      where: { userId }
    })

    if (!provider) {
      return NextResponse.json({ error: "Proveedor no encontrado" }, { status: 404 })
    }

    const claims = await prisma.claim.findMany({
      where: {
        school: {
          providerId: provider.id
        },
        status: "APPROVED", // Solo los aprobados por administrativos
        isResolvedBySchool: false // Solo los que no han sido marcados como resueltos por la escuela
      },
      include: {
        school: true
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ claims })
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener reclamos" }, { status: 500 })
  }
}
