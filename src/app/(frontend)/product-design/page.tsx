// /src/app/(frontend)/product-design/page.tsx
import { PageHeading } from '@/components/ui/PageHeading'
import { getDocuments } from '@/utils/getDocument'
import { ProductDesign } from '@/payload-types'
import Image from 'next/image'
import { Skeleton } from '@/components/ui/Skeleton'
import { PinIcon } from 'lucide-react'
import Link from 'next/link'
import { P } from '@typography'

export default async function ProductDesignPage() {
  const productDesignsData = await getDocuments<ProductDesign>({
    collection: 'product-design',
    limit: 100,
    sort: '-datePublished',
    where: {
      _status: { equals: 'published' },
      'visibility.visibility-collection-page': { equals: true },
    },
    depth: 2,
  })

  // --- Manually sort the array after fetching ---
  const sortedDesigns = productDesignsData.docs.sort((a, b) => {
    // Prioritize pinned items
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
    <>
      <PageHeading title="Product Design">
        <P>
          A collection of 3D models I've designed and published on{' '}
          <Link href="https://makerworld.com/en/@jordyjordy">MakerWorld</Link>.
        </P>
      </PageHeading>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {sortedDesigns.map((design, index) => (
          <div
            key={design.id}
            className={`group relative overflow-hidden rounded-lg bg-muted ${
              index === 0
                ? 'md:col-span-2 md:row-span-2 h-full'
                : 'w-full  aspect-4/3 md:aspect-square'
            }`}
          >
            <div className="relative w-full h-full">
              <Skeleton className="absolute inset-0 w-full h-full" />

              {design.image && typeof design.image !== 'number' && design.image.url ? (
                design.image.mimeType === 'video/webm' ? (
                  <video
                    src={design.image.url}
                    width={design.image.width || undefined}
                    height={design.image.height || undefined}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="relative z-10 object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                  >
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <Image
                    src={design.image.url}
                    alt={design.title}
                    width={design.image.width || undefined}
                    height={design.image.height || undefined}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    style={{ width: 'auto', height: 'auto' }}
                    priority={index === 0} // Load the first image first
                    unoptimized={true} //leave this since images are animated
                    className="z-10 object-cover transition-transform duration-300 group-hover:scale-105" // Removed 'relative'
                  />
                )
              ) : (
                <div className="relative z-10 flex items-center justify-center w-full h-full bg-gray-100">
                  {' '}
                  <span className="text-gray-400">No image</span>
                </div>
              )}

              {/* Overlay for text */}
              <div className="absolute inset-0 z-20 transition-opacity duration-300 opacity-0 bg-linear-to-t from-black/70 to-transparent group-hover:opacity-100">
                {' '}
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
              <div className="absolute right-2 top-2 z-20 rounded-sm bg-background/80 p-1.5 text-foreground">
                <PinIcon className="w-4 h-4" />
              </div>
            )}
            <Link
              href={`/product-design/${design.id}`}
              className="absolute inset-0 z-30"
              aria-label={`View ${design.title}`}
            ></Link>
          </div>
        ))}
      </div>
    </>
  )
}
