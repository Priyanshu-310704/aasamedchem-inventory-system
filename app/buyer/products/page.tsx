import { prisma } from "../../lib/prisma"
import { getUnits, type Dimension } from "../../../src/lib/conversions"
import { requestQuote } from "./actions"

type BuyerProductsPageProps = {
  searchParams?: Promise<{
    search?: string
    dimension?: string
    seller?: string
    page?: string
  }>
}

export default async function BuyerProductsPage({ searchParams }: BuyerProductsPageProps) {
  const params = await searchParams
  const search = params?.search?.trim()
  const dimension = params?.dimension
  const seller = params?.seller
  const page = Math.max(Number(params?.page ?? 1), 1)
  const limit = 10
  const skip = (page - 1) * limit

  const sellers = await prisma.user.findMany({
    where: { role: "SELLER" },
    orderBy: { name: "asc" },
  })

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
    ...(dimension ? { dimension: dimension as never } : {}),
    ...(seller ? { sellerId: seller } : {}),
  }

  const [products, total] = await prisma.$transaction([
    prisma.product.findMany({
      where,
      include: {
        seller: true,
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.product.count({ where }),
  ])
  const pages = Math.max(Math.ceil(total / limit), 1)
  const query = new URLSearchParams()

  if (search) query.set("search", search)
  if (dimension) query.set("dimension", dimension)
  if (seller) query.set("seller", seller)

  return (
    <div className="grid gap-6">
      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <form className="grid gap-3 md:grid-cols-[1fr_220px_220px_auto]">
          <input
            name="search"
            defaultValue={search}
            placeholder="Search products"
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
          <select
            name="dimension"
            defaultValue={dimension ?? ""}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="">All dimensions</option>
            <option value="WEIGHT">Weight</option>
            <option value="VOLUME">Volume</option>
            <option value="COUNT">Count</option>
          </select>
          <select
            name="seller"
            defaultValue={seller ?? ""}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="">All sellers</option>
            {sellers.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
          <button className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
            Search
          </button>
        </form>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white">
        <div className="border-b border-slate-200 p-5">
          <h3 className="text-lg font-semibold">Products</h3>
        </div>
        {products.length === 0 ? (
          <div className="p-6 text-sm text-slate-500">No products found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Seller</th>
                  <th className="px-4 py-3">Available Units</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Stock</th>
                  <th className="px-4 py-3">Quote</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {products.map((product) => (
                  <tr key={product.id}>
                    <td className="px-4 py-4">
                      <p className="font-medium">{product.name}</p>
                      <p className="mt-1 text-slate-500">{product.description}</p>
                    </td>
                    <td className="px-4 py-4">{product.seller.name}</td>
                    <td className="px-4 py-4">
                      {getUnits(product.dimension as Dimension).join(", ")}
                    </td>
                    <td className="px-4 py-4">
                      {Number(product.basePrice).toFixed(2)} / {product.baseUnit}
                    </td>
                    <td className="px-4 py-4">
                      {Number(product.stockQuantity).toLocaleString()} {product.baseUnit}
                    </td>
                    <td className="px-4 py-4">
                      <form action={requestQuote} className="grid w-52 gap-2">
                        <input type="hidden" name="productId" value={product.id} />
                        <div className="grid grid-cols-[1fr_80px] gap-2">
                          <input
                            required
                            min="0.0001"
                            step="0.0001"
                            type="number"
                            name="quantity"
                            placeholder="Qty"
                            className="rounded-md border border-slate-300 px-2 py-2"
                          />
                          <select
                            name="unit"
                            className="rounded-md border border-slate-300 px-2 py-2"
                          >
                            {getUnits(product.dimension as Dimension).map((unit) => (
                              <option key={unit} value={unit}>
                                {unit}
                              </option>
                            ))}
                          </select>
                        </div>
                        <button className="rounded-md bg-emerald-700 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-800">
                          Request Quote
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
      <nav className="flex items-center justify-between text-sm">
        <p className="text-slate-500">
          Page {page} of {pages}
        </p>
        <div className="flex gap-2">
          <a
            href={`?${new URLSearchParams({ ...Object.fromEntries(query), page: String(Math.max(page - 1, 1)) })}`}
            className="rounded-md border border-slate-200 bg-white px-3 py-2 font-medium text-slate-700"
          >
            Previous
          </a>
          <a
            href={`?${new URLSearchParams({ ...Object.fromEntries(query), page: String(Math.min(page + 1, pages)) })}`}
            className="rounded-md border border-slate-200 bg-white px-3 py-2 font-medium text-slate-700"
          >
            Next
          </a>
        </div>
      </nav>
    </div>
  )
}
