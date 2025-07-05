"use client"

import { Menu } from "lucide-react"
import { Bell } from "lucide-react"
import { Button } from "../ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Badge } from "@/components/ui/badge"
import { signOut, useSession } from "next-auth/react"
import Link from "next/link";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useNotifications } from "@/hooks/dashboard/useNotifications"

interface NavbarProps {
  onMenuClick: () => void;
}

export function DashboardNavbar({ onMenuClick }: NavbarProps) {

  const { data: notifications = [], isLoading } = useNotifications();
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
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-6 w-6" />
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-xs"
              >
                {notifications.filter(notification => !notification.isRead).length}
              </Badge>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4">
            <h4 className="font-semibold mb-2">Notifications</h4>
            <p className="text-sm text-muted-foreground">You have 3 unread notifications.</p>
            <Link href="/dashboard/notifications">
              <Button variant="link" className="mt-2 p-0 h-auto">View all notifications</Button>
            </Link>
          </PopoverContent>
        </Popover>
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