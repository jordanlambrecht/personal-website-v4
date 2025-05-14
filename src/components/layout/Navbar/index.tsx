// src/components/layout/Navbar/index.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { cn } from '@/utils/helpers'
import { Logo } from './Logo'
import { ThemeToggle } from '@components/layout/ThemeToggle'
interface NavItem {
  href: string
  label: string
}

interface NavbarProps {
  navItems: NavItem[]
}

export function Navbar({ navItems }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  const isActive = (path: string): boolean => pathname === path

  return (
    <nav className="container px-4 py-6 mx-auto ">
      <div className="flex items-center justify-between mt-12 mb-12">
        {/* Logo */}
        <div className="shrink-0">
          <Link href="/" className="block">
            <Logo />
          </Link>
        </div>

        {/* Desktop navigation & Theme Toggle */}
        <div className="hidden md:flex md:items-center md:gap-x-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'text-lg transition-colors hover:text-[var(--color-primary)]',
                isActive(item.href)
                  ? 'font-medium text-[var(--color-primary)]'
                  : 'text-[var(--color-foreground)]',
              )}
            >
              {item.label}
            </Link>
          ))}
          <ThemeToggle /> {/* Add the toggle here */}
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden">
          {/* Theme toggle on mobile menu */}
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="inline-flex items-center justify-center p-2 rounded-md cursor-pointer text-foreground hover:text-primary hover:bg-accent focus:outline-hidden"
            aria-controls="mobile-menu"
            aria-expanded="false"
          >
            <span className="sr-only">{isMenuOpen ? 'Close menu' : 'Open menu'}</span>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'block px-3 py-2 rounded-md text-base font-medium transition-colors text-[var(--color-foreground)] hover:bg-[var(--color-bg-subtle)] hover:text-[var(--color-primary)]',
                  isActive(item.href)
                    ? 'bg-[var(--color-bg-subtle)] text-[var(--color-primary)]'
                    : '',
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
