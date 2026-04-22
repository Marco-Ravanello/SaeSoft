import { NextResponse } from "next/server"
import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function PUT(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  try {
    const { name, currentPassword, newPassword } = await req.json()

    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    })

    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
    }

    const updateData: any = {}
    if (name) updateData.name = name

    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json({ error: "Contraseña actual requerida para cambiar contraseña" }, { status: 400 })
      }
      const isMatch = await bcrypt.compare(currentPassword, user.password)
      if (!isMatch) {
        return NextResponse.json({ error: "La contraseña actual es incorrecta" }, { status: 400 })
      }
      updateData.password = await bcrypt.hash(newPassword, 10)
    }

    await prisma.user.update({
      where: { id: user.id },
      data: updateData
    })

    return NextResponse.json({ message: "Perfil actualizado correctamente" })
  } catch (error) {
    console.error("Error updating profile:", error)
    return NextResponse.json({ error: "Error al actualizar el perfil" }, { status: 500 })
  }
}
