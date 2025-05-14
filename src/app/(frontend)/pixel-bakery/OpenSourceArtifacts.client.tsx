'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import Link from 'next/link'
import {
  OpenSourceDocument,
  PbArtifactCategory,
  PbArtifactTag,
  Media as MediaType,
} from '@/payload-types'
import { ArrowEast, DownloadIcon, SearchIcon } from '@/components/ui/icons' // Assuming SearchIcon exists
import autoAnimate from '@formkit/auto-animate'
import { cn } from '@/utils/helpers'

const getFileExtension = (media?: MediaType | string | null): string => {
  if (typeof media === 'object' && media?.filename) {
    return media.filename.split('.').pop()?.toUpperCase() || 'FILE'
  }
  return 'FILE'
}

export function OpenSourceArtifactsClient({
  initialArtifacts,
  allCategories,
  allTags,
}: {
  initialArtifacts: OpenSourceDocument[]
  allCategories: PbArtifactCategory[]
  allTags: PbArtifactTag[]
}) {
  const [sortConfig, setSortConfig] = useState<{
    key: 'title' | 'category'
    direction: 'asc' | 'desc'
  }>({
    key: 'title',
    direction: 'asc',
  })
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([])
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([])
  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const parentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (parentRef.current) {
      autoAnimate(parentRef.current)
    }
  }, [parentRef])

  const activeTagIdsInContent = useMemo(() => {
    const tagIds = new Set<string>()
    initialArtifacts.forEach((artifact) => {
      if (Array.isArray(artifact['pb-artifact-tag'])) {
        artifact['pb-artifact-tag'].forEach((tag) => {
          if (typeof tag === 'object' && tag !== null && 'id' in tag) {
            tagIds.add(tag.id)
          } else if (typeof tag === 'string') {
            tagIds.add(tag)
          }
        })
      }
    })
    return tagIds
  }, [initialArtifacts])

  const displayableTags = useMemo(() => {
    return allTags.filter((tag) => activeTagIdsInContent.has(tag.id))
  }, [allTags, activeTagIdsInContent])

  const filteredAndSortedArtifacts = useMemo(() => {
    let filtered = [...initialArtifacts]

    if (searchTerm.trim() !== '') {
      const lowerSearchTerm = searchTerm.toLowerCase()
      filtered = filtered.filter((artifact) => {
        const titleMatch = artifact.title?.toLowerCase().includes(lowerSearchTerm)
        const category = artifact['pb-artifact-category']
        const categoryName =
          typeof category === 'object' && category !== null && 'name' in category
            ? category.name
            : ''
        const categoryMatch = categoryName.toLowerCase().includes(lowerSearchTerm)

        const tags = artifact['pb-artifact-tag']
        const tagMatch =
          Array.isArray(tags) &&
          tags.some((tag) => {
            const tagName = typeof tag === 'object' && tag !== null && 'name' in tag ? tag.name : ''
            return tagName.toLowerCase().includes(lowerSearchTerm)
          })
        const shortDescriptionMatch = artifact.shortDescription
          ?.toLowerCase()
          .includes(lowerSearchTerm)

        return titleMatch || categoryMatch || tagMatch || shortDescriptionMatch
      })
    }

    if (selectedCategoryIds.length > 0) {
      filtered = filtered.filter((artifact) => {
        const category = artifact['pb-artifact-category']
        if (typeof category === 'object' && category !== null && 'id' in category) {
          return selectedCategoryIds.includes(category.id)
        }
        return false
      })
    }

    if (selectedTagIds.length > 0) {
      filtered = filtered.filter((artifact) => {
        const tags = artifact['pb-artifact-tag']
        if (Array.isArray(tags)) {
          return tags.some((tag) => {
            const tagId =
              typeof tag === 'object' && tag !== null && 'id' in tag
                ? tag.id
                : typeof tag === 'string'
                  ? tag
                  : null
            return tagId ? selectedTagIds.includes(tagId) : false
          })
        }
        return false
      })
    }

    return filtered.sort((a, b) => {
      let valA: string | undefined
      let valB: string | undefined

      if (sortConfig.key === 'title') {
        valA = a.title?.toLowerCase()
        valB = b.title?.toLowerCase()
      } else if (sortConfig.key === 'category') {
        const catA = a['pb-artifact-category']
        const catB = b['pb-artifact-category']
        valA = (
          typeof catA === 'object' && catA !== null && 'name' in catA ? catA.name : ''
        )?.toLowerCase()
        valB = (
          typeof catB === 'object' && catB !== null && 'name' in catB ? catB.name : ''
        )?.toLowerCase()
      }

      if (valA === undefined || valB === undefined) return 0
      if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1
      if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1
      return 0
    })
  }, [initialArtifacts, selectedCategoryIds, selectedTagIds, sortConfig, searchTerm])

  const handleSort = (key: 'title' | 'category') => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }))
  }

  const toggleFilter = (id: string, type: 'category' | 'tag') => {
    const setter = type === 'category' ? setSelectedCategoryIds : setSelectedTagIds
    setter((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))
  }

  return (
    <div>
      {/* Search and Sort Controls */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative flex-grow sm:max-w-xs">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <SearchIcon className="w-4 h-4 text-text-muted" />{' '}
            {/* Uses text-text-muted from theme */}
          </div>
          <input
            type="text"
            placeholder="Search artifacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-2 pl-10 pr-3 text-sm border rounded-md bg-bg-default text-text-default border-border-default focus:ring-primary focus:border-primary"
          />
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-sm font-medium text-text-muted">Sort by:</span>
          <button
            onClick={() => handleSort('title')}
            className={cn(
              'px-3 py-1.5 text-xs border rounded-md transition-colors',
              sortConfig.key === 'title'
                ? 'bg-primary text-black-200 border-primary' // text-black-200 for contrast on primary
                : 'bg-transparent text-text-default border-border-default hover:bg-bg-subtle',
            )}
          >
            Name {sortConfig.key === 'title' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
          </button>
          <button
            onClick={() => handleSort('category')}
            className={cn(
              'px-3 py-1.5 text-xs border rounded-md transition-colors',
              sortConfig.key === 'category'
                ? 'bg-primary text-black-200 border-primary' // text-black-200 for contrast on primary
                : 'bg-transparent text-text-default border-border-default hover:bg-bg-subtle',
            )}
          >
            Category {sortConfig.key === 'category' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
          </button>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="mb-6 space-y-3">
        <div>
          <span className="text-sm font-medium text-text-muted mr-2">Categories:</span>
          {allCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => toggleFilter(cat.id, 'category')}
              className={cn(
                'px-2.5 py-1 text-xs border rounded-full mr-1.5 mb-1.5 transition-colors',
                selectedCategoryIds.includes(cat.id)
                  ? 'bg-primary text-black-200 border-primary' // text-black-200 for contrast
                  : 'bg-transparent text-text-default border-border-default hover:bg-bg-subtle',
              )}
            >
              {cat.name}
            </button>
          ))}
          {selectedCategoryIds.length > 0 && (
            <button
              onClick={() => setSelectedCategoryIds([])}
              className="px-2.5 py-1 text-xs border rounded-full mr-1.5 mb-1.5 transition-colors bg-accent/20 text-accent border-accent/50 hover:bg-accent/30"
            >
              Clear Categories
            </button>
          )}
        </div>
        {displayableTags.length > 0 && (
          <div>
            <span className="text-sm font-medium text-text-muted mr-2">Tags:</span>
            {displayableTags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => toggleFilter(tag.id, 'tag')}
                className={cn(
                  'px-2.5 py-1 text-xs border rounded-full mr-1.5 mb-1.5 transition-colors',
                  selectedTagIds.includes(tag.id)
                    ? 'bg-secondary text-black-200 border-secondary' // text-black-200 for contrast on secondary
                    : 'bg-transparent text-text-default border-border-default hover:bg-bg-subtle',
                )}
              >
                {tag.name}
              </button>
            ))}
            {selectedTagIds.length > 0 && (
              <button
                onClick={() => setSelectedTagIds([])}
                className="px-2.5 py-1 text-xs border rounded-full mr-1.5 mb-1.5 transition-colors bg-accent/20 text-accent border-accent/50 hover:bg-accent/30"
              >
                Clear Tags
              </button>
            )}
          </div>
        )}
      </div>

      {/* Artifacts List */}
      <div ref={parentRef} className="border-t border-border-default">
        {filteredAndSortedArtifacts.map((artifact) => {
          const category = artifact['pb-artifact-category']
          const categoryName =
            typeof category === 'object' && category !== null && 'name' in category
              ? category.name
              : 'Uncategorized'
          const artifactTags = Array.isArray(artifact['pb-artifact-tag'])
            ? (artifact['pb-artifact-tag']
                .map((t) => (typeof t === 'object' && t !== null && 'name' in t ? t : null))
                .filter(Boolean) as PbArtifactTag[])
            : []

          const fileTypeDisplay =
            artifact.resourceType === 'file'
              ? getFileExtension(artifact.documentFile as MediaType)
              : 'LINK'
          const targetUrl =
            artifact.resourceType === 'file'
              ? (artifact.documentFile as MediaType)?.url || '#'
              : artifact.documentLink || '#'
          const isExternalLink =
            artifact.resourceType === 'link' ||
            (targetUrl.startsWith('http') &&
              typeof window !== 'undefined' &&
              !targetUrl.startsWith(window.location.origin))

          return (
            <div
              key={artifact.id}
              className="border-b border-border-default"
              onMouseEnter={() => setHoveredItemId(artifact.id)}
              onMouseLeave={() => setHoveredItemId(null)}
            >
              <Link
                href={targetUrl}
                target={isExternalLink ? '_blank' : undefined}
                rel={isExternalLink ? 'noopener noreferrer' : undefined}
                className="flex items-center justify-between py-3 px-1.5 hover:bg-bg-subtle transition-colors duration-150 group"
              >
                <div className="flex-grow mr-4 min-w-0">
                  <h3 className="text-sm md:text-base font-medium text-text-default group-hover:text-primary transition-colors truncate">
                    {artifact.title}
                  </h3>
                  <div className="flex items-center gap-1.5 flex-wrap mt-1">
                    <span className="flex-shrink-0 px-2.5 py-0.5 text-xs font-medium text-black-200 bg-secondary rounded-full">
                      {' '}
                      {/* text-black-200 for contrast */}
                      {categoryName}
                    </span>
                    {artifactTags.map((tag) => (
                      <span
                        key={tag.id}
                        className="flex-shrink-0 px-2 py-0.5 text-xs text-text-muted bg-bg-muted rounded-full"
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-2 flex-shrink-0">
                  <span className="flex-shrink-0 px-2.5 py-0.5 text-xs font-semibold text-bg-default bg-text-default rounded-full">
                    {' '}
                    {/* Inverted "dark" pill */}
                    {fileTypeDisplay}
                  </span>
                  <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center text-text-muted group-hover:text-primary transition-opacity duration-150 opacity-0 group-hover:opacity-100">
                    {hoveredItemId === artifact.id &&
                      (artifact.resourceType === 'file' ? (
                        <DownloadIcon className="w-5 h-5" />
                      ) : (
                        <ArrowEast className="w-5 h-5" />
                      ))}
                  </div>
                </div>
              </Link>
            </div>
          )
        })}
        {filteredAndSortedArtifacts.length === 0 && (
          <p className="py-8 text-center text-text-muted">
            No artifacts match your current filters.
          </p>
        )}
      </div>
    </div>
  )
}
