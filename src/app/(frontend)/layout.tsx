// src/app/(frontend)/layout.tsx

import type { Metadata } from 'next'
import { ReactNode } from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import './globals.css'
import { fontFunnelSans, fontFunnelDisplay, fontQuasimoda, fontMono, fontFields } from '@/lib/fonts'
import { PlausibleAnalytics } from '@/components/analytics/Plausible'

export const metadata: Metadata = {
  title: 'Jordan Lambrecht - Designer & Developer',
  description:
    'Personal website of Jordan Lambrecht, founder of Pixel Bakery and creator of various projects',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${fontFunnelSans.variable} ${fontQuasimoda.variable} ${fontFunnelDisplay.variable} ${fontFields.variable} ${fontMono.variable} antialiased`}
    >
      <head>
        <PlausibleAnalytics />
      </head>
      <body className="bg-primary">
        <div className="flex flex-col min-h-screen ">
          <Navbar />

          <main className="container flex flex-col justify-start w-full grow md:pt-16 max-w-7xl">
            {children}
          </main>
        </div>
        <Footer />
      </body>
    </html>
  )
}
