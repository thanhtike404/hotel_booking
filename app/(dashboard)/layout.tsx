"use client"

import { useState } from "react"
import { DashboardNavbar } from "@/components/dashboard/navbar"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Toaster } from "@/components/ui/toaster"
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  return (
    <div>
      <DashboardNavbar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
      <Toaster />
      <div className="flex pt-16 h-screen">
        <div className={`
          fixed inset-y-0 pt-16 
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 transition-transform duration-300 
          w-72 bg-background border-r
        `}>
          <Sidebar />
        </div>
        <main className={`
          flex-1 h-full overflow-y-auto
          ${isSidebarOpen ? 'md:pl-72' : 'pl-0'}
          transition-[padding] duration-300
        `}>
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}