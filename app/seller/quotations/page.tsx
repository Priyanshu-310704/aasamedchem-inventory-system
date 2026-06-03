import { getServerSession } from "next-auth"
import { approveQuote, rejectQuote } from "./actions"
import { authOptions } from "../../lib/auth"
import { prisma } from "../../lib/prisma"

export default async function SellerQuotationsPage() {
  const session = await getServerSession(authOptions)
  const sellerId = session?.user?.id

  const quotations = sellerId
    ? await prisma.quotation.findMany({
        where: {
          items: {
            some: {
              product: { sellerId },
            },
          },
        },
        include: {
          buyer: true,
          items: {
            include: {
              product: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      })
    : []

  return (
    <section className="rounded-lg border border-slate-200 bg-white">
      <div className="border-b border-slate-200 p-5">
        <h3 className="text-lg font-semibold">Pending Quotes</h3>
      </div>
      {quotations.length === 0 ? (
        <div className="p-6 text-sm text-slate-500">No quotes yet.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Buyer</th>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Quantity</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {quotations.map((quotation) =>
                quotation.items
                  .filter((item) => item.product.sellerId === sellerId)
                  .map((item) => (
                    <tr key={item.id}>
                      <td className="px-4 py-4">{quotation.buyer.name}</td>
                      <td className="px-4 py-4">{item.product.name}</td>
                      <td className="px-4 py-4">
                        {Number(item.quantity).toLocaleString()} {item.product.baseUnit}
                      </td>
                      <td className="px-4 py-4">
                        {(Number(item.quantity) * Number(item.unitPrice)).toFixed(2)}
                      </td>
                      <td className="px-4 py-4">
                        <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold">
                          {quotation.status}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        {quotation.status === "PENDING" ? (
                          <div className="flex gap-2">
                            <form action={approveQuote}>
                              <input type="hidden" name="quotationId" value={quotation.id} />
                              <button className="rounded-md bg-emerald-700 px-3 py-2 text-sm font-semibold text-white">
                                Approve
                              </button>
                            </form>
                            <form action={rejectQuote}>
                              <input type="hidden" name="quotationId" value={quotation.id} />
                              <button className="rounded-md border border-red-200 px-3 py-2 text-sm font-semibold text-red-700">
                                Reject
                              </button>
                            </form>
                          </div>
                        ) : (
                          <span className="text-slate-500">No action</span>
                        )}
                      </td>
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
