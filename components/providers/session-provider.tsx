"use client"

import { SessionProvider } from "next-auth/react"
import { WebSocketProvider } from "@/providers/webSocketProvider"
export default function AuthProvider({ children }: { children: React.ReactNode }) {
  return <SessionProvider>
    <WebSocketProvider>
      {children}
    </WebSocketProvider>
  </SessionProvider>
}