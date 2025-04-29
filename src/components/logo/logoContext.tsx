'use client'
import { createContext, useContext, useEffect, useState } from 'react'

// Define the context type
type LogoContextType = {
  currentLogo: string
  alt: string
}

// Create the context
const LogoContext = createContext<LogoContextType | null>(null)

// Provider component
export const LogoProvider = ({ children }: { children: React.ReactNode }) => {
  const logos = [
    { src: '/logo/jordanLambrecht_logo_full_01.png', alt: 'Logo 1' },
    { src: '/logo/jordanLambrecht_logo_full_02.png', alt: 'Logo 2' },
    { src: '/logo/jordanLambrecht_logo_full_03.png', alt: 'Logo 3' },
    { src: '/logo/jordanLambrecht_logo_full_04.png', alt: 'Logo 4' },
    { src: '/logo/jordanLambrecht_logo_full_05.png', alt: 'Logo 5' },
    { src: '/logo/jordanLambrecht_logo_full_06.png', alt: 'Logo 6' },
    { src: '/logo/jordanLambrecht_logo_full_07.png', alt: 'Logo 7' },
    { src: '/logo/jordanLambrecht_logo_full_08.png', alt: 'Logo 8' },
    { src: '/logo/jordanLambrecht_logo_full_09.png', alt: 'Logo 9' },
    { src: '/logo/jordanLambrecht_logo_full_10.png', alt: 'Logo 10' },
    { src: '/logo/jordanLambrecht_logo_full_11.png', alt: 'Logo 11' },
    { src: '/logo/jordanLambrecht_logo_full_12.png', alt: 'Logo 12' },
    { src: '/logo/jordanLambrecht_logo_full_13.png', alt: 'Logo 13' },
    { src: '/logo/jordanLambrecht_logo_full_14.png', alt: 'Logo 14' },
    { src: '/logo/jordanLambrecht_logo_full_15.png', alt: 'Logo 15' },
    { src: '/logo/jordanLambrecht_logo_full_16.png', alt: 'Logo 16' },
  ]

  const [currentLogoIndex, setCurrentLogoIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLogoIndex((prevIndex) => (prevIndex + 1) % logos.length)
    }, 1000)

    return () => clearInterval(interval)
  }, [logos.length])

  return (
    <LogoContext.Provider
      value={{
        currentLogo: logos[currentLogoIndex].src,
        alt: logos[currentLogoIndex].alt,
      }}
    >
      {children}
    </LogoContext.Provider>
  )
}

// Custom hook for consuming the context
export const useLogo = () => {
  const context = useContext(LogoContext)

  if (!context) {
    throw new Error('useLogo must be used within a LogoProvider')
  }

  return context
}
