'use client'

import { useState, useMemo, useRef, useEffect, useTransition } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import autoAnimate from '@formkit/auto-animate'
import { Label } from '@/payload-types'
import type { UnifiedProject } from '@/app/(frontend)/page'
import { cn } from '@/utils/helpers'
import { PinIcon } from 'lucide-react'
import { fetchProjectsPage } from '@/app/actions'
import { getContrastTextColor } from '@/components/payload/accessibilityHelpers'
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
  // --- Log received props ---
  console.log(
    `ProjectGalleryClient received initialProjects length: ${initialProjects.length}, initialHasMore: ${initialHasMore}`,
  )

  const [selectedLabelId, setSelectedLabelId] = useState<number | null>(null)
  const [hoveredLabelId, setHoveredLabelId] = useState<number | null>(null)
  const [isHoveringAll, setIsHoveringAll] = useState(false)
  const parentRef = useRef<HTMLDivElement>(null)

  // --- Pagination State ---
  // Initialize directly from props
  const [displayedProjects, setDisplayedProjects] = useState<UnifiedProject[]>(initialProjects)
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(initialHasMore)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    if (parentRef.current) {
      autoAnimate(parentRef.current, { duration: 250 })
    }
  }, [parentRef])

  // --- handleLabelSelect function (Correct: Fetches page 1 filtered, replaces displayedProjects) ---
  const handleLabelSelect = (labelId: number | null) => {
    setSelectedLabelId(labelId)
    setCurrentPage(1)
    setHasMore(false) // Reset immediately
    startTransition(async () => {
      try {
        const newData = await fetchProjectsPage(1, pageSize, labelId)
        setDisplayedProjects(newData.projects) // REPLACE displayedProjects
        setHasMore(newData.hasNextPage)
      } catch (error) {
        console.error('Failed to fetch filtered projects:', error)
        setDisplayedProjects([])
        setHasMore(false)
      }
    })
  }

  // --- loadMoreProjects function (Correct: Fetches next page filtered, appends to displayedProjects) ---
  const loadMoreProjects = () => {
    const nextPage = currentPage + 1
    console.log(`loadMoreProjects: Fetching page ${nextPage} with filter ${selectedLabelId}`)
    startTransition(async () => {
      try {
        const newData = await fetchProjectsPage(nextPage, pageSize, selectedLabelId)
        console.log(
          `loadMoreProjects: Received ${newData.projects.length} projects, hasNextPage: ${newData.hasNextPage}`,
        )
        setDisplayedProjects((prevProjects) => {
          console.log(
            `loadMoreProjects: Appending ${newData.projects.length} projects to previous ${prevProjects.length}`,
          )
          return [...prevProjects, ...newData.projects]
        })
        setCurrentPage(nextPage)
        // --- Explicitly log before and after setting hasMore ---
        console.log(
          `loadMoreProjects: Current hasMore state: ${hasMore}. Setting hasMore to: ${newData.hasNextPage}`,
        )
        setHasMore(newData.hasNextPage)
        // --- Log after setting (Note: state updates are async, this might show old value) ---
        // console.log(`loadMoreProjects: hasMore state *should* be updated now.`);
      } catch (error) {
        console.error('Failed to load more projects:', error)
        // Consider setting hasMore to false on error too
        setHasMore(false)
      }
    })
  }

  // --- Re-introduce filteredProjects memo for display ---
  const filteredProjects = useMemo(() => {
    // This memo now correctly filters the projects fetched by the server
    // based on the currently selected UI filter.
    if (selectedLabelId === null) {
      return displayedProjects // Show all loaded projects if "All" is selected
    }
    // Filter the currently loaded projects based on the selected label ID
    return displayedProjects.filter((project) => project.label?.id === selectedLabelId)
  }, [displayedProjects, selectedLabelId])

  return (
    <div className="w-full">
      {/* Filter Buttons */}
      {/* --- Remove items-end, use items-center or default --- */}
      <div className="flex flex-wrap items-center max-w-3xl gap-x-3 gap-y-4 mb-6 min-h-[50px]">
        {' '}
        {/* Changed items-end to items-center */}
        {/* "All" Button */}
        <button
          onClick={() => handleLabelSelect(null)}
          // --- Add hover handlers for "All" ---
          onMouseEnter={() => setIsHoveringAll(true)}
          onMouseLeave={() => setIsHoveringAll(false)}
          aria-pressed={selectedLabelId === null}
          title="All Projects"
          className={cn(
            ' border-black relative rounded-lg transition-all duration-300 border-2 flex-shrink-0 w-20 overflow-hidden', // Base styles match label buttons
            'focus:outline-none focus:ring-2 focus:ring-offset-4',
            // --- Conditional Height ---
            isHoveringAll ? 'h-6' : 'h-4',
            // --- Conditional Negative Margin & Z-index ---
            isHoveringAll ? '-mt-3 z-10' : 'z-0',
            // --- Conditional Ring/Border ---
            selectedLabelId === null
              ? 'ring-2 ring-offset-4  ring-black' // Selected state
              : '',
            // --- Background ---
            'bg-transparent', // Default white background
          )}
          // --- Remove inline style for background/border ---
          // style={{ ... }}
        >
          {/* Absolutely Positioned Text for "All" */}
          <span
            className={cn(
              'absolute inset-0 flex items-center justify-center text-xs font-medium transition-opacity duration-300 pointer-events-none',
              // --- Show text on hover ---
              isHoveringAll ? 'opacity-100' : 'opacity-0',
              // --- Standard text color ---
              'text-black', // Adjust color as needed
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
                'relative rounded-lg transition-all duration-300 flex-shrink-0 w-40 overflow-hidden',
                'focus:outline-none focus:ring-2 focus:ring-offset-4',
                // --- Conditional Height ---
                isHovered ? 'h-6' : 'h-3',
                // --- Conditional Negative Margin & Z-index ---
                isHovered ? '-mt-3 z-10' : 'z-0', // Pull up by h-3 (12px), raise z-index
                // --- Conditional Ring/Border ---
                isSelected
                  ? 'ring-2 ring-offset-4 border-transparent ring-black'
                  : 'border-gray-300',
              )}
              style={{
                backgroundColor: label.bgColor || '#e5e7eb',
                borderColor: isSelected ? label.bgColor || '#e5e7eb' : undefined,
              }}
            >
              {/* Absolutely Positioned Text */}
              <span
                className={cn(
                  'absolute inset-0 flex items-center justify-center text-xs font-medium transition-opacity duration-300 pointer-events-none',
                  isHovered ? 'opacity-100' : 'opacity-0',
                )}
                style={{
                  color: label.textColor || '#1f2937',
                }}
              >
                {label.name}
              </span>
              <span className="sr-only">{label.name}</span>
            </button>
          )
        })}
      </div>

      {/* Project Grid - maps directly over displayedProjects */}
      <div
        ref={parentRef}
        // --- Add a minimum height ---
        // Adjust the value (e.g., 200px, 300px, or based on card height) as needed
        className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-5 min-h-[300px]"
      >
        {/* --- Map over filteredProjects --- */}
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project, index) => {
            // Determine sliver/background color - use label's bgColor, fallback to a default
            const cardColor = project.label?.bgColor || '#6b7280' // Default gray
            // Determine text color for overlay - use label's textColor, fallback
            const textColor = project.label?.textColor || '#ffffff' // Default white for contrast

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
                  style={{ backgroundColor: cardColor }} // Apply dynamic background color
                />

                {/* --- Link still covers the card --- */}
                <Link
                  href={`/${project.collectionSlug}/${project.id}`}
                  className="absolute inset-0 z-10"
                  aria-label={`View ${project.title}`}
                />

                {/* --- Pinned Icon --- */}
                {project.pinned && (
                  <div className="absolute right-2 top-2 z-20 rounded bg-background/80 p-1.5 text-foreground backdrop-blur-sm">
                    <PinIcon className="w-4 h-4" />
                  </div>
                )}

                {/* --- Content Area (Image or Title Overlay) --- */}
                <div className="relative w-full aspect-[4/3] md:aspect-square overflow-hidden">
                  {/* Check for valid image object */}
                  {typeof project.image === 'object' &&
                  project.image !== null &&
                  project.image.url ? (
                    // --- Render Image ---
                    <Image
                      src={project.image.url}
                      alt={project.image.alt || project.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    // --- Render Title Overlay on Colored Background ---
                    <div
                      className="flex items-center justify-center w-full h-full p-4 transition-opacity duration-300 bg-opacity-100 hover:bg-opacity-50 bg-blue" // Padding for text
                      style={{ backgroundColor: cardColor }} // Use label color for background
                    >
                      <h3
                        className="text-lg font-semibold text-center" // Center text, adjust size/weight
                        style={{ color: textColor }} // Use label text color
                      >
                        {project.title}
                      </h3>
                    </div>
                  )}
                </div>
              </div>
            )
          })
        ) : (
          <p className="mt-8 text-center text-gray-500 col-span-full">
            {/* Check if a filter is active when showing the message */}
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
              'disabled:opacity-50 disabled:cursor-not-allowed', // Disabled styles
            )}
          >
            {isPending ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  )
}
