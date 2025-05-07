// /src/components/projects/ProjectsGallery.tsx
import Link from 'next/link'
import Image from 'next/image'
import { formatDate } from '@/utils/helpers'
import { Project } from '@/types'

type ProjectCardProps = {
  project: Project
  collection: 'product-design' | 'other-projects'
  size?: 'small' | 'medium' | 'large'
  date?: Date | string | undefined
  dateCompleted?: Date | string | undefined
}

function ProjectCard({ project, collection, size = 'medium' }: ProjectCardProps) {
  const { id, title, image, date } = project

  const baseUrl = `/${collection}/${id}`

  const sizeClasses = {
    small: 'h-48',
    medium: 'h-64',
    large: 'h-96 col-span-2 row-span-2',
  }

  return (
    <Link
      href={baseUrl}
      className={`group relative block overflow-hidden rounded-lg bg-gray-100 ${sizeClasses[size]}`}
    >
      {image?.url ? (
        <Image
          src={image.url}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      ) : (
        <div className="flex items-center justify-center h-full bg-gray-200">
          <p className="text-gray-500">No image available</p>
        </div>
      )}

      <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-linear-to-t from-black/70 to-transparent group-hover:opacity-100">
        <div className="absolute bottom-0 left-0 p-4 text-white">
          <h3 className="mb-1 text-lg font-bold">{title}</h3>
          {date && <p className="text-sm text-gray-200">{formatDate(date)}</p>}
        </div>
      </div>
    </Link>
  )
}

type ProjectsGalleryProps = {
  projects: Project[]
  collection: 'product-design' | 'other-projects'
  showHeading?: boolean
  headingLink?: string
}

export function ProjectsGallery({
  projects,
  collection,
  showHeading = true,
  headingLink,
}: ProjectsGalleryProps) {
  if (!projects || projects.length === 0) {
    return (
      <div className="mt-8 text-center">
        <p className="text-lg text-gray-600">No projects found.</p>
      </div>
    )
  }

  const collectionTitle = collection === 'product-design' ? 'Product Designs' : 'Other Projects'

  return (
    <div className="mb-12">
      {showHeading && (
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">{collectionTitle}</h2>
          {headingLink && (
            <Link href={headingLink} className="text-amber-600 hover:text-amber-700">
              View all →
            </Link>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {projects.slice(0, 8).map((project, index) => (
          <ProjectCard
            key={project.id}
            project={project}
            collection={collection}
            size={index === 0 ? 'large' : index % 5 === 0 ? 'medium' : 'small'}
          />
        ))}
      </div>
    </div>
  )
}
