"use server"

import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth"
import { QuotationStatus } from "../../generated/prisma"
import { authOptions } from "../../lib/auth"
import { prisma } from "../../lib/prisma"
import { toBaseUnit, type Dimension, type Unit } from "../../../src/lib/conversions"

async function requireBuyer() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id || session.user.role !== "BUYER") {
    throw new Error("Unauthorized")
  }

  return session.user.id
}

export async function requestQuote(formData: FormData) {
  const buyerId = await requireBuyer()
  const productId = String(formData.get("productId") ?? "")
  const unit = String(formData.get("unit")) as Unit
  const quantity = Number(formData.get("quantity"))

  if (!Number.isFinite(quantity) || quantity <= 0) {
    throw new Error("Invalid quantity")
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
  })

  if (!product) {
    throw new Error("Product not found")
  }

  const baseQuantity = toBaseUnit(quantity, unit, product.dimension as Dimension)
  const basePrice = Number(product.basePrice)

  await prisma.quotation.create({
    data: {
      buyerId,
      status: QuotationStatus.PENDING,
      items: {
        create: {
          productId: product.id,
          quantity: baseQuantity,
          unitPrice: basePrice,
        },
      },
    },
  })

  revalidatePath("/buyer/products")
  revalidatePath("/buyer/quotations")
  revalidatePath("/seller/quotations")
}
