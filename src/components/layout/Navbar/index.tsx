// src/components/layout/Navbar/index.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { cn } from '@/utils/helpers'
import { ThemeToggle, Logo } from '@/components/layout'
import { motion, AnimatePresence } from 'framer-motion'
import { usePlausible } from 'next-plausible'

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
  const plausible = usePlausible()

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

  const topControlsBarHeight = '56px'

  // Track menu toggle
  const toggleMenu = () => {
    const newState = !isMenuOpen
    setIsMenuOpen(newState)

    plausible('Menu', {
      props: {
        menuAction: newState ? 'open' : 'close',
      },
    })
  }

  // Track nav item clicks
  const handleNavClick = (label: string) => {
    plausible('Navigation', {
      props: {
        destination: label,
        isMobile: window.innerWidth < 768, // Track if mobile or desktop navigation
      },
    })
    setIsMenuOpen(false)
  }

  return (
    <nav className="w-full py-6 mx-auto">
      <div className="flex flex-col md:flex-row items-center justify-between md:mt-12 mb-12">
        {/* Mobile Navigation Area */}
        <div className="relative w-full md:hidden mb-16">
          {' '}
          {/* Mobile Top Controls: Theme Toggle & Menu Button */}
          <div
            className="flex flex-row justify-end items-center px-4"
            style={{ height: topControlsBarHeight, position: 'relative', zIndex: 20 }}
          >
            <ThemeToggle />
            <button
              type="button"
              onClick={toggleMenu}
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
          {/* Container for Logo and Menu Panel */}
          <motion.div
            layout
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
                  className="w-auto py-4"
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
                  <div className="transition-all duration-300 ease-in px-2 py-1 space-y-1 sm:px-3 bg-background">
                    {/* Mobile Menu Items */}
                    {navItems.map((item) => (
                      <div
                        className="leading-none dark:bg-black  hover:text-orange dark:hover:text-lime z-50"
                        key={item.href}
                      >
                        <Link
                          href={item.href}
                          className={cn(
                            'block leading-none px-3 py-1 rounded-md  font-medium transition-colors duration-300 ease-in  sm:text-center dark:hover:border-2  dark:border-lime',
                            isActive(item.href) ? 'text-primary dark:bg-lime dark:text-black' : '',
                          )}
                          onClick={() => handleNavClick(item.label)}
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
        <div className="transition-all duration-300 hidden md:flex md:items-center md:gap-x-8 md:order-last leading-none hover:text-primary">
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
