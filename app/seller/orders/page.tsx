import { getServerSession } from "next-auth"
import { updateOrderStatus } from "./actions"
import { OrderStatus } from '@prisma/client'
import { authOptions } from "../../lib/auth"
import { prisma } from "../../lib/prisma"

export default async function SellerOrdersPage() {
  const session = await getServerSession(authOptions)
  const sellerId = session?.user?.id

  const orders = sellerId
    ? await prisma.order.findMany({
        where: {
          items: { some: { product: { sellerId } } },
        },
        include: {
          buyer: true,
          items: { include: { product: true } },
        },
        orderBy: { createdAt: "desc" },
      })
    : []

  return (
    <section className="rounded-lg border border-slate-200 bg-white">
      <div className="border-b border-slate-200 p-5">
        <h3 className="text-lg font-semibold">Orders</h3>
      </div>
      {orders.length === 0 ? (
        <div className="p-6 text-sm text-slate-500">No orders yet.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Buyer</th>
                <th className="px-4 py-3">Items</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="px-4 py-4">{order.buyer.name}</td>
                  <td className="px-4 py-4">
                    {order.items
                      .filter((item) => item.product.sellerId === sellerId)
                      .map((item) => `${item.product.name} (${Number(item.quantity)} ${item.product.baseUnit})`)
                      .join(", ")}
                  </td>
                  <td className="px-4 py-4">{Number(order.totalAmount).toFixed(2)}</td>
                  <td className="px-4 py-4">
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold">
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <form action={updateOrderStatus} className="flex gap-2">
                      <input type="hidden" name="orderId" value={order.id} />
                      <select
                        name="status"
                        defaultValue={order.status}
                        className="rounded-md border border-slate-300 px-2 py-2"
                      >
                        {Object.values(OrderStatus).map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                      <button className="rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white">
                        Save
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
  )
}
