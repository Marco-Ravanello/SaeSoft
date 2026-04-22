import { NextResponse } from "next/server"
import { auth } from "@/auth"
import prisma from "@/lib/prisma"

export async function PATCH(req: Request) {
  const session = await auth()
  if (!session || (session.user as any).role !== "SCHOOL") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  try {
    const { id, action } = await req.json()

    if (action === "RESOLVE") {
      await prisma.claim.update({
        where: { id },
        data: {
          isResolvedBySchool: true,
          resolvedAt: new Date()
        }
      })
      return NextResponse.json({ ok: true })
    }

    return NextResponse.json({ error: "Acción no reconocida" }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ error: "Error al actualizar reclamo" }, { status: 500 })
  }
}
