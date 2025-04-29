import type { ReactNode } from 'react'
import { cn } from '@/utils/helpers'

interface PProps {
  children: ReactNode
  className?: string
}
const P = ({ children, className }: PProps) => {
  return <p className={cn('mb-4 text-sm leading-relaxed font-sans', className)}>{children}</p>
}

export default P
