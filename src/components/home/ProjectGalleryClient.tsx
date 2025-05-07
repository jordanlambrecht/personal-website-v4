'use client'

import { useState, useMemo, useRef, useEffect, useTransition } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import autoAnimate from '@formkit/auto-animate'
import { Label } from '@/payload-types'
import type { UnifiedProject } from '@/app/(frontend)/page'
import { cn } from '@/utils/helpers'
import { PinIcon, StarIcon } from 'lucide-react'
import { fetchProjectsPage } from '@/app/actions'
import { getContrastTextColor } from '@/components/payload/accessibilityHelpers'
import { H3 } from '@typography'
interface ProjectGalleryClientProps {
  initialProjects: UnifiedProject[]
  availableLabels: Label[]
  initialHasMore: boolean
  pageSize: number
}

export function ProjectGalleryClient({
  initialProjects,
  availableLabels,
  initialHasMore,
  pageSize,
}: ProjectGalleryClientProps) {
  // console.log(
  //   `ProjectGalleryClient received initialProjects length: ${initialProjects.length}, initialHasMore: ${initialHasMore}`,
  // )

  const [selectedLabelId, setSelectedLabelId] = useState<number | null>(null)
  const [hoveredLabelId, setHoveredLabelId] = useState<number | null>(null)
  const [isHoveringAll, setIsHoveringAll] = useState(false)
  const parentRef = useRef<HTMLDivElement>(null)

  const [displayedProjects, setDisplayedProjects] = useState<UnifiedProject[]>(initialProjects)
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(initialHasMore)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    if (parentRef.current) {
      autoAnimate(parentRef.current, { duration: 250 })
    }
  }, [parentRef])

  const handleLabelSelect = (labelId: number | null) => {
    const scrollY = window.scrollY

    setSelectedLabelId(labelId)
    setCurrentPage(1)
    setHasMore(false)
    startTransition(async () => {
      try {
        const newData = await fetchProjectsPage(1, pageSize, labelId)
        setDisplayedProjects(newData.projects) // REPLACE displayedProjects
        setHasMore(newData.hasNextPage)

        requestAnimationFrame(() => {
          window.scrollTo(0, scrollY)
        })
      } catch (error) {
        console.error('Failed to fetch filtered projects:', error)
        setDisplayedProjects([])
        setHasMore(false)
        // Sroll to top on error
        requestAnimationFrame(() => {
          window.scrollTo(0, 0)
        })
      }
    })
  }

  const loadMoreProjects = () => {
    const nextPage = currentPage + 1
    console.log(`loadMoreProjects: Fetching page ${nextPage} with filter ${selectedLabelId}`)
    startTransition(async () => {
      try {
        const newData = await fetchProjectsPage(nextPage, pageSize, selectedLabelId)
        // console.log(
        //   `loadMoreProjects: Received ${newData.projects.length} projects, hasNextPage: ${newData.hasNextPage}`,
        // )
        setDisplayedProjects((prevProjects) => {
          console.log(
            `loadMoreProjects: Appending ${newData.projects.length} projects to previous ${prevProjects.length}`,
          )
          return [...prevProjects, ...newData.projects]
        })
        setCurrentPage(nextPage)

        // console.log(
        //   `loadMoreProjects: Current hasMore state: ${hasMore}. Setting hasMore to: ${newData.hasNextPage}`,
        // )
        setHasMore(newData.hasNextPage)
        // console.log(`loadMoreProjects: hasMore state *should* be updated now.`);
      } catch (error) {
        console.error('Failed to load more projects:', error)
        setHasMore(false)
      }
    })
  }

  const filteredProjects = useMemo(() => {
    if (selectedLabelId === null) {
      return displayedProjects // Show all loaded projects if "All" is selected
    }
    // Filter the currently loaded projects based on the selected label ID
    return displayedProjects.filter((project) => project.label?.id === selectedLabelId)
  }, [displayedProjects, selectedLabelId])

  return (
    <div className="w-full">
      {/* Filter Buttons */}
      <div className="flex flex-wrap items-center max-w-3xl gap-x-3 gap-y-4 mb-6 min-h-[50px]">
        {/* "All" Button */}
        <button
          onClick={() => handleLabelSelect(null)}
          onMouseEnter={() => setIsHoveringAll(true)}
          onMouseLeave={() => setIsHoveringAll(false)}
          aria-pressed={selectedLabelId === null}
          title="All Projects"
          className={cn(
            ' cursor-pointer border-black relative rounded-lg transition-all duration-300 border-2 shrink-0 w-20 overflow-hidden',
            'focus:outline-hidden focus:ring-2 focus:ring-offset-4',
            isHoveringAll ? 'h-6' : 'h-4',
            isHoveringAll ? '-mt-3 z-10' : 'z-0',
            selectedLabelId === null ? 'ring-2 ring-offset-4  ring-black' : '',
            'bg-transparent',
          )}
        >
          <span
            className={cn(
              'absolute inset-0 flex items-center justify-center text-xs font-medium transition-opacity duration-300 pointer-events-none',
              isHoveringAll ? 'opacity-100' : 'opacity-0',
              'text-black',
            )}
          >
            All
          </span>
          <span className="sr-only">All Projects</span>
        </button>
        {/* Label Filter Buttons */}
        {availableLabels.map((label) => {
          const isHovered = hoveredLabelId === label.id
          const isSelected = selectedLabelId === label.id
          const buttonBgColor = label.bgColor || '#e5e7eb'

          return (
            <button
              key={label.id}
              onClick={() => handleLabelSelect(label.id)}
              onMouseEnter={() => {
                setHoveredLabelId(label.id)
                setIsHoveringAll(false) // Ensure "All" isn't hovered
              }}
              onMouseLeave={() => setHoveredLabelId(null)}
              aria-pressed={isSelected}
              title={label.name}
              className={cn(
                'cursor-pointer relative rounded-lg transition-all duration-300 shrink-0 w-40 overflow-hidden',
                'focus:outline-hidden focus:ring-2 focus:ring-offset-4',
                isHovered ? 'h-6' : 'h-3',
                isHovered ? '-mt-3 z-10' : 'z-0',
                isSelected
                  ? 'ring-2 ring-offset-4 border-transparent ring-black'
                  : 'border-gray-300',
              )}
              style={{
                backgroundColor: buttonBgColor,
                borderColor: isSelected ? buttonBgColor : undefined,
              }}
            >
              <span
                className={cn(
                  'absolute inset-0 flex items-center justify-center text-xs font-medium transition-opacity duration-300 pointer-events-none',
                  isHovered ? 'opacity-100' : 'opacity-0',
                )}
                style={{
                  color: getContrastTextColor(buttonBgColor),
                }}
              >
                {label.name}
              </span>
              <span className="sr-only">{label.name}</span>
            </button>
          )
        })}
      </div>

      {/* Project Grid Area */}
      <div
        ref={parentRef}
        className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-5 min-h-[300px]"
      >
        {isPending && filteredProjects.length === 0 ? (
          <p className="mt-8 text-center text-gray-500 col-span-full">Loading projects...</p>
        ) : filteredProjects.length > 0 ? (
          filteredProjects.map((project) => {
            const cardColor = project.label?.bgColor || '#6b7280'
            const textColor = project.label?.textColor || '#ffffff'

            return (
              // --- Main Card Container ---
              <div
                key={`${project.collectionSlug}-${project.id}`}
                className={cn(
                  'group relative overflow-hidden rounded-lg bg-white ', // Base styles
                )}
              >
                {/* --- Colored Sliver Div --- */}
                <div
                  className="absolute top-0 left-0 right-0 z-50 h-1 "
                  style={{ backgroundColor: cardColor }}
                />
                <Link
                  href={`/${project.collectionSlug}/${project.id}`}
                  className="absolute inset-0 z-10"
                  aria-label={`View ${project.title}`}
                />

                {/* --- Icons Container --- */}
                {(project.pinned || project.favorited) && (
                  <div className="absolute right-2 top-2 z-20 flex items-center gap-1 rounded-sm bg-background/80 p-1.5 text-foreground backdrop-blur-xs">
                    {/* Pinned Icon */}
                    {project.pinned && <PinIcon className="w-4 h-4" />}
                    {/* Favorited Icon */}
                    {project.favorited && <StarIcon className="w-4 h-4 text-yellow-500" />}
                  </div>
                )}

                {/* --- Content Area (Image or Title Overlay) --- */}
                <div className="relative w-full overflow-hidden aspect-4/3 md:aspect-square">
                  {typeof project.image === 'object' &&
                  project.image !== null &&
                  project.image.url ? (
                    <Image
                      src={project.image.url}
                      alt={project.image.alt || project.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div
                      className="flex items-center justify-center w-full h-full p-4 transition-opacity duration-300 bg-opacity-100 hover:bg-opacity-50 bg-blue"
                      style={{ backgroundColor: cardColor }}
                    >
                      <H3 style={{ color: textColor }}>{project.title}</H3>
                    </div>
                  )}
                </div>
              </div>
            )
          })
        ) : (
          // --- Show "No Projects Found" only if NOT pending and length is 0 ---
          <p className="mt-8 text-center text-gray-500 col-span-full">
            {selectedLabelId !== null
              ? 'No projects found for the selected label.'
              : 'No projects found.'}
          </p>
        )}
      </div>

      {/* --- Load More Button --- */}
      {hasMore && (
        <div className="flex justify-center mt-8">
          <button
            onClick={loadMoreProjects}
            disabled={isPending} // Disable while loading
            className={cn(
              'px-6 py-2 rounded-md text-sm font-medium transition-colors duration-200',
              'bg-gray-800 text-white hover:bg-gray-700',
              'disabled:opacity-50 disabled:cursor-not-allowed',
            )}
          >
            {isPending ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  )
}
