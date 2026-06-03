import { prisma } from "../../lib/prisma"

export default async function AdminQuotationsPage() {
  const quotations = await prisma.quotation.findMany({
    include: {
      buyer: true,
      items: { include: { product: { include: { seller: true } } } },
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <section className="rounded-lg border border-slate-200 bg-white">
      <div className="border-b border-slate-200 p-5">
        <h3 className="text-lg font-semibold">Quotations</h3>
      </div>
      {quotations.length === 0 ? (
        <div className="p-6 text-sm text-slate-500">No quotations found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Buyer</th>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Seller</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {quotations.map((quotation) =>
                quotation.items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-4">{quotation.buyer.name}</td>
                    <td className="px-4 py-4">{item.product.name}</td>
                    <td className="px-4 py-4">{item.product.seller.name}</td>
                    <td className="px-4 py-4">
                      {(Number(item.quantity) * Number(item.unitPrice)).toFixed(2)}
                    </td>
                    <td className="px-4 py-4">{quotation.status}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
