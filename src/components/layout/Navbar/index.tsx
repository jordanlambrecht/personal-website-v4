// src/components/layout/Navbar/index.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { cn } from '@/utils/helpers'
import { ThemeToggle, Logo } from '@/components/layout'
import { motion, AnimatePresence } from 'framer-motion'

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
    // Close menu on route change
    setIsMenuOpen(false)
  }, [pathname])

  const isActive = (path: string): boolean => pathname === path

  // Animation variants
  const iconVariants = {
    opened: { rotate: 45, scale: 1 },
    closed: { rotate: 0, scale: 1 },
    exit: { rotate: -45, scale: 0.8, opacity: 0 },
  }

  const xIconVariants = {
    opened: { rotate: 0, scale: 1, opacity: 1 },
    closed: { rotate: -45, scale: 0.8, opacity: 0 },
  }

  const logoAnimation = {
    visible: { opacity: 1, y: '0%', transition: { duration: 0.3, ease: 'easeIn' } },
    slideDownAndFade: { opacity: 0, y: '50%', transition: { duration: 0.3, ease: 'easeOut' } },
  }

  const menuPanelAnimation = {
    hidden: { opacity: 0, y: '-50%', transition: { duration: 0.3, ease: 'easeOut' } },
    visible: { opacity: 1, y: '0%', transition: { duration: 0.3, ease: 'easeIn' } },
  }

  // Height of the static top controls bar (ThemeToggle and Menu button)
  // Adjust this based on the actual height of that bar.
  const topControlsBarHeight = '56px' // Example: h-10 (40px) + py-2 (8px*2=16px) = 56px

  return (
    <nav className="w-full py-6 mx-auto">
      <div className="flex flex-col md:flex-row items-center justify-between md:mt-12 mb-12">
        {/* Mobile Navigation Area */}
        <div className="relative w-full md:hidden mb-16">
          {' '}
          {/* Reduced mb from 16 to 4 as panel is absolute */}
          {/* Mobile Top Controls: Theme Toggle & Menu Button */}
          <div
            className="flex flex-row justify-end items-center px-4"
            style={{ height: topControlsBarHeight, position: 'relative', zIndex: 20 }} // zIndex to keep controls on top
          >
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="relative inline-flex items-center justify-center w-10 h-10 rounded-md cursor-pointer text-foreground hover:text-primary focus:outline-none"
              aria-controls="mobile-menu-panel"
              aria-expanded={isMenuOpen}
            >
              <span className="sr-only">{isMenuOpen ? 'Close menu' : 'Open menu'}</span>
              <AnimatePresence initial={false} mode="wait">
                {!isMenuOpen ? (
                  <motion.div
                    key="menu-icon"
                    variants={iconVariants}
                    initial="closed"
                    animate="closed"
                    exit="exit"
                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                  >
                    <Menu size={28} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="x-icon"
                    variants={xIconVariants}
                    initial="closed"
                    animate="opened"
                    exit="closed"
                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                  >
                    <X size={28} />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
          {/* Animated Container for Logo and Menu Panel (Absolutely Positioned) */}
          <motion.div
            layout // Animates its own height and position if needed
            className="absolute w-full flex justify-center items-center overflow-hidden"
            style={{
              top: topControlsBarHeight,
              left: 0,
              right: 0,
              zIndex: 10,
            }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <AnimatePresence initial={false} mode="wait">
              {!isMenuOpen ? (
                <motion.div
                  key="logo-display-area"
                  className="w-auto py-4" // Added some padding for logo visual spacing if needed
                  variants={logoAnimation}
                  initial="slideDownAndFade"
                  animate="visible"
                  exit="slideDownAndFade"
                >
                  <Link href="/" className="block" aria-label="Navigate to homepage">
                    <Logo />
                  </Link>
                </motion.div>
              ) : (
                <motion.div
                  key="menu-panel-area"
                  className="w-full bg-subtle"
                  id="mobile-menu"
                  variants={menuPanelAnimation}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                >
                  <div className="px-2 py-1 space-y-1 sm:px-3 bg-background">
                    {/* Mobile Menu Items */}
                    {navItems.map((item) => (
                      <div
                        className="leading-none dark:bg-black hover:bg-lime hover:text-lime z-50"
                        key={item.href}
                      >
                        <Link
                          href={item.href}
                          className={cn(
                            'block leading-none px-3 py-1 rounded-md  font-medium transition-colors duration-300 ease-in text-ghost sm:text-center',
                            isActive(item.href) ? 'text-primary dark:bg-lime dark:text-black' : '',
                          )}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {item.label}
                        </Link>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:block shrink-0 md:order-first">
          <Link href="/" className="block" aria-label="Navigate to homepage">
            <Logo />
          </Link>
        </div>
        <div className="hidden md:flex md:items-center md:gap-x-8 md:order-last leading-none hover:text-primar">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'leading-none font-sans text-lg transition-colors hover:text-primary ',
                isActive(item.href)
                  ? 'font-medium text-orange dark:text-lime'
                  : 'text-[var(--color-foreground)]',
              )}
            >
              {item.label}
            </Link>
          ))}
          <ThemeToggle />
        </div>
      </div>
    </nav>
  )
}
