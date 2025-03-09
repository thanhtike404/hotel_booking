"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
// import { ModeToggle } from "./mode-toggle"

export function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="border-b">
      <div className="flex h-16 items-center px-4 max-w-7xl mx-auto">
        <div className="flex items-center space-x-4 flex-1">
          <Link href="/" className="font-bold text-xl">
            Hotel Booking
          </Link>
          <div className="flex items-center space-x-4 ml-6">
            <Link 
              href="/" 
              className={`${pathname === "/" ? "text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-300"} hover:text-blue-600 dark:hover:text-blue-400`}
            >
              Home
            </Link>
            <Link 
              href="/dashboard" 
              className={`${pathname === "/dashboard" ? "text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-300"} hover:text-blue-600 dark:hover:text-blue-400`}
            >
              Dashboard
            </Link>
            <Link 
              href="/search" 
              className={`${pathname === "/search" ? "text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-300"} hover:text-blue-600 dark:hover:text-blue-400`}
            >
              Search
            </Link>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          {/* <ModeToggle /> */}
        </div>
      </div>
    </nav>
  )
}