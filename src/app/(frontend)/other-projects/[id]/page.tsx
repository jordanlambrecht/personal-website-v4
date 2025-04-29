// /src/app/(frontend)/other-projects/[id]/page.tsx
import Image from 'next/image'
import Link from 'next/link'
import { getPayload } from 'payload'
import { Tag } from 'lucide-react'
import { formatDate } from '@/utils/helpers'
import config from '@/payload.config'
import { Gallery } from './page.client'
import { LinkIcon } from '@/components/ui/icons'
import { RichText } from '@payloadcms/richtext-lexical/react'

export default async function OtherProjectDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params
  const { id } = params
  const payload = await getPayload({
    config,
  })

  const project = await payload
    .findByID({
      collection: 'other-projects',
      id,
      depth: 1, // Load media references
    })
    .catch(() => null)

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center w-full text-center gap-y-4">
        <h1 className="text-4xl font-black">Project Not Found 😓</h1>
        <div>
          <Link
            href="/other-projects"
            className="inline-flex items-center px-4 py-2 text-white rounded-md bg-amber-500 hover:bg-amber-600"
            aria-label="Go Back"
          >
            ⟵ Back to all projects
          </Link>
        </div>
      </div>
    )
  }

  const image = project.image && typeof project.image !== 'number' ? project.image : null

  // Handle extra images for gallery - now using hasMany format
  const extraImages =
    project.extraImages && Array.isArray(project.extraImages)
      ? (project.extraImages
          .map((img) => {
            if (typeof img === 'object' && img !== null && 'url' in img) {
              return { url: img.url, alt: img.alt || project.title || 'Project image' }
            }
            return null
          })
          .filter(Boolean) as { url: string; alt: string }[])
      : []

  const heroImage =
    image && image.url
      ? { url: image.url, alt: image.alt || project.title || 'Project image' }
      : null

  // Function to determine the label
  const getProjectTypeLabel = (type: string) => {
    switch (type) {
      case 'github':
        return 'GitHub Repository'
      case 'woodworking':
        return 'Woodworking Project'
      case 'pottery':
        return 'Pottery Project'
      default:
        return 'Other Project'
    }
  }

  return (
    <article className="flex flex-col gap-y-3 md:gap-y-6">
      <div className="w-full">
        <h1 className="text-3xl font-bold text-left">{project.title}</h1>
      </div>

      <div className="flex flex-col w-full md:flex-row md:gap-x-8">
        {/* CONTENT */}
        <div className="w-full md:w-3/5">
          {image && image.url ? (
            <div className="mb-4 overflow-hidden rounded aspect-4/3">
              <Image
                src={image.url}
                alt={project.title}
                width={800}
                height={600}
                className="object-cover w-full h-full"
              />
            </div>
          ) : (
            <div className="flex items-center justify-center bg-gray-100 rounded h-96">
              <p className="text-gray-400">No image available</p>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN */}
        <div className="flex flex-col justify-between w-full h-auto text-left md:w-2/5 md:gap-y-6">
          <div className="mb-4">
            {project.projectType && (
              <div className="mb-4">
                <span className="px-3 py-1 text-sm text-blue-800 bg-blue-100 rounded-full">
                  {getProjectTypeLabel(project.projectType)}
                </span>
              </div>
            )}

            {/* Show Rich Text if available, otherwise fallback to description */}
            {project.details ? (
              <div className="mb-4 prose">
                <RichText data={project.details} />
              </div>
            ) : project.description ? (
              <p className="text-gray-700 whitespace-pre-line">{project.description}</p>
            ) : null}

            {project.dateCompleted && (
              <p className="mt-4 text-gray-600">Completed on {formatDate(project.dateCompleted)}</p>
            )}

            {project.tags && project.tags.length > 0 && (
              <div className="mt-4">
                <h2 className="mb-2 text-xl font-semibold">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tagObj, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 text-sm text-gray-800 bg-gray-100 rounded-full"
                    >
                      <Tag size={14} className="mr-1" />
                      {tagObj.tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="my-4">
            {project.projectLink && (
              <div className="mb-4">
                <a
                  href={project.projectLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 text-white rounded-md bg-amber-500 hover:bg-amber-600 gap-x-2"
                  aria-label="View Project"
                >
                  View Project
                  <LinkIcon width={20} height={20} />
                </a>
              </div>
            )}

            <div className="mt-4">
              <Link
                href="/other-projects"
                className="inline-flex items-center text-amber-600 hover:text-amber-700"
              >
                ← Back to all projects
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Extra written content section */}
      {project.enableWrittenContent && project.extraRichTextContent && (
        <div className="mt-8 prose max-w-none">
          <RichText data={project.extraRichTextContent} />
        </div>
      )}

      {/* Gallery/Lightbox section */}
      {extraImages.length > 0 && project.enableExtraImages && (
        <Gallery images={extraImages} heroImage={heroImage} />
      )}
    </article>
  )
}
