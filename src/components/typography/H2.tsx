// components/ui/H2.tsx

import { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/utils/helpers'

interface H2Props extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode
  className?: string
}

const H2 = ({ children, className, ...props }: H2Props) => {
  return (
    <h2
      className={cn('font-display text-2xl font-bold leading-tight mb-4 md:mb-5', className)}
      {...props}
    >
      {children}
    </h2>
  )
}

export default H2
