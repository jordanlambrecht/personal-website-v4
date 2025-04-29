'use client'

import React from 'react'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'

interface PhotoPageParams {
  slug: string
}

export default function PhotoPage({ params }: { params: Promise<PhotoPageParams> }) {
  const resolvedParams = React.use(params)
  const router = useRouter()
  const searchParams = useSearchParams()

  const { slug } = resolvedParams
  const caption = searchParams.get('caption')

  const handleClose = () => {
    // Optional: Add closing animation later if desired
    router.back()
  }

  const altText = `Photo titled: ${slug.replace(/\.[^/.]+$/, '').replace(/-/g, ' ')}`

  return (
    <div
      // Apply fade-in animation to the overlay
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in"
      onClick={handleClose}
    >
      {/* Close button positioned top-right of the viewport */}
      <button
        onClick={handleClose}
        className="absolute z-20 text-3xl text-white transition-opacity top-4 right-4 hover:opacity-75"
        aria-label="Close photo"
      >
        &times;
      </button>

      {/* Apply scale-up animation to the content section */}
      <section
        // Use more screen space, adjust max sizes as needed
        className="relative flex flex-col w-full h-full max-w-screen-lg max-h-[90vh] animate-scale-up items-center justify-center"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        {/* Image container */}
        <div className="relative flex-grow w-full h-auto mb-2">
          {' '}
          {/* Allow image to dictate height based on aspect ratio */}
          <Image
            src={`/images/${slug}`}
            alt={altText}
            fill
            className="object-contain object-center" // Keep contain to prevent cropping
            priority
            onError={(e) => {
              const target = e.target as HTMLImageElement
              console.error('Image failed to load:', target.src)
            }}
          />
        </div>

        {/* Improved Caption Styling */}
        {caption && (
          <div className="w-full max-w-prose p-2 mt-1 text-center text-gray-200 rounded bg-black/30">
            <p className="text-sm">{decodeURIComponent(caption)}</p>
          </div>
        )}
      </section>
    </div>
  )
}
