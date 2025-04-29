// src/components/ui/PageHeading.tsx

import Link from 'next/link'
import { ReactNode } from 'react'

interface PhotoLinkProps {
  imagePath: string
  caption: string
  children: ReactNode
  className?: string
}

/**
 * Renders a Next.js Link that opens an image in a modal-like view (`/photos/[slug]`).
 * Passes the image path and caption via the URL.
 * @param {PhotoLinkProps} props - The component props.
 * @returns {JSX.Element} The rendered link component.
 */
const PhotoLink = ({ imagePath, caption, children, className }: PhotoLinkProps) => {
  const encodedCaption = encodeURIComponent(caption)
  const href = `/photos/${imagePath}?caption=${encodedCaption}`

  return (
    <Link href={href} scroll={false} className={className}>
      {children}
    </Link>
  )
}

export default PhotoLink
