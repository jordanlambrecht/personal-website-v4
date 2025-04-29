// /src/components/projects/ProjectsGrid.tsx
import { Project } from '@/types'
import { ProjectCard } from './ProjectCard'

interface ProjectsGridProps {
  projects: Project[]
  collection: 'product-designs' | 'other-projects'
}

export function ProjectsGrid({ projects, collection }: ProjectsGridProps) {
  if (!projects || projects.length === 0) {
    return (
      <div className="mt-8 text-center">
        <p className="text-lg text-gray-600">No projects found.</p>
      </div>
    )
  }

  return (
    <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} collection={collection} />
      ))}
    </div>
  )
}
