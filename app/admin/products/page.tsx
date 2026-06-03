import { prisma } from "../../lib/prisma"

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: { seller: true },
    orderBy: { createdAt: "desc" },
  })

  return (
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
                <th className="px-4 py-3">Dimension</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="px-4 py-4">{product.name}</td>
                  <td className="px-4 py-4">{product.seller.name}</td>
                  <td className="px-4 py-4">{product.dimension}</td>
                  <td className="px-4 py-4">
                    {Number(product.basePrice).toFixed(2)} / {product.baseUnit}
                  </td>
                  <td className="px-4 py-4">
                    {Number(product.stockQuantity).toLocaleString()} {product.baseUnit}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
