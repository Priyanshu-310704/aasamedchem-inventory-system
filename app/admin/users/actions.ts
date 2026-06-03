"use server"

import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth"
import { Role } from '@prisma/client'
import { authOptions } from "../../lib/auth"
import { prisma } from "../../lib/prisma"

async function requireAdmin() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized")
  }
}

export async function updateUserRole(formData: FormData) {
  await requireAdmin()

  const userId = String(formData.get("userId") ?? "")
  const role = String(formData.get("role")) as Role

  if (!Object.values(Role).includes(role)) {
    throw new Error("Invalid role")
  }

  await prisma.user.update({
    where: { id: userId },
    data: { role },
  })

  revalidatePath("/admin/users")
  revalidatePath("/admin/sellers")
}
