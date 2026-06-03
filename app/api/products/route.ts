import { NextRequest, NextResponse } from "next/server"
import { ProductDimension } from '@prisma/client'
import { prisma } from "../../lib/prisma"
import { getUnits, type Dimension } from "../../../src/lib/conversions"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const search = searchParams.get("search")?.trim()
  const dimension = searchParams.get("dimension")
  const seller = searchParams.get("seller")
  const page = Math.max(Number(searchParams.get("page") ?? 1), 1)
  const limit = Math.min(Math.max(Number(searchParams.get("limit") ?? 10), 1), 50)
  const skip = (page - 1) * limit
  const where = {
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { sku: { contains: search, mode: "insensitive" as const } },
            { description: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {}),
    ...(dimension && Object.values(ProductDimension).includes(dimension as ProductDimension)
      ? { dimension: dimension as ProductDimension }
      : {}),
    ...(seller ? { sellerId: seller } : {}),
  }

  const [products, total] = await prisma.$transaction([
    prisma.product.findMany({
      where,
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
    }),
    prisma.product.count({ where }),
  ])

  return NextResponse.json({
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
    products: products.map((product) => ({
      id: product.id,
      name: product.name,
      sku: product.sku,
      description: product.description,
      dimension: product.dimension,
      availableUnits: getUnits(product.dimension as Dimension),
      baseUnit: product.baseUnit,
      price: Number(product.basePrice),
      stock: Number(product.stockQuantity),
      seller: product.seller,
    })),
  })
}
