// /src/components/projects/ProjectCard.tsx
import Image from 'next/image'
import Link from 'next/link'
import { Project } from '@/types'
import { formatDate, truncateText } from '@/utils/helpers'

interface ProjectCardProps {
  project: Project
  collection: 'product-design' | 'other-projects'
}

export function ProjectCard({ project, collection }: ProjectCardProps) {
  const { id, title, description, image, link, date, tags } = project

  const imageUrl = image?.url
  const projectUrl = `/${collection}/${id}`

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-xs transition-all hover:shadow-md">
      <div className="relative h-48 w-full overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-100">
            <p className="text-gray-400">No image</p>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="mb-2 text-xl font-bold">{title}</h3>

        {description && <p className="mb-3 text-gray-600">{truncateText(description, 120)}</p>}

        {date && <p className="mb-2 text-sm text-gray-500">{formatDate(date)}</p>}

        {tags && tags.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {tags.map((tagObj, index) => (
              <span
                key={index}
                className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600"
              >
                {tagObj.tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-4 flex space-x-3">
          <Link
            href={projectUrl}
            className="inline-flex items-center rounded-sm bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            View Details
          </Link>

          {link && (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-sm border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Visit Project
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
