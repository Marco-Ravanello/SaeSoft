import { auth } from "@/auth"; import prisma from "@/lib/prisma"; import { NextResponse } from "next/server"

export async function PATCH(req: Request, { params }: { params: any }) {
  const session = await auth();
  const role = (session?.user as any)?.role
  if (role !== "ADMIN" && role !== "STAFF") return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  const { id } = await params
  const { action, type } = await req.json() // action: 'APPROVED' or 'REJECTED'

  if (type === "quota") {
    await prisma.quotaChangeRequest.update({
      where: { id },
      data: { status: action }
    })
  } else if (type === "claim") {
    await prisma.claim.update({
      where: { id },
      data: { status: action }
    })
  }

  return NextResponse.json({ success: true })
}
