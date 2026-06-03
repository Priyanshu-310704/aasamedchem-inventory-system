import { ReactNode } from "react"
import { DashboardShell } from "../components/dashboard-shell"

const navItems = [
  { href: "/buyer", label: "Dashboard", icon: "home" },
  { href: "/buyer/products", label: "Products", icon: "products" },
  { href: "/buyer/quotations", label: "Quotations", icon: "quotes" },
  { href: "/buyer/orders", label: "Orders", icon: "orders" },
] as const

export default function BuyerLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardShell role="Buyer" title="Dashboard" navItems={[...navItems]}>
      {children}
    </DashboardShell>
  )
}
