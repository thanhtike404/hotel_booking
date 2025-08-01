"use client"

import { Menu } from "lucide-react"
import { Bell } from "lucide-react"
import { Button } from "../ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Badge } from "@/components/ui/badge"
import { signOut, useSession } from "next-auth/react"
import Link from "next/link"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { useNotifications } from "@/hooks/dashboard/useNotifications"
import { useEffect, useState } from "react"

interface NavbarProps {
  onMenuClick: () => void;
}

export function DashboardNavbar({ onMenuClick }: NavbarProps) {
  const { data: session } = useSession()
  const [mounted, setMounted] = useState(false)
  
  // Prevent hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true)
  }, [])

 

  // Only fetch notifications if user is authenticated
  const { data: notifications = [], isLoading } = useNotifications(
    session?.user?.id || undefined
  );
  console.log("Notifications:", notifications);

  // Calculate unread count safely
  const unreadCount = notifications?.filter(notification => !notification.isRead)?.length || 0;

  if (!mounted) {
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
          {/* Placeholder for theme toggle to prevent layout shift */}
          <div className="w-10 h-10"></div>
          
          {/* User session info */}
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
      </div>
    )
  }

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
        {/* Only show notifications if user is logged in */}
        {session && (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-6 w-6" />
                {unreadCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-xs"
                  >
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4">
              <div className="space-y-2">
                <h3 className="font-medium text-sm">Notifications</h3>
                {isLoading ? (
                  <div className="flex items-center justify-center py-4">
                    <p className="text-sm text-muted-foreground">Loading notifications...</p>
                  </div>
                ) : notifications?.length === 0 ? (
                  <div className="flex items-center justify-center py-4">
                    <p className="text-sm text-muted-foreground">No notifications</p>
                  </div>
                ) : (
                  <div className="max-h-64 overflow-y-auto space-y-2">
                    {notifications?.map((notification, index) => (
                      <div 
                        key={notification.id || `notification-${index}`} 
                        className={`p-2 rounded-md border ${
                          !notification.isRead ? 'bg-muted/50' : 'bg-background'
                        }`}
                      >
                        <p className="text-sm">{notification.message}</p>
                        <span className="text-xs text-muted-foreground">
                          {new Date(notification.createdAt).toLocaleString()}
                        </span>
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-1"></div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                
                <Link href="/dashboard/notifications" className="block">
                  <Button variant="link" className="w-full mt-2 p-0 h-auto">
                    View all notifications
                  </Button>
                </Link>
              </div>
            </PopoverContent>
          </Popover>
        )}
        
        <ModeToggle />
        
        {/* User session info */}
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
    </div>
  )
}