import { prisma } from "../../lib/prisma"

export default async function AdminSellersPage() {
  const sellers = await prisma.user.findMany({
    where: { role: "SELLER" },
    include: {
      products: true,
    },
    orderBy: { name: "asc" },
  })

  return (
    <section className="rounded-lg border border-slate-200 bg-white">
      <div className="border-b border-slate-200 p-5">
        <h3 className="text-lg font-semibold">Manage Sellers</h3>
      </div>
      {sellers.length === 0 ? (
        <div className="p-6 text-sm text-slate-500">No sellers found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Seller</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Products</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {sellers.map((seller) => (
                <tr key={seller.id}>
                  <td className="px-4 py-4">{seller.name}</td>
                  <td className="px-4 py-4">{seller.email}</td>
                  <td className="px-4 py-4">{seller.products.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
