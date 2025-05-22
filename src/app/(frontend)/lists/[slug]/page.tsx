// src/app/(frontend)/lists/[slug]/page.tsx

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { PageHeading } from '@/components/ui/PageHeading'
import { List } from '@/payload-types' // Ensure List type includes 'slug'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { RichText } from '@payloadcms/richtext-lexical/react'

interface ListPageParams {
  slug: string // CHANGED: from id to slug
}

export default async function ListDetailPage({ params }: { params: Promise<ListPageParams> }) {
  const resolvedParams = await params
  const { slug } = resolvedParams // CHANGED: from id to slug

  // Initialize Payload
  const payload = await getPayload({
    config,
  })

  let list: List | null = null
  try {
    // Fetch the specific list document by its slug
    const { docs } = await payload.find({
      collection: 'lists',
      where: {
        slug: {
          equals: slug,
        },
        _status: {
          // Optionally, ensure only published lists are accessible via slug URL
          equals: 'published',
        },
      },
      limit: 1,
      depth: 1, // Adjust depth as needed for related data like images or projectType
    })

    if (docs.length > 0) {
      list = docs[0]
    }
  } catch (error) {
    console.error('Error fetching list by slug:', error)
    // Optionally, you could log the slug that failed: console.error(`Failed for slug: ${slug}`);
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
      <PageHeading title={list.title} description={list.content.subheader || 'A list of things.'} />

      {/* Render the 'things' rich text field */}
      {list.content.things ? (
        <div className="mt-6 prose prose-lg dark:prose-invert max-w-none">
          <RichText data={list.content.things} />
        </div>
      ) : (
        <p className="mt-6">This list is currently empty.</p>
      )}
    </>
  )
}

export async function generateStaticParams() {
  const payload = await getPayload({ config })
  const { docs: lists } = await payload.find({
    collection: 'lists',
    limit: 200,
    where: {
      _status: { equals: 'published' },
      // Optionally, add a condition to  ensure slug is not null or empty if your data might have that
      // slug: { exists: true, not_equals: '' } // This depends on how Payload handles empty/null queries
    },
    depth: 0, // Only need slugs
  })

  // Filter out lists that don't have a valid string slug
  const validLists = lists.filter(
    (list) => typeof list.slug === 'string' && list.slug.trim() !== '',
  )

  if (lists.length !== validLists.length) {
    console.warn('[generateStaticParams] Filtered out lists with invalid or missing slugs.')
    // You might want to log which lists were filtered for debugging:
    // lists.forEach(list => {
    //   if (!(typeof list.slug === 'string' && list.slug.trim() !== '')) {
    //     console.log(`Invalid slug for list ID ${list.id}:`, list.slug);
    //   }
    // });
  }

  return validLists.map((list) => ({
    slug: list.slug,
  }))
}
