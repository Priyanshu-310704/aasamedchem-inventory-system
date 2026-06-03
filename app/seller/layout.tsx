import { ReactNode } from "react"
import { DashboardShell } from "../components/dashboard-shell"

const navItems = [
  { href: "/seller", label: "Dashboard", icon: "home" },
  { href: "/seller/products", label: "Products", icon: "products" },
  { href: "/seller/quotations", label: "Quotations", icon: "quotes" },
  { href: "/seller/orders", label: "Orders", icon: "orders" },
  { href: "/seller/inventory", label: "Inventory", icon: "inventory" },
] as const

export default function SellerLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardShell role="Seller" title="Dashboard" navItems={[...navItems]}>
      {children}
    </DashboardShell>
  )
}
