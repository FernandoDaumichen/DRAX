import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import React from 'react'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Drax',
  description: 'Music for the soul',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      {/* <meta http-equiv="Permissions-Policy" content="accelerometer=(), gyroscope=()"></meta> */}
      <body className={inter.className}>{children}</body>
    </html>
  )
}
