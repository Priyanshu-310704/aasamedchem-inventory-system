"use server"

import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth"
import { ProductDimension } from '@generated/prisma'
import { authOptions } from "../../lib/auth"
import { prisma } from "../../lib/prisma"
import { getBaseUnit, type Dimension } from "../../../src/lib/conversions"

function readProductForm(formData: FormData) {
  const dimension = String(formData.get("dimension")) as Dimension
  const stockQuantity = Number(formData.get("stock"))
  const basePrice = Number(formData.get("price"))

  if (!Object.values(ProductDimension).includes(dimension)) {
    throw new Error("Invalid dimension")
  }

  if (!Number.isFinite(stockQuantity) || stockQuantity < 0) {
    throw new Error("Invalid stock")
  }

  if (!Number.isFinite(basePrice) || basePrice < 0) {
    throw new Error("Invalid price")
  }

  return {
    name: String(formData.get("name") ?? ""),
    sku: String(formData.get("sku") ?? ""),
    description: String(formData.get("description") ?? ""),
    dimension,
    stockQuantity,
    basePrice,
    baseUnit: getBaseUnit(dimension),
  }
}

async function requireSeller() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id || session.user.role !== "SELLER") {
    throw new Error("Unauthorized")
  }

  return session.user.id
}

export async function createProduct(formData: FormData) {
  const sellerId = await requireSeller()
  const data = readProductForm(formData)

  await prisma.product.create({
    data: {
      ...data,
      sellerId,
      inventoryTransactions:
        data.stockQuantity > 0
          ? {
              create: {
                change: data.stockQuantity,
                reason: "Stock Added",
              },
            }
          : undefined,
    },
  })

  revalidatePath("/seller/products")
  revalidatePath("/buyer/products")

}

export async function updateProduct(formData: FormData) {
  const sellerId = await requireSeller()
  const productId = String(formData.get("productId") ?? "")
  const data = readProductForm(formData)

  const existing = await prisma.product.findFirst({
    where: { id: productId, sellerId },
  })

  if (!existing) {
    throw new Error("Product not found")
  }

  const stockChange = data.stockQuantity - Number(existing.stockQuantity)

  await prisma.product.update({
    where: { id: productId },
    data: {
      ...data,
      inventoryTransactions:
        stockChange !== 0
          ? {
              create: {
                change: stockChange,
                reason: stockChange > 0 ? "Stock Added" : "Stock Removed",
              },
            }
          : undefined,
    },
  })

  revalidatePath("/seller/products")
  revalidatePath("/buyer/products")
}

export async function deleteProduct(formData: FormData) {
  const sellerId = await requireSeller()
  const productId = String(formData.get("productId") ?? "")

  const existing = await prisma.product.findFirst({
    where: { id: productId, sellerId },
  })

  if (!existing) {
    throw new Error("Product not found")
  }

  await prisma.$transaction([
    prisma.inventoryTransaction.deleteMany({
      where: { productId },
    }),
    prisma.product.delete({
      where: { id: productId },
    }),
  ])

  revalidatePath("/seller/products")
  revalidatePath("/buyer/products")
}
