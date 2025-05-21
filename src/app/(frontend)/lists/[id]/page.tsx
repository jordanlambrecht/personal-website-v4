import { notFound } from 'next/navigation'
import Link from 'next/link'
import { PageHeading } from '@/components/ui/PageHeading'
import { List } from '@/payload-types'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { RichText } from '@payloadcms/richtext-lexical/react'

interface ListPageParams {
  id: string
}

export default async function ListDetailPage({ params }: { params: Promise<ListPageParams> }) {
  const resolvedParams = await params
  const { id } = resolvedParams

  // Initialize Payload
  const payload = await getPayload({
    config,
  })

  let list: List | null = null
  try {
    // Fetch the specific list document by its ID using payload.findByID
    list = await payload.findByID({
      collection: 'lists',
      id: id,
    })
  } catch (error) {
    console.error('Error fetching list:', error)
  }
  // If the list is not found, return a 404 page
  if (!list) {
    notFound()
  }

  return (
    <>
      {/* Back button */}
      <div className="mb-4">
        <Link href="/lists" className="text-foreground hover:text-foreground/50 ">
          &larr; Back to all lists
        </Link>
      </div>

      {/* Use the list title for the PageHeading */}
      <PageHeading title={list.title} description={list.subheader || 'A list of things.'} />

      {/* Render the 'things' rich text field */}
      {list.things ? (
        <div className="mt-6 prose prose-lg dark:prose-invert max-w-none">
          <RichText data={list.things} />
        </div>
      ) : (
        <p className="mt-6">This list is currently empty.</p>
      )}
    </>
  )
}
