'use client'

import { useState, useEffect } from 'react'
import { Sun, Moon } from 'lucide-react'
import { usePlausible } from 'next-plausible'

export function ThemeToggle() {
  const plausible = usePlausible()
  const [isMounted, setIsMounted] = useState(false)
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const storedTheme = localStorage.getItem('theme')
      if (storedTheme) {
        return storedTheme
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return 'light' // Default theme before client-side check
  })

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (isMounted) {
      // Only set data-theme for dark mode, remove it for light mode
      if (theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark')
      } else {
        document.documentElement.removeAttribute('data-theme')
      }
      // Persist the theme choice in localStorage
      localStorage.setItem('theme', theme)

      // Track the theme after it changes or on initial load
      plausible('Theme', {
        props: {
          theme: theme,
          action: 'active', // This distinguishes from initial theme
        },
      })
    }
  }, [theme, isMounted, plausible])

  // Track initial theme preference separately (only once)
  useEffect(() => {
    if (isMounted) {
      plausible('Theme', {
        props: {
          theme: theme,
          action: 'initial',
          prefersDark:
            typeof window !== 'undefined'
              ? window.matchMedia('(prefers-color-scheme: dark)').matches
              : false,
        },
      })
    }
  }, [isMounted, plausible, theme])

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
    // No need to track here as the above useEffect will fire after state changes
  }

  if (!isMounted) {
    // Render a placeholder to prevent layout shift and match button size
    return <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full" />
  }

  return (
    <button
      onClick={toggleTheme}
      className="
        cursor-pointer relative flex items-center justify-center 
        w-6 h-6 sm:w-8 sm:h-8
        rounded-full transition-colors duration-300 ease-in-out 
        focus:outline-none 
        bg-smoke-300 hover:bg-smoke-800 
      "
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {/* Sun Icon - Mobile */}
      <Sun
        size={16}
        className={`
          block sm:hidden
          absolute text-lime dark:text-lime
          transition-all duration-300 ease-in-out
          ${theme === 'light' ? 'opacity-100 transform scale-100 rotate-0' : 'opacity-0 transform scale-50 -rotate-90'}
        `}
      />
      {/* Sun Icon - Desktop */}
      <Sun
        size={22}
        className={`
          hidden sm:block
          absolute text-lime dark:text-lime
          transition-all duration-300 ease-in-out
          ${theme === 'light' ? 'opacity-100 transform scale-100 rotate-0' : 'opacity-0 transform scale-50 -rotate-90'}
        `}
      />
      {/* Moon Icon - Mobile*/}
      <Moon
        size={16}
        className={`
          block sm:hidden 
          absolute text-black-500 dark:text-black-600
          transition-all duration-300 ease-in-out
          ${theme === 'dark' ? 'opacity-100 transform scale-100 rotate-0' : 'opacity-0 transform scale-50 rotate-90'}
        `}
      />
      {/* Moon Icon - Desktop */}
      <Moon
        size={20}
        className={`
          hidden sm:block 
          absolute text-black-500 dark:text-black-600
          transition-all duration-300 ease-in-out
          ${theme === 'dark' ? 'opacity-100 transform scale-100 rotate-0' : 'opacity-0 transform scale-50 rotate-90'}
        `}
      />
    </button>
  )
}
