import Image from 'next/image'

import { useLogo } from './logoContext'

const LogoRotator = () => {
  const { currentLogo, alt } = useLogo() // Access the current logo and alt text from the context

  return (
    <div className="relative max-w-48 md:max-w-64">
      <Image
        priority
        alt={alt}
        height={125}
        src={currentLogo}
        style={{ objectFit: 'contain' }}
        width={450}
      />
    </div>
  )
}

export default LogoRotator
