import { getServerSession } from "next-auth"
import { createProduct, deleteProduct, updateProduct } from "./actions"
import { authOptions } from "../../lib/auth"
import { prisma } from "../../lib/prisma"

const dimensions = [
  { value: "WEIGHT", label: "Weight", unit: "g" },
  { value: "VOLUME", label: "Volume", unit: "mL" },
  { value: "COUNT", label: "Count", unit: "item" },
]

export default async function SellerProductsPage() {
  const session = await getServerSession(authOptions)
  const sellerId = session?.user?.id
  const products = sellerId
    ? await prisma.product.findMany({
        where: { sellerId },
        orderBy: { createdAt: "desc" },
      })
    : []

  return (
    <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <h3 className="text-lg font-semibold">Add Product</h3>
        <form action={createProduct} className="mt-4 grid gap-3">
          <ProductFields />
          <button className="rounded-md bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800">
            Add Product
          </button>
        </form>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white">
        <div className="border-b border-slate-200 p-5">
          <h3 className="text-lg font-semibold">Products</h3>
          <p className="mt-1 text-sm text-slate-500">Stored in base units: g, mL, item.</p>
        </div>

        {products.length === 0 ? (
          <div className="p-6 text-sm text-slate-500">No products yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">SKU</th>
                  <th className="px-4 py-3">Dimension</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Stock</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {products.map((product) => (
                  <tr key={product.id} className="align-top">
                    <td className="px-4 py-4">
                      <p className="font-medium">{product.name}</p>
                      <p className="mt-1 max-w-xs text-slate-500">{product.description}</p>
                    </td>
                    <td className="px-4 py-4">{product.sku}</td>
                    <td className="px-4 py-4">{product.dimension}</td>
                    <td className="px-4 py-4">
                      {Number(product.basePrice).toFixed(2)} / {product.baseUnit}
                    </td>
                    <td className="px-4 py-4">
                      {Number(product.stockQuantity).toLocaleString()} {product.baseUnit}
                    </td>
                    <td className="px-4 py-4">
                      <details className="w-72 rounded-md border border-slate-200 p-3">
                        <summary className="cursor-pointer font-medium">Edit</summary>
                        <form action={updateProduct} className="mt-3 grid gap-3">
                          <input type="hidden" name="productId" value={product.id} />
                          <ProductFields
                            product={{
                              name: product.name,
                              sku: product.sku,
                              description: product.description ?? "",
                              dimension: product.dimension,
                              price: Number(product.basePrice),
                              stock: Number(product.stockQuantity),
                            }}
                          />
                          <button className="rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white">
                            Save
                          </button>
                        </form>
                        <form action={deleteProduct} className="mt-3">
                          <input type="hidden" name="productId" value={product.id} />
                          <button className="rounded-md border border-red-200 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50">
                            Delete
                          </button>
                        </form>
                      </details>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}

function ProductFields({
  product,
}: {
  product?: {
    name: string
    sku: string
    description: string
    dimension: string
    price: number
    stock: number
  }
}) {
  return (
    <>
      <label className="grid gap-1 text-sm">
        <span className="font-medium text-slate-700">Name</span>
        <input
          required
          name="name"
          defaultValue={product?.name}
          className="rounded-md border border-slate-300 px-3 py-2"
        />
      </label>
      <label className="grid gap-1 text-sm">
        <span className="font-medium text-slate-700">SKU</span>
        <input
          required
          name="sku"
          defaultValue={product?.sku}
          className="rounded-md border border-slate-300 px-3 py-2"
        />
      </label>
      <label className="grid gap-1 text-sm">
        <span className="font-medium text-slate-700">Dimension</span>
        <select
          required
          name="dimension"
          defaultValue={product?.dimension ?? "WEIGHT"}
          className="rounded-md border border-slate-300 px-3 py-2"
        >
          {dimensions.map((dimension) => (
            <option key={dimension.value} value={dimension.value}>
              {dimension.label} ({dimension.unit})
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-1 text-sm">
        <span className="font-medium text-slate-700">Price per base unit</span>
        <input
          required
          min="0"
          step="0.0001"
          type="number"
          name="price"
          defaultValue={product?.price}
          className="rounded-md border border-slate-300 px-3 py-2"
        />
      </label>
      <label className="grid gap-1 text-sm">
        <span className="font-medium text-slate-700">Stock in base unit</span>
        <input
          required
          min="0"
          step="0.0001"
          type="number"
          name="stock"
          defaultValue={product?.stock}
          className="rounded-md border border-slate-300 px-3 py-2"
        />
      </label>
      <label className="grid gap-1 text-sm">
        <span className="font-medium text-slate-700">Description</span>
        <textarea
          name="description"
          defaultValue={product?.description}
          className="min-h-24 rounded-md border border-slate-300 px-3 py-2"
        />
      </label>
    </>
  )
}
