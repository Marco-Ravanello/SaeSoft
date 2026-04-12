import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function PATCH(req: Request, { params }: { params: any }) {
  const { id } = await params
  const { signature } = await req.json()
  await prisma.deliveryNote.update({
    where: { id },
    data: { status: "SIGNED", signature, signedAt: new Date() }
  })
  return NextResponse.json({ ok: true })
}
