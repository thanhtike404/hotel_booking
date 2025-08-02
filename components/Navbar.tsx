'use client'

import Link from 'next/link'
import { useState } from 'react'
import { signIn, signOut, useSession } from 'next-auth/react'
import { Menu, X, UserCircle2, Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { motion, AnimatePresence } from 'framer-motion'
import { useNotifications } from '@/hooks/dashboard/useNotifications'

const navLinks = [
  { name: 'Hotels', href: '/hotels' },
  { name: 'Search Hotels', href: '/search' },
  { name: 'Contact', href: '/contact' },
  { name: 'Bookings', href: '/bookings' }
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [notificationOpen, setNotificationOpen] = useState(false)
  const { data: session } = useSession()
  const { data: notifications = [], isLoading } = useNotifications(false) ?? [];


  return (
    <nav className="fixed w-full top-0 z-50 bg-white text-black  dark:text-white dark:bg-black shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-xl dar:text font-bold">
          IDKHOTEL
        </Link>

        <div className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link key={link.name} href={link.href} className="text-gray-700 hover:text-black">
              {link.name}
            </Link>
          ))}

          {/* Notification button */}
          {session && (
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setNotificationOpen((prev) => !prev)}
                className="relative"
              >
                <Bell className="w-6 h-6" />
                {(() => {
                  const unreadCount = notifications.filter(notification => !notification.isRead).length;
                  return unreadCount > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                    >
                      {unreadCount}
                    </Badge>
                  );
                })()}
              </Button>

              <AnimatePresence>
                {notificationOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 border rounded-md shadow-lg z-50 max-h-96 overflow-y-auto"
                  >
                    <div className="p-4 border-b">
                      <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                    </div>
                    <div className="p-2">
                      {isLoading ? (
                        <p className="text-center py-4 text-gray-500">Loading notifications...</p>
                      ) : notifications.length === 0 ? (
                        <p className="text-center py-4 text-gray-500">No notifications</p>
                      ) : (
                        notifications.slice(0, 5).map(notification => (
                          <div
                            key={notification.id}
                            className={`p-3 rounded-md mb-2 ${!notification.isRead
                              ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500'
                              : 'bg-gray-50 dark:bg-gray-700/50'
                              }`}
                          >
                            <p className="text-sm text-gray-900 dark:text-white">{notification.message}</p>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {new Date(notification.createdAt).toLocaleString()}
                            </span>
                          </div>
                        ))
                      )}
                      {notifications.length > 5 && (
                        <Link
                          href="/dashboard/notifications"
                          className="block text-center py-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                          onClick={() => setNotificationOpen(false)}
                        >
                          View all notifications
                        </Link>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Profile button */}
          {session ? (
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setProfileOpen((prev) => !prev)}
              >
                <UserCircle2 className="w-6 h-6" />
              </Button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-md z-50"
                  >
                    <Link
                      href="/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setProfileOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setProfileOpen(false)}
                    >
                      Settings
                    </Link>
                    <button
                      onClick={() => {
                        signOut()
                        setProfileOpen(false)
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Sign out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Button onClick={() => signIn()}>Sign In</Button>
          )}
        </div>

        <div className="md:hidden">
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)}>
            <Menu className="w-6 h-6" />
          </Button>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-40 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              className="fixed top-0 left-0 w-64 h-full bg-white z-50 shadow-md px-6 py-4"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween' }}
            >
              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-bold">Menu</span>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                  <X className="w-6 h-6" />
                </Button>
              </div>

              <nav className="flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="text-gray-700 hover:text-black"
                  >
                    {link.name}
                  </Link>
                ))}

                {session ? (
                  <>
                    <Link
                      key="dashboard-link"
                      href="/dashboard"
                      onClick={() => setIsOpen(false)}
                      className="text-gray-700 hover:text-black"
                    >
                      Dashboard
                    </Link>
                    <Button
                      key="sign-out-button"
                      variant="ghost"
                      className="text-left px-0 text-red-600"
                      onClick={() => {
                        signOut()
                        setIsOpen(false)
                      }}
                    >
                      Sign out
                    </Button>
                  </>
                ) : (
                  <Button key="sign-in-button" onClick={() => signIn()}>Sign In</Button>
                )}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  )
}
