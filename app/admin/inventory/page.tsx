import { prisma } from "../../lib/prisma"

export default async function AdminInventoryPage() {
  const entries = await prisma.inventoryTransaction.findMany({
    include: { product: { include: { seller: true } } },
    orderBy: { createdAt: "desc" },
  })

  return (
    <section className="rounded-lg border border-slate-200 bg-white">
      <div className="border-b border-slate-200 p-5">
        <h3 className="text-lg font-semibold">Inventory</h3>
      </div>
      {entries.length === 0 ? (
        <div className="p-6 text-sm text-slate-500">No inventory entries found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Seller</th>
                <th className="px-4 py-3">Change</th>
                <th className="px-4 py-3">Reason</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {entries.map((entry) => (
                <tr key={entry.id}>
                  <td className="px-4 py-4">{entry.product.name}</td>
                  <td className="px-4 py-4">{entry.product.seller.name}</td>
                  <td className="px-4 py-4">
                    {Number(entry.change).toLocaleString()} {entry.product.baseUnit}
                  </td>
                  <td className="px-4 py-4">{entry.reason}</td>
                  <td className="px-4 py-4">{entry.createdAt.toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
