// src/components/ui/PageHeading.tsx

import { cn } from '@/utils/helpers'
import { H1, P } from '@typography'
interface PageHeadingProps {
  title: string
  description?: string
  className?: string
  children?: React.ReactNode
}

export function PageHeading({ title, description, className, children }: PageHeadingProps) {
  return (
    <div className={cn('mb-24', className)}>
      <H1>{title}</H1>
      {description && <P>{description}</P>}
      {children}
    </div>
  )
}
