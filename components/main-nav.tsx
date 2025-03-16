'use client'
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { Button } from "./ui/button"

export function MainNav() {
  const { data: session } = useSession()

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        <div className="flex gap-6">
          <Link href="/" className="font-semibold">
            Hotel Booking
          </Link>
          <Link href="/hotels" className="text-muted-foreground">
            Hotels
          </Link>
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
    </nav>
  )
}