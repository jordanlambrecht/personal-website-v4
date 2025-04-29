// src/components/ui/PageHeading.tsx

import { cn } from '@/utils/helpers'
import { H1 } from '@typography'
interface PageHeadingProps {
  title: string
  description?: string
  className?: string
}

export function PageHeading({ title, description, className }: PageHeadingProps) {
  return (
    <div className={cn('mb-8', className)}>
      <H1 className="w-full mb-2 text-4xl font-bold">{title}</H1>
      {description && <p className="text-xl text-gray-700">{description}</p>}
    </div>
  )
}
