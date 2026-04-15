import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function PATCH(req: Request, { params }: { params: any }) {
  const session = await auth();
  if ((session?.user as any)?.role !== "SCHOOL") return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  const { id } = await params
  const { reason } = await req.json()

  // 1. Actualizar el remito a REJECTED
  const updatedNote = await prisma.deliveryNote.update({
    where: { id },
    data: {
      status: "REJECTED",
      rejectionReason: reason
    },
    include: { school: true }
  })

  // 2. Crear automáticamente un reclamo
  await prisma.claim.create({
    data: {
      schoolId: updatedNote.schoolId,
      description: `RECHAZO DE REMITO #${id.substring(id.length-6).toUpperCase()}: ${reason}`,
      status: "PENDING"
    }
  })

  return NextResponse.json({ ok: true })
}
