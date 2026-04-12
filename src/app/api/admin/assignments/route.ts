import { auth } from "@/auth"; import prisma from "@/lib/prisma"; import { NextResponse } from "next/server"
export async function POST(req: Request) {
  const { schoolId, providerId } = await req.json()
  await prisma.school.update({ where: { id: schoolId }, data: { providerId: providerId || null } })
  return NextResponse.json({ ok: true })
}
