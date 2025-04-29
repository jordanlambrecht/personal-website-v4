// /src/app/(frontend)/other-projects/page.tsx
import { getPayload } from 'payload'
import { PageHeading } from '@/components/ui/PageHeading'
import config from '@/payload.config'
import Image from 'next/image'

export default async function OtherProjectsPage() {
  const payload = await getPayload({
    config,
  })

  const otherProjects = await payload.find({
    collection: 'other-projects',
    limit: 100,
    sort: '-dateCompleted',
    depth: 1, // Load media references
  })

  return (
    <div>
      <PageHeading
        title="Other Projects"
        description="A collection of various projects including GitHub repositories, woodworking, pottery, and more."
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {otherProjects.docs.map((project, index) => (
          <div
            key={project.id}
            className={`group relative overflow-hidden rounded-lg ${
              index === 0 ? 'md:col-span-2 md:row-span-2 h-96' : 'h-64'
            }`}
          >
            <div className="relative w-full h-full">
              {project.image && typeof project.image !== 'number' && project.image.url ? (
                <Image
                  src={project.image.url}
                  alt={project.title}
                  width={800}
                  height={600}
                  className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full bg-gray-100">
                  <span className="text-gray-400">No image</span>
                </div>
              )}

              <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-t from-black/70 to-transparent group-hover:opacity-100">
                <div className="absolute bottom-0 left-0 p-4 text-white">
                  <h3 className="mb-1 text-lg font-bold">{project.title}</h3>
                  {project.projectType && (
                    <span className="inline-block px-2 py-1 mb-2 text-xs text-white rounded-full bg-amber-500">
                      {project.projectType}
                    </span>
                  )}
                  {project.dateCompleted && (
                    <p className="text-sm text-gray-200">
                      {new Date(project.dateCompleted).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <a
              href={`/other-projects/${project.id}`}
              className="absolute inset-0 z-10"
              aria-label={`View ${project.title}`}
            ></a>
          </div>
        ))}
      </div>
    </div>
  )
}
