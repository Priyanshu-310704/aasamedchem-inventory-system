"use server"

import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth"
import { OrderStatus } from '@prisma/client'
import { authOptions } from "../../lib/auth"
import { prisma } from "../../lib/prisma"

async function requireSeller() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id || session.user.role !== "SELLER") {
    throw new Error("Unauthorized")
  }

  return session.user.id
}

export async function updateOrderStatus(formData: FormData) {
  const sellerId = await requireSeller()
  const orderId = String(formData.get("orderId") ?? "")
  const status = String(formData.get("status")) as OrderStatus

  if (!Object.values(OrderStatus).includes(status)) {
    throw new Error("Invalid status")
  }

  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      items: {
        some: {
          product: { sellerId },
        },
      },
    },
  })

  if (!order) {
    throw new Error("Order not found")
  }

  await prisma.order.update({
    where: { id: order.id },
    data: { status },
  })

  revalidatePath("/seller/orders")
  revalidatePath("/buyer/orders")
  revalidatePath("/admin/orders")
}
