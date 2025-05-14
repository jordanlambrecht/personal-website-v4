// src/app/(frontend)/layout.tsx

import type { Metadata } from 'next'
import { ReactNode } from 'react'

import './globals.css'

import { fontFunnelSans, fontFunnelDisplay, fontQuasimoda, fontMono, fontFields } from '@/lib/fonts'
import { PlausibleAnalytics } from '@/components/analytics/Plausible'
import { getPayload } from 'payload'
import config from '@payload-config'
import { SiteSetting } from '@/payload-types'
import { InnerWrapper, Footer, Navbar, LogoProvider } from '@/components/layout'

export const metadata: Metadata = {
  title: 'Jordan Lambrecht - Designer & Developer',
  description:
    'Personal website of Jordan Lambrecht, founder of Pixel Bakery and creator of various projects',
  icons: {
    icon: '/favicon.ico',
  },
}

export interface NavItem {
  href: string
  label: string
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  const payload = await getPayload({ config })

  const siteSettings = (await payload.findGlobal({
    slug: 'siteSettings',
    depth: 0,
  })) as SiteSetting

  const allPossibleNavItems: (NavItem & { setting?: keyof SiteSetting })[] = [
    { href: '/pixel-bakery', label: 'Pixel Bakery', setting: 'showPixelBakery' },
    { href: '/product-design', label: 'Product Design', setting: 'showProductDesigns' },
    { href: '/other-projects', label: 'Other Projects', setting: 'showOtherProjects' },
    { href: '/lists', label: 'Lists', setting: 'showLists' },
  ]

  const navItems: NavItem[] = allPossibleNavItems
    .filter((item) => {
      // If a setting key is defined for the item, check its value in siteSettings
      // Otherwise, always include the item
      if (item.setting) {
        return siteSettings[item.setting]
      }
      return true
    })
    .map(({ href, label }) => ({ href, label }))
  return (
    <html
      lang="en"
      className={`${fontFunnelSans.variable} ${fontQuasimoda.variable} ${fontFunnelDisplay.variable} ${fontFields.variable} ${fontMono.variable} antialiased`}
      suppressHydrationWarning // Good for theme toggling
    >
      <head>
        <PlausibleAnalytics />
      </head>
      {/* Apply themed background and text color to the body */}
      <body className="transition-colors duration-300 bg-[var(--color-background)] text-[var(--color-foreground)] px-4">
        <div className="flex flex-col min-h-screen md:max-w-7xl mx-auto">
          <LogoProvider>
            <Navbar navItems={navItems} />
          </LogoProvider>
          <main className=" flex flex-col justify-start w-full grow md:pt-12 ">
            <InnerWrapper> {children}</InnerWrapper>
          </main>
        </div>
        <Footer />
      </body>
    </html>
  )
}
