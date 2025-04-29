// /src/components/layout/Navbar/Logo.tsx
'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

// Define logo array with hardcoded paths instead of reading from filesystem
const logoCount = 16
const logos = Array.from({ length: logoCount }, (_, i) => ({
  src: `/logo/jordanLambrecht_logo_full_${String(i + 1).padStart(2, '0')}.png`,
  alt: `Jordan Lambrecht Logo ${i + 1}`
}))

export function Logo() {
  const [currentLogoIndex, setCurrentLogoIndex] = useState(0)

  useEffect(() => {
    // Rotate logo every second
    const interval = setInterval(() => {
      setCurrentLogoIndex((prevIndex) => (prevIndex + 1) % logos.length)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative w-48 h-16 md:w-64 md:h-20">
      <Image
        src={logos[currentLogoIndex].src}
        alt={logos[currentLogoIndex].alt}
        fill
        priority
        sizes="(max-width: 768px) 12rem, 16rem"
        style={{ objectFit: 'contain' }}
      />
    </div>
  )
}
