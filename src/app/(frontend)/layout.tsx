// src/app/(frontend)/layout.tsx

import type { Metadata } from 'next'
import { ReactNode } from 'react'
import PlausibleProvider from 'next-plausible'
import './globals.css'

import { fontFunnelSans, fontFunnelDisplay, fontMono, fontFields } from '@/lib/fonts'

import { getPayload } from 'payload'
import config from '@payload-config'
import { SiteSetting } from '@/payload-types'
import { InnerWrapper, Footer, Navbar, LogoProvider } from '@/components/layout'

export const metadata: Metadata = {
  title: 'Jordan Lambrecht - Creative Leader, Designer, Strategist',
  description: 'Hi, I&apos;m Jordan. Let&apos;s be friends.',
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
      // If a setting key is defined for the item, check its value in siteSettings. Otherwise, always include the item
      if (item.setting) {
        return siteSettings[item.setting]
      }
      return true
    })
    .map(({ href, label }) => ({ href, label }))

  const themeScript = `
    (function() {
      const theme = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (theme === 'dark' || (!theme && prefersDark)) {
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.removeAttribute('data-theme');
      }
    })();
    `

  return (
    <PlausibleProvider
      domain="jordanlambrecht.com"
      trackOutboundLinks
      trackLocalhost={process.env.NODE_ENV !== 'production'}
      selfHosted
      taggedEvents
      trackFileDownloads
      customDomain="https://analytics.jordy.world"
      enabled
    >
      <html
        lang="en"
        className={`${fontFunnelSans.variable} ${fontFunnelDisplay.variable} ${fontFields.variable} ${fontMono.variable} antialiased`}
        suppressHydrationWarning //For darkmode toggling
      >
        <head>
          <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        </head>
        <body className="transition-colors duration-300 bg-[var(--color-background)] text-[var(--color-foreground)] px-6 sm:px-10 md:px-12 lg:px-12">
          <div className="flex flex-col min-h-screen md:max-w-5xl lg:max-w-7xl mx-auto">
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
    </PlausibleProvider>
  )
}
