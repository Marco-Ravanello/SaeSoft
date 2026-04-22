import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const session = await auth();
  if ((session?.user as any)?.role !== "ADMIN" && (session?.user as any)?.role !== "STAFF") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { schoolId, providerId } = await req.json()
  await prisma.school.update({
    where: { id: schoolId },
    data: { providerId: providerId || null }
  })
  return NextResponse.json({ ok: true })
}

export async function PATCH(req: Request) {
  const session = await auth();
  if ((session?.user as any)?.role !== "ADMIN" && (session?.user as any)?.role !== "STAFF") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { schoolId, serviceType, enabled } = await req.json()

  if (enabled) {
    await prisma.schoolService.upsert({
      where: { schoolId_serviceType: { schoolId, serviceType } },
      update: { quota: 0 },
      create: { schoolId, serviceType, quota: 0 }
    })
  } else {
    await prisma.schoolService.deleteMany({
      where: { schoolId, serviceType }
    })
  }

  return NextResponse.json({ ok: true })
}
