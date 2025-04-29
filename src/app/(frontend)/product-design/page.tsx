// /src/app/(frontend)/product-design/page.tsx
import { PageHeading } from '@/components/ui/PageHeading'
import { getDocuments } from '@/utils/getDocument'
import { ProductDesign } from '@/payload-types'
import Image from 'next/image'
import { Skeleton } from '@/components/ui/Skeleton'
import { PinIcon } from 'lucide-react'
import Link from 'next/link'

export default async function ProductDesignPage() {
  // Fetch designs, sorting only by datePublished initially via Payload
  const productDesignsData = await getDocuments<ProductDesign>({
    collection: 'product-designs',
    limit: 100,
    sort: '-datePublished', // Sort by date initially
    where: { _status: { equals: 'published' } }, // Ensure only published are fetched
    depth: 1, // Ensure image is populated
  })

  // --- Manually sort the array after fetching ---
  const sortedDesigns = productDesignsData.docs.sort((a, b) => {
    // Prioritize pinned items (true comes first)
    if (a.pinned && !b.pinned) {
      return -1 // a comes first
    }
    if (!a.pinned && b.pinned) {
      return 1 // b comes first
    }
    // If pinning is the same, sort by datePublished (newest first)
    const dateA = a.datePublished ? new Date(a.datePublished).getTime() : 0
    const dateB = b.datePublished ? new Date(b.datePublished).getTime() : 0
    return dateB - dateA // Descending order
  })
  // --- End manual sort ---

  return (
    <div className="w-full mx-auto max-w-7xl">
      <div className="block">
        <PageHeading
          title="Product Design"
          description="A collection of 3D models I've designed and published on MakerWorld."
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {/* Use the manually sorted array */}
        {sortedDesigns.map((design, index) => (
          <div
            key={design.id}
            className={`group relative overflow-hidden rounded-lg bg-muted ${
              // Add bg-muted as fallback
              index === 0
                ? 'md:col-span-2 md:row-span-2 h-full'
                : 'w-full  aspect-4/3 md:aspect-square'
            }`}
          >
            {/* Container for Image and Skeleton */}
            <div className="relative w-full h-full">
              {/* Skeleton Loader - positioned behind the image */}
              <Skeleton className="absolute inset-0 w-full h-full" />

              {/* Image - will cover skeleton when loaded */}
              {design.image && typeof design.image !== 'number' && design.image.url ? (
                <Image
                  src={design.image.url}
                  alt={design.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  unoptimized={true} //leave this since images are animated
                  className="relative z-10 object-cover w-full h-full transition-transform duration-300 group-hover:scale-105" // Add z-10
                />
              ) : (
                // Keep fallback for no image case
                <div className="relative z-10 flex items-center justify-center w-full h-full bg-gray-100">
                  {' '}
                  {/* Add z-10 */}
                  <span className="text-gray-400">No image</span>
                </div>
              )}

              {/* Overlay for text */}
              <div className="absolute inset-0 z-20 transition-opacity duration-300 opacity-0 bg-gradient-to-t from-black/70 to-transparent group-hover:opacity-100">
                {' '}
                {/* Ensure overlay is above image */}
                <div className="absolute bottom-0 left-0 p-4 text-white">
                  <h3 className="mb-1 text-lg font-bold">{design.title}</h3>
                  {design.datePublished && (
                    <p className="text-sm text-gray-200">
                      {new Date(design.datePublished).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            </div>
            {design.pinned && (
              <div className="absolute right-2 top-2 z-20 rounded bg-background/80 p-1.5 text-foreground">
                <PinIcon className="w-4 h-4" />
              </div>
            )}
            {/* Link */}
            <Link
              href={`/product-design/${design.id}`}
              className="absolute inset-0 z-30" // Ensure link is on top
              aria-label={`View ${design.title}`}
            ></Link>
          </div>
        ))}
      </div>
    </div>
  )
}
