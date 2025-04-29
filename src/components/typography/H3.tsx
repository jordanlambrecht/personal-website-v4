// components/ui/H3.tsx

import { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/utils/helpers'

interface H3Props extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode
  className?: string
}

const H3 = ({ children, className, ...props }: H3Props) => {
  return (
    <h3
      className={cn('font-display text-lg font-bold leading-tight mb-2 md:mb-5', className)}
      {...props}
    >
      {children}
    </h3>
  )
}

export default H3
