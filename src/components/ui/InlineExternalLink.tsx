// src/components/ui/InlineExternalLink.tsx

import Link from 'next/link'
import { ArrowNorthEast } from '@/components/ui'
import type { ReactNode } from 'react'
import { cn } from '@/utils/helpers'
interface InlineExternalLinkProps {
  children?: ReactNode
  text?: string
  href: string
  target?: '_blank' | '_self' | ''
  rel?: string
  iconSize?: number
  className?: string
}
const InlineExternalLink = ({
  href,
  children,
  className,
  text,
  iconSize = 12,
  target = '_blank',
  rel = 'noopener noreferrer',
}: InlineExternalLinkProps) => {
  return (
    <Link
      href={href}
      target={target}
      rel={rel}
      className={cn(
        'flex flex-row font-sans text-sm tracking-wide gap-x-2 hover:text-primary duartion-300 ease-in-out transition-colors',
        className,
      )}
    >
      {children && children}
      {text && <span>{text}</span>}
      <ArrowNorthEast className="self-center -mb-[0.5px]" size={iconSize} />
    </Link>
  )
}

export default InlineExternalLink
