import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "next-themes"
import { MainNav } from "@/components/nav"
import AuthProvider from "@/components/providers/session-provider"
import { headers } from 'next/headers'
import { NavigationProvider } from "@/components/providers/navigation-provider"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <NavigationProvider>
          {children}
        </NavigationProvider>
      </body>
    </html>
  )
}
