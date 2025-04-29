// /src/app/(frontend)/other-projects/loading.tsx
import { PageHeading } from '@/components/ui/PageHeading'

export default function Loading() {
  return (
    <div>
      <PageHeading 
        title="Other Projects" 
        description="A collection of various projects including GitHub repositories, woodworking, pottery, and more."
      />
      
      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-4">
        {[...Array(8)].map((_, index) => (
          <div 
            key={index}
            className={`animate-pulse rounded-lg bg-gray-200 ${
              index === 0 ? 'md:col-span-2 md:row-span-2 h-96' : 'h-64'
            }`}
          ></div>
        ))}
      </div>
    </div>
  )
}
