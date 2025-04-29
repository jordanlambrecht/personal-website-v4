'use client'
import { useState, useMemo, useRef, useEffect } from 'react'
import Link from 'next/link'
import { List } from '@/payload-types'
import { PinIcon, StarIcon } from 'lucide-react'
import autoAnimate from '@formkit/auto-animate'
import { cn } from '@/utils/helpers'
import { H2 } from '@typography'

// Define props expected from the server component
interface ListsClientPageProps {
  initialLists: List[]
  availableYears: number[]
}

export function ListsClientPage({ initialLists, availableYears }: ListsClientPageProps) {
  const [selectedYears, setSelectedYears] = useState<number[]>([])
  const [showFavoritesOnly, setShowFavoritesOnly] = useState<boolean>(false) // State for favorites filter
  const parentRef = useRef<HTMLDivElement>(null) // Create a ref for the list container

  // Initialize auto-animate on the container
  useEffect(() => {
    if (parentRef.current) {
      autoAnimate(parentRef.current)
    }
  }, [parentRef]) // Re-run if ref changes (shouldn't, but good practice)

  // --- Updated Filter Handlers ---
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

  // --- Modified handleSelectFavorites ---
  const handleSelectFavorites = () => {
    // Toggle the showFavoritesOnly state
    setShowFavoritesOnly((prevShowFavorites) => !prevShowFavorites)
    // Always clear year selection when toggling favorites
    setSelectedYears([])
  }
  // --- End Modified handleSelectFavorites ---

  // --- Updated Filtered List Logic ---
  const filteredLists = useMemo(() => {
    if (showFavoritesOnly) {
      // If showing only favorites, filter by the favorited flag
      return initialLists.filter((list) => list.favorited)
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
  // --- End Updated Filtered List Logic ---

  return (
    <div className="w-full">
      {/* Filter UI */}
      <div className="flex flex-wrap items-center w-full pb-1 mb-1 text-sm italic gap-x-4 ">
        {/* All Button */}
        <button
          onClick={handleSelectAll}
          className={`p-2 duration-300 transition-colors ${
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
            className={`p-2 duration-300 transition-colors ${
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
          className={`p-2 duration-300 transition-colors flex items-center${
            // Added flex/gap
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
          {/* Added Star Icon */}
        </button>
        {/* --- End Favorites Button --- */}
      </div>

      {/* List Display */}
      {/* Add ref and min-h-* to the list container */}
      <div
        ref={parentRef} // Attach the ref here
        className="mt-8 flex flex-wrap gap-6 min-h-[150px]" // Added min-h-[150px] (adjust as needed)
      >
        {/* Render items only if there are filtered results */}
        {filteredLists.length > 0
          ? filteredLists.map((list) => (
              <Link
                key={list.id}
                href={`/lists/${list.id}`}
                className={`
                  inline-flex flex-col border-2 rounded-lg p-3 md:p-4
                  transition-colors duration-200
                  min-w-[150px] max-w-xs relative
                  ${
                    list.favorited // Conditional background and border
                      ? 'bg-black border-black hover:bg-gray-800'
                      : 'border-black hover:bg-amber-50'
                  }
                `}
              >
                {/* --- Icons Container (Top Right) --- */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                  {list.favorited && (
                    <StarIcon className="w-4 h-4 text-yellow-400 fill-yellow-400" /> // Yellow filled star
                  )}
                  {list.pinned && (
                    <PinIcon
                      className={`h-4 w-4 flex-shrink-0 ${
                        list.favorited ? 'text-gray-400' : 'text-black fill-black' // Adjust pin color on dark bg
                      }`}
                    />
                  )}
                </div>
                {/* --- End Icons Container --- */}

                {/* --- Emoji and Title --- */}
                <div className="flex items-start w-full pr-8 mt-4 mb-1 gap-x-4">
                  {' '}
                  {/* Added pr-8 to avoid overlap with icons */}
                  {/* Emoji in grey box */}
                  {list.emoji && (
                    <div
                      className={cn(
                        'flex-shrink-0 mt-1  rounded w-8 h-8 flex items-center justify-center',
                        list.favorited ? 'bg-gray-100 dark:bg-gray-700' : 'bg-gray-100',
                      )}
                    >
                      <span className="text-base">{list.emoji}</span>
                    </div>
                  )}
                  <H2
                    className={`  hyphens-auto flex-grow ${
                      list.favorited ? 'text-white' : 'text-black' // Conditional text color
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
                      className={`text-xs ${
                        list.favorited ? 'text-gray-400' : 'text-gray-500' // Conditional date color
                      }`}
                    >
                      {new Date(list.publishedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  )}
                  {!list.publishedAt && <div className="flex-grow"></div>}
                  <span
                    className={`text-lg md:text-xl font-bold flex-shrink-0 ${
                      list.favorited ? 'text-gray-400' : 'text-black' // Conditional arrow color
                    }`}
                  >
                    →
                  </span>
                </div>
              </Link>
            ))
          : // This message is now outside the animated container if empty
            null}
      </div>
      {/* Display "No lists found" message separately */}
      {filteredLists.length === 0 && (
        <p className="mt-8 text-center text-gray-500 min-h-[150px] flex items-center justify-center">
          {' '}
          {/* Added padding/centering */}
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
