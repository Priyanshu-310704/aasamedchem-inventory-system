"use server"

import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth"
import { OrderStatus, QuotationStatus } from '@prisma/client'
import { authOptions } from "../../lib/auth"
import { prisma } from "../../lib/prisma"

async function requireSeller() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id || session.user.role !== "SELLER") {
    throw new Error("Unauthorized")
  }

  return session.user.id
}

export async function approveQuote(formData: FormData) {
  const sellerId = await requireSeller()
  const quotationId = String(formData.get("quotationId") ?? "")

  const quotation = await prisma.quotation.findFirst({
    where: {
      id: quotationId,
      status: QuotationStatus.PENDING,
      items: {
        some: {
          product: { sellerId },
        },
      },
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  })

  if (!quotation) {
    throw new Error("Quotation not found")
  }

  const sellerItems = quotation.items.filter((item) => item.product.sellerId === sellerId)
  const totalAmount = sellerItems.reduce(
    (sum, item) => sum + Number(item.quantity) * Number(item.unitPrice),
    0
  )

  await prisma.$transaction(async (tx) => {
    const order = await tx.order.create({
      data: {
        buyerId: quotation.buyerId,
        status: OrderStatus.PENDING,
        totalAmount,
        items: {
          create: sellerItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
          })),
        },
      },
    })

    for (const item of sellerItems) {
      await tx.product.update({
        where: { id: item.productId },
        data: {
          stockQuantity: {
            decrement: item.quantity,
          },
          inventoryTransactions: {
            create: {
              change: -Number(item.quantity),
              reason: `Order Placed: ${order.id}`,
            },
          },
        },
      })
    }

    await tx.quotation.update({
      where: { id: quotation.id },
      data: { status: QuotationStatus.ACCEPTED },
    })
  })

  revalidatePath("/seller/quotations")
  revalidatePath("/seller/orders")
  revalidatePath("/seller/inventory")
  revalidatePath("/buyer/quotations")
  revalidatePath("/buyer/orders")
}

export async function rejectQuote(formData: FormData) {
  const sellerId = await requireSeller()
  const quotationId = String(formData.get("quotationId") ?? "")

  const quotation = await prisma.quotation.findFirst({
    where: {
      id: quotationId,
      status: QuotationStatus.PENDING,
      items: {
        some: {
          product: { sellerId },
        },
      },
    },
  })

  if (!quotation) {
    throw new Error("Quotation not found")
  }

  await prisma.quotation.update({
    where: { id: quotation.id },
    data: { status: QuotationStatus.REJECTED },
  })

  revalidatePath("/seller/quotations")
  revalidatePath("/buyer/quotations")
}
