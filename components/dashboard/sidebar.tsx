"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  Hotel, 
  Users, 
  Settings, 
  Calendar,
  CreditCard,
  Building
} from "lucide-react"

const routes = [
  {
    label: 'Overview',
    icon: LayoutDashboard,
    href: '/overview',
  },
  {
    label: 'Hotels',
    icon: Hotel,
    href: '/dashboard/hotels',
  },
  {
    label: 'Bookings',
    icon: Calendar,
    href: '/bookings',
  },
  {
    label: 'Guests',
    icon: Users,
    href: '/guests',
  },
  {
    label: 'Services',
    icon: Building,
    href: '/services',
  },
  {
    label: 'Payments',
    icon: CreditCard,
    href: '/payments',
  },
  {
    label: 'Settings',
    icon: Settings,
    href: '/settings',
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="h-full flex flex-col bg-background p-4">
      <div className="flex flex-col flex-1 gap-y-4">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={`
              flex items-center gap-x-2 text-sm font-medium p-3
              hover:bg-accent hover:text-accent-foreground rounded-lg
              transition-colors
              ${pathname === route.href ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'}
            `}
          >
            <route.icon className="h-5 w-5" />
            {route.label}
          </Link>
        ))}
      </div>
    </div>
  )
}