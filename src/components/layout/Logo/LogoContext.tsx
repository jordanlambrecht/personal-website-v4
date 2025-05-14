// src/components/layout/Logo/LogoContext.tsx

'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { SVGProps } from 'react'

// Import SVG components from the components directory
import Logo01 from './logo_images/components/jordan-lambrecht-logo-full-01'
import Logo02 from './logo_images/components/jordan-lambrecht-logo-full-02'
import Logo03 from './logo_images/components/jordan-lambrecht-logo-full-03'
import Logo04 from './logo_images/components/jordan-lambrecht-logo-full-04'
import Logo05 from './logo_images/components/jordan-lambrecht-logo-full-05'
import Logo06 from './logo_images/components/jordan-lambrecht-logo-full-06'
import Logo07 from './logo_images/components/jordan-lambrecht-logo-full-07'
import Logo08 from './logo_images/components/jordan-lambrecht-logo-full-08'
import Logo09 from './logo_images/components/jordan-lambrecht-logo-full-09'
import Logo10 from './logo_images/components/jordan-lambrecht-logo-full-10'
import Logo11 from './logo_images/components/jordan-lambrecht-logo-full-11'
import Logo12 from './logo_images/components/jordan-lambrecht-logo-full-12'
import Logo13 from './logo_images/components/jordan-lambrecht-logo-full-13'
import Logo14 from './logo_images/components/jordan-lambrecht-logo-full-14'
import Logo15 from './logo_images/components/jordan-lambrecht-logo-full-15'
import Logo16 from './logo_images/components/jordan-lambrecht-logo-full-16'

// Define the LogoComponent type for SVG components
type LogoComponent = React.ComponentType<SVGProps<SVGSVGElement>>

// Update LogoContextType to use the LogoComponent type
type LogoContextType = {
  CurrentLogo: LogoComponent
  alt: string
}

// Create array of logo components with alt text
const allLogos: { Component: LogoComponent; alt: string }[] = [
  { Component: Logo01, alt: 'Jordan Lambrecht Logo 1' },
  { Component: Logo02, alt: 'Jordan Lambrecht Logo 2' },
  { Component: Logo03, alt: 'Jordan Lambrecht Logo 3' },
  { Component: Logo04, alt: 'Jordan Lambrecht Logo 4' },
  { Component: Logo05, alt: 'Jordan Lambrecht Logo 5' },
  { Component: Logo06, alt: 'Jordan Lambrecht Logo 6' },
  { Component: Logo07, alt: 'Jordan Lambrecht Logo 7' },
  { Component: Logo08, alt: 'Jordan Lambrecht Logo 8' },
  { Component: Logo09, alt: 'Jordan Lambrecht Logo 9' },
  { Component: Logo10, alt: 'Jordan Lambrecht Logo 10' },
  { Component: Logo11, alt: 'Jordan Lambrecht Logo 11' },
  { Component: Logo12, alt: 'Jordan Lambrecht Logo 12' },
  { Component: Logo13, alt: 'Jordan Lambrecht Logo 13' },
  { Component: Logo14, alt: 'Jordan Lambrecht Logo 14' },
  { Component: Logo15, alt: 'Jordan Lambrecht Logo 15' },
  { Component: Logo16, alt: 'Jordan Lambrecht Logo 16' },
]

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
    CurrentLogo: allLogos[currentLogoIndex].Component,
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
