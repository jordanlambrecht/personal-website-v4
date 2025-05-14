'use client'

import { useState, useEffect } from 'react'
import { Sun, Moon } from 'lucide-react'

export function ThemeToggle() {
  const [isMounted, setIsMounted] = useState(false)
  const [theme, setTheme] = useState(() => {
    // Initialize theme based on localStorage or system preference
    if (typeof window !== 'undefined') {
      const storedTheme = localStorage.getItem('theme')
      if (storedTheme) {
        return storedTheme
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return 'light'
  })

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (isMounted) {
      // Apply .dark class and save preference
      if (theme === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
      localStorage.setItem('theme', theme)
    }
  }, [theme, isMounted])

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  if (!isMounted) {
    // Render a placeholder to prevent layout shift and match button size
    return <div className="w-10 h-10 rounded-full " />
  }

  return (
    <button
      onClick={toggleTheme}
      className={`
        cursor-pointer relative flex items-center justify-center 
        w-8 h-8 rounded-full 
        transition-colors duration-300 ease-in-out 
        focus:outline-none 

        bg-smoke-300 hover:bg-smoke-800 dark:bg-orange

      `}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {/* Sun Icon */}
      <Sun
        size={22}
        className={`
          absolute text-lime dark:text-lime
          transition-all duration-300 ease-in-out
          ${theme === 'light' ? 'opacity-100 transform scale-100 rotate-0' : 'opacity-0 transform scale-50 -rotate-90'}
        `}
      />
      {/* Moon Icon */}
      <Moon
        size={20}
        className={`
          absolute text-black-500 dark:text-black-600
          transition-all duration-300 ease-in-out
          ${theme === 'dark' ? 'opacity-100 transform scale-100 rotate-0' : 'opacity-0 transform scale-50 rotate-90'}
        `}
      />
    </button>
  )
}
