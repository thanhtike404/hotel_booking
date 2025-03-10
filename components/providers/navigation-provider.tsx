'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { LoadingSpinner } from '../ui/loading-spinner'

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const handleStart = () => setLoading(true)
    const handleStop = () => setLoading(false)

    document.addEventListener('navigationStart', handleStart)
    document.addEventListener('navigationEnd', handleStop)
    // router.events?.on('routeChangeStart', handleStart)
    // router.events?.on('routeChangeComplete', handleStop)
    // router.events?.on('routeChangeError', handleStop)

    return () => {
      document.removeEventListener('navigationStart', handleStart)
      document.removeEventListener('navigationEnd', handleStop)
      // Remove router.events since it's not available in App Router
      // Remove router.events?.off since events is not available in App Router
      // Remove router.events?.off since events is not available in App Router
    }
  }, [router])

  return (
    <>
      {loading && <LoadingSpinner />}
      {children}
    </>
  )
}