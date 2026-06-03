import { prisma } from "../../lib/prisma"

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: {
      buyer: true,
      items: { include: { product: { include: { seller: true } } } },
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <section className="rounded-lg border border-slate-200 bg-white">
      <div className="border-b border-slate-200 p-5">
        <h3 className="text-lg font-semibold">Orders</h3>
      </div>
      {orders.length === 0 ? (
        <div className="p-6 text-sm text-slate-500">No orders found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Buyer</th>
                <th className="px-4 py-3">Products</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="px-4 py-4">{order.buyer.name}</td>
                  <td className="px-4 py-4">
                    {order.items
                      .map((item) => `${item.product.name} (${item.product.seller.name})`)
                      .join(", ")}
                  </td>
                  <td className="px-4 py-4">{Number(order.totalAmount).toFixed(2)}</td>
                  <td className="px-4 py-4">{order.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
