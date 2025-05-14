import { ReactNode } from 'react'
import { cn } from '@/utils/helpers'
interface InnerWrapperProps {
  children: ReactNode
  className?: string
}
const InnerWrapper = ({ children, className }: InnerWrapperProps) => {
  return (
    <div className={cn('h-full max-w-7xl flex flex-col w-full justify-center', className)}>
      {children}
    </div>
  )
}

export default InnerWrapper
