import Image from 'next/image'

import { useLogo } from './logoContext'

const LogoRotator = () => {
  const { currentLogo, alt } = useLogo()

  return (
    <div className="relative max-w-48 md:max-w-64 dark:invert">
      <Image
        priority
        alt={alt}
        height={125}
        src={currentLogo}
        width={450}
        className="invert-0 dark:invert object-contain"
      />
    </div>
  )
}

export default LogoRotator
