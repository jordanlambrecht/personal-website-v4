// src/components/layout/Navbar/index.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { cn } from '@/utils/helpers'
import { Logo } from './Logo'
import { siteConfig } from '@/lib/config/site'

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  const isActive = (path: string): boolean => pathname === path

  return (
    <nav className="container px-4 py-6 mx-auto ">
      <div className="flex items-center justify-between mt-12 mb-12">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link href="/" className="block">
            <Logo />
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden">
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="inline-flex items-center justify-center p-2 text-gray-700 rounded-md hover:text-amber-600 hover:bg-amber-50 focus:outline-none"
            aria-controls="mobile-menu"
            aria-expanded="false"
          >
            <span className="sr-only">{isMenuOpen ? 'Close menu' : 'Open menu'}</span>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Desktop navigation */}
        <div className="hidden md:flex md:items-center md:gap-x-8">
          {siteConfig.navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                'text-lg transition-colors hover:text-amber-600',
                isActive(item.path) ? 'font-medium text-amber-600' : 'text-gray-700',
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {siteConfig.navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={cn(
                  'block px-3 py-2 rounded-md text-base font-medium transition-colors',
                  isActive(item.path)
                    ? 'bg-amber-50 text-amber-600'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-amber-600',
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}
