// components/ui/H1.tsx

import { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/utils/helpers'

interface H1Props extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode
  className?: string
}

const H1 = ({ children, className, ...props }: H1Props) => {
  return (
    <h1
      className={cn('font-display text-4xl font-bold leading-tight mb-2 md:mb-4', className)}
      {...props}
    >
      {children}
    </h1>
  )
}

export default H1
