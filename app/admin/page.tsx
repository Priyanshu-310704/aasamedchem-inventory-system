export default function AdminDashboardPage() {
  return (
    <section className="grid gap-4 md:grid-cols-3">
      {["Users", "Products", "Quotations"].map((label) => (
        <div key={label} className="rounded-lg border border-slate-200 bg-white p-5">
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-semibold">0</p>
        </div>
      ))}
    </section>
  )
}
