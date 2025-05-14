// src/components/layout/Logo/Logo.tsx

'use client'

import { useLogo } from './LogoContext'

export function Logo() {
  const { CurrentLogo, alt } = useLogo()

  return (
    <div className="relative w-full mx-auto md:mx-0 min-w-[150px] max-w-[450px] px-0 xs:px-6 sm:px-0 md:px-0 h-auto md:w-64 md:h-20">
      <CurrentLogo
        width="100%"
        height="auto"
        className="w-full h-auto fill-black-200 dark:fill-smoke-950"
        aria-label={alt}
      />
    </div>
  )
}
