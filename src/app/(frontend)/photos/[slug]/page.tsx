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
    // TODO: Add closing animation later
    router.back()
  }

  const altText = `Photo titled: ${slug.replace(/\.[^/.]+$/, '').replace(/-/g, ' ')}`

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in"
      onClick={handleClose}
    >
      <button
        onClick={handleClose}
        className="cursor-pointer absolute z-20 text-3xl text-white transition-opacity top-4 right-4 hover:opacity-75"
        aria-label="Close photo"
      >
        &times;
      </button>
      <section
        className="relative flex flex-col w-full h-full max-w-(--breakpoint-lg) max-h-[90vh] animate-scale-up items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative grow w-full h-auto mb-2">
          {' '}
          <Image
            src={`/images/${slug}`}
            alt={altText}
            fill
            className="object-contain object-center"
            priority
            onError={(e) => {
              const target = e.target as HTMLImageElement
              console.error('Image failed to load:', target.src)
            }}
          />
        </div>
        {caption && (
          <div className="font-sans w-auto  px-12 py-3 mt-1 text-center text-black bg-lime">
            <p className="text-sm">{decodeURIComponent(caption)}</p>
          </div>
        )}
      </section>
    </div>
  )
}
