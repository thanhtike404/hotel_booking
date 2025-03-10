import Link from "next/link"
import { Button } from "@/components/ui/button"
import { HomeIcon } from "lucide-react"

export function MainNav() {
  return (
    <div className="border-b">
      <div className="container flex h-16 items-center px-4">
        <Link href="/">
          <Button variant="ghost" className="flex items-center gap-2">
            <HomeIcon className="h-5 w-5" />
            <span className="font-bold">Hotel Booking</span>
          </Button>
        </Link>
        <nav className="flex items-center space-x-6 ml-6">
          <Link href="/hotels" className="text-sm font-medium transition-colors hover:text-primary">
            Hotels
          </Link>
          <Link href="/dashboard" className="text-sm font-medium transition-colors hover:text-primary">
            Dashboard
          </Link>
        </nav>
      </div>
    </div>
  )
}