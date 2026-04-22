import { NextResponse } from "next/server"
import { auth } from "@/auth"
import prisma from "@/lib/prisma"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  try {
    const school = await prisma.school.findUnique({
      where: { userId: session.user.id },
      include: { services: true }
    })

    if (!school) {
      return NextResponse.json({ error: "No eres una escuela" }, { status: 404 })
    }

    return NextResponse.json({ services: school.services })
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener servicios" }, { status: 500 })
  }
}
