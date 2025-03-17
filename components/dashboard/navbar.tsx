"use client"

import { Menu } from "lucide-react"
import { Button } from "../ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { signOut, useSession } from "next-auth/react"
import Link from "next/link"

interface NavbarProps {
  onMenuClick: () => void;
}

export function DashboardNavbar({ onMenuClick }: NavbarProps) {
  const { data: session } = useSession()
  return (
    <div className="fixed w-full z-50 flex h-16 items-center px-4 border-b bg-background">
      <Button variant="ghost" size="icon" onClick={onMenuClick} className="md:hidden">
        <Menu className="h-6 w-6" />
      </Button>
      <div className="flex items-center gap-x-4">
        <div className="hidden md:flex">
          <h1 className="text-xl font-bold">Hotel Admin</h1>
        </div>
      </div>
      <div className="ml-auto flex items-center space-x-4">
        <ModeToggle />
      </div>

      <div className="flex items-center gap-4">
        {session ? (
          <>
            <span className="text-sm text-muted-foreground">
              {session.user?.name}
            </span>
            <Button
              variant="ghost"
              onClick={() => signOut()}
            >
              Logout
            </Button>
          </>
        ) : (
          <>
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Register</Button>
            </Link>
          </>
        )}
      </div>
    </div>
  )
}