import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function PATCH(req: Request, { params }: { params: any }) {
  const session = await auth();
  if ((session?.user as any)?.role !== "SCHOOL") return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  const { id } = await params

  const timestamp = new Date()
  const user: any = session?.user
  const stampId = `STAMP-${user?.id?.slice(-6) || 'UNK'}-${timestamp.getTime()}`
  const digitalStamp = `Firmado Digitalmente por ${user?.name || 'Usuario'} (${user?.username || 'user'}) el ${timestamp.toLocaleString('es-AR')}. ID de Verificación: ${stampId}`

  console.log(`[API] Generando firma digital para remito ${id}`)

  try {
    const updated = await prisma.deliveryNote.update({
      where: { id },
      data: {
        status: "SIGNED",
        signature: digitalStamp,
        signedAt: timestamp
      }
    })
    console.log(`[API] Remito ${id} firmado exitosamente.`)
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("Error saving signature:", error)
    return NextResponse.json({ error: "Error interno al guardar" }, { status: 500 })
  }
}
