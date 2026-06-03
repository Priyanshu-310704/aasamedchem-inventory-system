import Link from "next/link"
import { ReactNode } from "react"
import { Boxes, ClipboardList, Home, Package, ShoppingCart, Users } from "lucide-react"

type NavItem = {
  href: string
  label: string
  icon: "home" | "products" | "quotes" | "orders" | "users" | "inventory"
}

type DashboardShellProps = {
  role: "Admin" | "Seller" | "Buyer"
  title: string
  navItems: NavItem[]
  children: ReactNode
}

const icons = {
  home: Home,
  products: Package,
  quotes: ClipboardList,
  orders: ShoppingCart,
  users: Users,
  inventory: Boxes,
}

export function DashboardShell({ role, title, navItems, children }: DashboardShellProps) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-slate-200 bg-white lg:block">
        <div className="border-b border-slate-200 px-6 py-5">
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
            AASA MedChem
          </p>
          <h1 className="mt-1 text-xl font-semibold">{role}</h1>
        </div>
        <nav className="flex flex-col gap-1 px-3 py-4">
          {navItems.map((item) => {
            const Icon = icons[item.icon]

            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-950"
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 px-4 py-4 backdrop-blur sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-slate-500">{role} Portal</p>
              <h2 className="text-2xl font-semibold">{title}</h2>
            </div>
            <div className="rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-600">
              JWT protected
            </div>
          </div>
        </header>

        <main className="px-4 py-6 sm:px-6">{children}</main>
      </div>
    </div>
  )
}
