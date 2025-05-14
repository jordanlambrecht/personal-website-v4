// src/components/layout/Logo/Logo.tsx

'use client'

import Image from 'next/image'
import { useLogo } from './LogoContext'

export function Logo() {
  const { currentLogo, alt } = useLogo()

  return (
    <div className="relative w-48 h-16 md:w-64 md:h-20 invert-0 dark:invert">
      <Image
        src={currentLogo}
        alt={alt}
        priority
        sizes="(max-width: 768px) 12rem, 16rem"
        className="object-contain"
      />
    </div>
  )
}
