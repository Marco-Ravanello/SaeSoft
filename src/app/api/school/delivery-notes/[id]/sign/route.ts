import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function PATCH(req: Request, { params }: { params: any }) {
  const session = await auth();
  if ((session?.user as any)?.role !== "SCHOOL") return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  const { id } = await params
  const { signature } = await req.json()

  console.log(`[API] Firmando remito ${id}. Tamaño de firma: ${Math.round((signature?.length || 0) / 1024)} KB`)

  try {
    const updated = await prisma.deliveryNote.update({
      where: { id },
      data: { status: "SIGNED", signature, signedAt: new Date() }
    })
    console.log(`[API] Remito ${id} firmado exitosamente.`)
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("Error saving signature:", error)
    return NextResponse.json({ error: "Error interno al guardar" }, { status: 500 })
  }
}
