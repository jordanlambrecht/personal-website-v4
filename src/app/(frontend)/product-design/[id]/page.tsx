// src/app/(frontend)/product-design/[id]/page.tsx

import Image from 'next/image'
import Link from 'next/link'
import { Tag } from 'lucide-react'
// import { formatDate } from '@/utils/helpers'
import { Gallery } from './page.client'
import { LinkIcon, DownloadIcon, Button, buttonVariants } from '@/components/ui'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { getDocument } from '@/utils/getDocument'
import { ProductDesign, ProductFile } from '@/payload-types'
import { H1, H2, P, H3 } from '@typography'
import { Skeleton } from '@/components/ui/Skeleton'
import { cn } from '@/utils'

export default async function ProductDesignDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params
  const { id } = params

  const design = await getDocument<ProductDesign>({
    collection: 'product-designs',
    id,
    depth: 2,
  })

  if (!design) {
    return (
      <div className="flex flex-col items-center justify-center w-full text-center gap-y-4">
        <H1 className="text-4xl font-black">Product Design Not Found 😓</H1>
        <div>
          <Link
            href="/product-design"
            className="inline-flex items-center px-4 py-2 text-white rounded-md bg-amber-500 hover:bg-amber-600"
            aria-label="Go Back"
          >
            ⟵ Back to all product designs
          </Link>
        </div>
      </div>
    )
  }

  const image = design.image && typeof design.image !== 'number' ? design.image : null

  // Handle extra images for gallery - now using hasMany format
  const extraImages =
    design.extraImages && Array.isArray(design.extraImages)
      ? (design.extraImages
          .map((img) => {
            if (typeof img === 'object' && img !== null && 'url' in img) {
              return { url: img.url, alt: img.alt || design.title || 'Product image' }
            }
            return null
          })
          .filter(Boolean) as { url: string; alt: string }[])
      : []

  const heroImage =
    image && image.url
      ? { url: image.url, alt: image.alt || design.title || 'Product image' }
      : null

  // Button visibility flags
  const showMakerworld = design.enableMakerworld && design.makerWorldLink ? true : false

  // Handle file relationship
  let downloadUrl: string | undefined = undefined
  let downloadFile: ProductFile | null = null

  if (design.enableDownload && design.downloadLink) {
    if (typeof design.downloadLink === 'string') {
      // Direct link
      downloadUrl = design.downloadLink
    } else if (typeof design.downloadLink === 'object') {
      // Media upload
      if ('url' in design.downloadLink && design.downloadLink.url) {
        downloadUrl = design.downloadLink.url
      }
      // ProductFiles relationship
      else if ('id' in design.downloadLink) {
        downloadFile = design.downloadLink
        if (downloadFile && downloadFile.url) {
          downloadUrl = downloadFile.url
        }
      }
    }
  }

  const showDownload = design.enableDownload && downloadUrl ? true : false
  const showPurchase = design.enablePurchase && design.purchaseLink ? true : false
  const showButtonGroup = showMakerworld || showDownload || showPurchase

  return (
    <article className="top-0 flex flex-col w-full gap-y-3 md:gap-y-6">
      <H1 className="md:hidden">{design.title}</H1>
      <div className="flex flex-col w-full md:flex-row md:gap-x-14">
        {/* CONTENT */}
        <div className="w-full md:w-3/5">
          {/* Container for Image and Skeleton */}
          <div className="relative mb-4 overflow-hidden rounded aspect-4/3 bg-muted">
            {' '}
            {/* Added relative and bg-muted */}
            {/* Skeleton Loader - positioned behind */}
            <Skeleton className="absolute inset-0 w-full h-full" />
            {/* Actual Image or Fallback */}
            {image && image.url ? (
              <Image
                src={image.url}
                alt={design.title}
                width={image.width}
                height={image.height}
                unoptimized={true}
                // Use 'priority' for LCP image, 'fill' might be better if aspect ratio is fixed
                className="relative z-10 object-cover w-full h-full" // Added relative and z-10
              />
            ) : (
              <div className="relative z-10 flex items-center justify-center w-full h-full">
                {' '}
                {/* Added relative and z-10 */}
                <p className="text-lg text-muted-foreground">No image available.</p>{' '}
                {/* Use theme color */}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="flex flex-col justify-start w-full h-auto text-left md:w-2/5 md:gap-y-6">
          <div>
            <Link
              href="/product-design"
              className="inline-flex items-center mt-0 mb-1 text-amber-600 hover:text-amber-700"
            >
              ← Back to all product designs
            </Link>
            <H1 className="hidden md:block">{design.title}</H1>
            {/* Show Rich Text if available, otherwise fallback to description */}
            {design.details ? (
              <div className="mb-4 prose">
                <RichText data={design.details} />
              </div>
            ) : design.description ? (
              <P className="text-gray-700 whitespace-pre-line">{design.description}</P>
            ) : null}
            {/* 
            {design.datePublished && (
              <p className="mt-4 text-gray-600">Published on {formatDate(design.datePublished)}</p>
            )} */}

            {design.tags && design.tags.length > 0 && (
              <div className="mt-4">
                <H2>Tags</H2>
                <div className="flex flex-wrap gap-2">
                  {design.tags.map((tagObj, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 text-sm text-gray-800 bg-gray-100 rounded-full"
                    >
                      <Tag size={14} className="mr-1" />
                      {tagObj.tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Download file info */}
            {downloadFile && downloadFile.fileDescription && (
              <div className="p-4 mt-4 rounded-md bg-gray-50">
                <H3 className="font-medium text-md">File Information</H3>
                <P className="text-sm text-gray-600">{downloadFile.fileDescription}</P>

                {downloadFile.fileType && (
                  <P className="mt-1 text-sm text-gray-600">
                    Type: {downloadFile.fileType.toUpperCase()}
                  </P>
                )}

                {downloadFile.fileSize && (
                  <P className="text-sm text-gray-600">
                    Size:{' '}
                    {downloadFile.fileSize > 1024
                      ? `${(downloadFile.fileSize / 1024).toFixed(2)} MB`
                      : `${downloadFile.fileSize} KB`}
                  </P>
                )}
              </div>
            )}
          </div>

          <div className="my-4">
            {showButtonGroup ? (
              <div className="flex flex-wrap w-full gap-2">
                {showMakerworld && design.makerWorldLink && (
                  <Link
                    href={design.makerWorldLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(buttonVariants({ variant: 'primary', size: 'sm' }), 'gap-x-2')}
                    aria-label="View on Makerworld"
                  >
                    MakerWorld
                    <LinkIcon width={15} height={15} />
                  </Link>
                )}

                {showDownload && downloadUrl ? (
                  <Link
                    href={downloadUrl}
                    download
                    className="inline-flex items-center px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 gap-x-2"
                    aria-label="Download project files"
                  >
                    Download
                    <DownloadIcon width={15} height={15} />
                  </Link>
                ) : (
                  <Button className="inline-flex px-4 py-2 text-gray-500 bg-gray-200 rounded-md">
                    Content download coming soon
                  </Button>
                )}

                {showPurchase && design.purchaseLink && (
                  <Link
                    href={design.purchaseLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 text-white bg-green-500 rounded-md hover:bg-green-600 gap-x-2"
                    aria-label="Purchase design"
                  >
                    Buy
                    <LinkIcon width={15} height={15} />
                  </Link>
                )}
              </div>
            ) : (
              <div className="flex justify-center w-full my-4">
                <div className="inline-flex px-4 py-2 text-gray-500 bg-gray-200 rounded-md">
                  Content download coming soon
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Extra written content section */}
      {design.enableWrittenContent && design.extraRichTextContent && (
        <div className="mt-8 prose max-w-none">
          <RichText data={design.extraRichTextContent} />
        </div>
      )}

      {/* Gallery/Lightbox section */}
      {extraImages.length > 0 && design.enableExtraImages && (
        <Gallery images={extraImages} heroImage={heroImage} />
      )}
    </article>
  )
}
