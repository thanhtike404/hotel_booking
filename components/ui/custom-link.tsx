'use client'

import Link from 'next/link'
import { ComponentProps } from 'react'

export function CustomLink({ href, ...props }: ComponentProps<typeof Link>) {
  const handleClick = () => {
    document.dispatchEvent(new Event('navigationStart'))
    setTimeout(() => {
      document.dispatchEvent(new Event('navigationEnd'))
    }, 1000)
  }

  return <Link href={href} onClick={handleClick} {...props} />
}