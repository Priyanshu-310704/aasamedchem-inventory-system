import { ReactNode } from "react"
import { DashboardShell } from "../components/dashboard-shell"

const navItems = [
  { href: "/admin", label: "Dashboard", icon: "home" },
  { href: "/admin/users", label: "Users", icon: "users" },
  { href: "/admin/sellers", label: "Sellers", icon: "users" },
  { href: "/admin/products", label: "Products", icon: "products" },
  { href: "/admin/quotations", label: "Quotations", icon: "quotes" },
  { href: "/admin/orders", label: "Orders", icon: "orders" },
  { href: "/admin/inventory", label: "Inventory", icon: "inventory" },
] as const

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardShell role="Admin" title="Dashboard" navItems={[...navItems]}>
      {children}
    </DashboardShell>
  )
}
