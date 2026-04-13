import { auth } from "@/auth"; import prisma from "@/lib/prisma"; import { NextResponse } from "next/server"
export async function POST(req: Request) {
  const session = await auth();
  if ((session?.user as any)?.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  const { schoolId, providerId } = await req.json()
  await prisma.school.update({ where: { id: schoolId }, data: { providerId: providerId || null } })
  return NextResponse.json({ ok: true })
}
