import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function DELETE(req: Request, { params }: { params: any }) {
  const session = await auth()
  if ((session?.user as any)?.role !== "ADMIN") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 })
  }

  const { id } = await params

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: { school: true, provider: true }
    })

    if (!user) return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })

    await prisma.$transaction(async (tx) => {
      if (user.school) {
        await tx.schoolService.deleteMany({ where: { schoolId: user.school.id } })
        await tx.quotaChangeRequest.deleteMany({ where: { schoolId: user.school.id } })
        await tx.claim.deleteMany({ where: { schoolId: user.school.id } })
        await tx.deliveryNote.deleteMany({ where: { schoolId: user.school.id } })
        await tx.school.delete({ where: { id: user.school.id } })
      }

      if (user.provider) {
        await tx.deliveryNote.deleteMany({ where: { providerId: user.provider.id } })

        // Relación multinivel con tipos seguros para SQLite/Prisma
        const menus = await tx.menu.findMany({ where: { providerId: user.provider.id } })
        const menuIds = menus.map(m => m.id)

        const dishes = await tx.dish.findMany({ where: { menuId: { in: menuIds } } })
        const dishIds = dishes.map(d => d.id)

        await tx.ingredient.deleteMany({ where: { dishId: { in: dishIds } } })
        await tx.dish.deleteMany({ where: { menuId: { in: menuIds } } })
        await tx.menu.deleteMany({ where: { providerId: user.provider.id } })

        // Desvincular escuelas asignadas
        await tx.school.updateMany({
          where: { providerId: user.provider.id },
          data: { providerId: null }
        })

        await tx.provider.delete({ where: { id: user.provider.id } })
      }

      await tx.user.delete({ where: { id } })
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Error al eliminar usuario" }, { status: 500 })
  }
}
