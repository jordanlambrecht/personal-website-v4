'use client'
import { useState, useMemo, useRef, useEffect } from 'react'
import Link from 'next/link'
import { List } from '@/payload-types'
import { PinIcon, StarIcon } from 'lucide-react'
import autoAnimate from '@formkit/auto-animate'
import { cn } from '@/utils/helpers'
import { H2 } from '@typography'

interface ListsClientPageProps {
  initialLists: List[]
  availableYears: number[]
}

export function ListsClientPage({ initialLists, availableYears }: ListsClientPageProps) {
  const [selectedYears, setSelectedYears] = useState<number[]>([])
  const [showFavoritesOnly, setShowFavoritesOnly] = useState<boolean>(false)
  const parentRef = useRef<HTMLDivElement>(null)

  // Initialize auto-animate
  useEffect(() => {
    if (parentRef.current) {
      autoAnimate(parentRef.current)
    }
  }, [parentRef])

  const handleYearToggle = (year: number) => {
    setShowFavoritesOnly(false) // Disable favorites filter when a year is clicked
    setSelectedYears((prevYears) =>
      prevYears.includes(year) ? prevYears.filter((y) => y !== year) : [...prevYears, year],
    )
  }

  const handleSelectAll = () => {
    setShowFavoritesOnly(false) // Disable favorites filter
    setSelectedYears([]) // Clear selected years
  }

  const handleSelectFavorites = () => {
    // Toggle the showFavoritesOnly state
    setShowFavoritesOnly((prevShowFavorites) => !prevShowFavorites)
    setSelectedYears([])
  }

  const filteredLists = useMemo(() => {
    if (showFavoritesOnly) {
      // If showing only favorites, filter by the favorited flag
      return initialLists.filter((list) => list.sorting?.favorited)
    } else if (selectedYears.length === 0) {
      // If not showing favorites and no years selected, show all
      return initialLists
    } else {
      // If not showing favorites, filter by selected years
      return initialLists.filter((list) => {
        if (!list.publishedAt) return false
        const listYear = new Date(list.publishedAt).getFullYear()
        return selectedYears.includes(listYear)
      })
    }
  }, [initialLists, selectedYears, showFavoritesOnly]) // Add showFavoritesOnly to dependency array

  return (
    <div className="w-full">
      {/* Filter UI */}
      <div className="flex flex-wrap items-center w-full pb-1 mb-1 text-sm italic gap-x-4 ">
        {/* All Button */}
        <button
          onClick={handleSelectAll}
          className={`cursor-pointer p-2 duration-300 transition-colors ${
            // Active if neither favorites nor specific years are selected
            !showFavoritesOnly && selectedYears.length === 0
              ? 'text-black border-b border-black'
              : ' text-gray-500 '
          }`}
        >
          all of &apos;em
        </button>

        {/* Year Buttons */}
        {availableYears.map((year) => (
          <button
            key={year}
            onClick={() => handleYearToggle(year)}
            className={`cursor-pointerp-2 duration-300 transition-colors ${
              // Active if not showing favorites and this year is selected
              !showFavoritesOnly && selectedYears.includes(year)
                ? ' text-black border-b border-black'
                : ' text-gray-500 hover:text-black'
            }`}
          >
            {year}
          </button>
        ))}
        {/* --- Favorites Button --- */}
        <button
          onClick={handleSelectFavorites}
          className={`cursor-pointer p-2 duration-300 transition-colors flex items-center${
            showFavoritesOnly ? ' text-black' : ''
          }`}
        >
          <StarIcon
            size={16}
            className={cn(
              'duration-300 transition-colors',
              showFavoritesOnly
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-400 hover:text-yellow-400 hover:fill-yellow-400',
            )}
          />{' '}
        </button>
        {/* --- End Favorites Button --- */}
      </div>

      {/* List Display */}
      <div ref={parentRef} className="mt-8 flex flex-wrap gap-6 min-h-[150px]">
        {/* Render items only if there are filtered results */}
        {filteredLists.length > 0
          ? filteredLists.map((list) => (
              <Link
                key={list.id}
                href={`/lists/${list.slug}`} // CHANGED: Use list.slug instead of list.id
                className={`
                  inline-flex flex-col border-2 rounded-lg p-3 md:p-4
                  transition-colors duration-200
                  min-w-[150px] max-w-xs relative
                  ${
                    list.sorting?.favorited
                      ? 'bg-black border-black hover:bg-gray-800'
                      : 'border-black hover:bg-amber-50'
                  }
                `}
              >
                {/* --- Icons Container (Top Right) --- */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                  {list.sorting?.favorited && ( // Use optional chaining if 'sorting' itself can be undefined
                    <StarIcon className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  )}
                  {list.sorting?.pinned && (
                    <PinIcon
                      className={`h-4 w-4 shrink-0 ${
                        list.sorting?.favorited ? 'text-gray-400' : 'text-black fill-black'
                      }`}
                    />
                  )}
                </div>
                {/* --- End Icons Container --- */}

                {/* --- Emoji and Title --- */}
                <div className="flex items-start w-full pr-8 mt-4 mb-1 gap-x-4">
                  {list.content.emoji && (
                    <div
                      className={cn(
                        'shrink-0 mt-1  rounded-sm w-8 h-8 flex items-center justify-center',
                        list.sorting?.favorited ? 'bg-gray-100 dark:bg-gray-700' : 'bg-gray-100', // Updated
                      )}
                    >
                      <span className="text-base">{list.content.emoji}</span>
                    </div>
                  )}
                  <H2
                    className={`  hyphens-auto grow ${
                      list.sorting?.favorited ? 'text-white' : 'text-black' // Updated
                    }`}
                  >
                    {list.title}
                  </H2>
                </div>
                {/* --- End Emoji and Title --- */}

                {/* Container for Date and Arrow */}
                <div className="flex items-end justify-between w-full mt-auto gap-x-2 ">
                  {list.publishedAt && (
                    <p
                      className={`text-xs ${list.sorting.favorited ? 'text-gray-400' : 'text-gray-500'}`}
                    >
                      {new Date(list.publishedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  )}
                  {!list.publishedAt && <div className="grow"></div>}
                  <span
                    className={`text-lg md:text-xl font-bold shrink-0 ${
                      list.sorting.favorited ? 'text-gray-400' : 'text-black'
                    }`}
                  >
                    →
                  </span>
                </div>
              </Link>
            ))
          : null}
      </div>
      {filteredLists.length === 0 && (
        <p className="mt-8 text-center text-gray-500 min-h-[150px] flex items-center justify-center">
          No lists found
          {showFavoritesOnly
            ? ' marked as favorite.'
            : selectedYears.length > 0
              ? ' for the selected year(s).'
              : '.'}
        </p>
      )}
    </div>
  )
}
