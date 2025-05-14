// src/components/layout/Logo/LogoContext.tsx

'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { type StaticImageData } from 'next/image'
import * as LogoImages from './logo_images'

type LogoContextType = {
  currentLogo: StaticImageData
  alt: string
}

// --- Logic to prepare allLogos ---
const logoKeys = Object.keys(LogoImages)
  .filter((key) => key.startsWith('logo_')) // Ensure we only get logo keys
  .sort((a, b) => {
    // Sort them numerically
    const numA = parseInt(a.split('_')[1], 10)
    const numB = parseInt(b.split('_')[1], 10)
    return numA - numB
  })

const allLogos: { image: StaticImageData; alt: string }[] = logoKeys.map((key, index) => {
  const imageModule = (LogoImages as Record<string, StaticImageData>)[key]
  return {
    image: imageModule,
    alt: `Jordan Lambrecht Logo ${index + 1}`,
  }
})
// --- End of allLogos logic ---

const LogoContext = createContext<LogoContextType | null>(null)

export const LogoProvider = ({ children }: { children: ReactNode }) => {
  const [currentLogoIndex, setCurrentLogoIndex] = useState(0)

  useEffect(() => {
    if (allLogos.length === 0) return // Guard against empty logos array

    const interval = setInterval(() => {
      setCurrentLogoIndex((prevIndex) => (prevIndex + 1) % allLogos.length)
    }, 1000)

    return () => clearInterval(interval)
  }, []) // Empty dependency array as allLogos is stable after initial load

  if (allLogos.length === 0) {
    // Handle the case where no logos are loaded
    return <>{children}</>
  }

  const contextValue: LogoContextType = {
    currentLogo: allLogos[currentLogoIndex].image,
    alt: allLogos[currentLogoIndex].alt,
  }

  return <LogoContext.Provider value={contextValue}>{children}</LogoContext.Provider>
}

// Custom hook for consuming the context
export const useLogo = (): LogoContextType => {
  const context = useContext(LogoContext)

  if (!context) {
    throw new Error('useLogo must be used within a LogoProvider')
  }

  return context
}
