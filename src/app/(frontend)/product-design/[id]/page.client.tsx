// /src/app/(frontend)/product-design/[id]/page.client.tsx
'use client'

import { useState } from 'react'
import Image from 'next/image'
import Lightbox from 'yet-another-react-lightbox'
import Counter from 'yet-another-react-lightbox/plugins/counter'
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'
import 'yet-another-react-lightbox/styles.css'
import 'yet-another-react-lightbox/plugins/counter.css'
import 'yet-another-react-lightbox/plugins/thumbnails.css'

type GalleryProps = {
  images: Array<{ url: string; alt: string }>
  heroImage: { url: string; alt: string } | null
}

export const Gallery: React.FC<GalleryProps> = ({ images, heroImage }) => {
  const [open, setOpen] = useState(false) // Control lightbox visibility
  const [index, setIndex] = useState(0) // Track which image is active

  // Create slides array for the lightbox
  const slides = images.map((image) => ({
    src: image.url,
    alt: image.alt || 'Image',
  }))

  // Add hero image to the beginning if it exists
  if (heroImage && heroImage.url) {
    slides.unshift({ src: heroImage.url, alt: heroImage.alt })
  }

  return (
    <>
      <h2 className="mt-12 mb-4 text-2xl font-bold">Gallery</h2>
      <section className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {images.map((image, idx) => (
          <div
            key={idx + 1}
            role="button"
            className="relative aspect-4/3 cursor-pointer overflow-hidden rounded-md"
            onClick={() => {
              setIndex(idx + 1)
              setOpen(true)
            }}
          >
            <Image
              src={image.url}
              alt={image.alt || `Gallery image ${idx + 2}`}
              fill
              sizes="(max-width: 768px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>
        ))}
      </section>
      <Lightbox
        slides={slides}
        open={open}
        index={index}
        close={() => setOpen(false)}
        controller={{
          closeOnBackdropClick: true,
        }}
        plugins={[Counter, Thumbnails, Zoom]}
        thumbnails={{
          position: 'bottom',
          width: 120,
          height: 80,
        }}
        zoom={{
          maxZoomPixelRatio: 3,
          wheelZoomDistanceFactor: 100,
          doubleTapDelay: 300,
        }}
        styles={{
          container: {
            backgroundColor: 'rgba(0, 0, 0, .4)',
            backdropFilter: 'blur(10px)',
          },
          thumbnailsContainer: {
            backgroundColor: 'rgba(0, 0, 0, .6)',
          },
        }}
      />
    </>
  )
}
