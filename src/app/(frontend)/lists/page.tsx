// /src/app/(frontend)/lists/page.tsx
import { PageHeading } from '@/components/ui/PageHeading'
import { List } from '@/payload-types'
// import config from '@/payload.config'
import { getDocuments } from '@/utils/getDocument'
import { ListsClientPage } from './ListsClientPage'

export default async function ListsPage() {
  // Fetch lists, sorting only by publishedAt initially via Payload
  const listsData = await getDocuments<List>({
    collection: 'lists',
    sort: '-publishedAt',
    limit: 500, // Requesting up to 500
    where: { _status: { equals: 'published' } }, // Filtering for published status
    depth: 0,
  })

  // --- Manually sort the array after fetching ---
  const sortedLists = listsData.docs.sort((a, b) => {
    // Prioritize pinned items (true comes first)
    if (a.pinned && !b.pinned) {
      return -1 // a comes first
    }
    if (!a.pinned && b.pinned) {
      return 1 // b comes first
    }
    // If both have the same pinned status, sort by publishedAt descending
    const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0
    const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0
    return dateB - dateA // Newer dates first
  })
  // --- End of manual sort ---

  // Extract unique years from the *original* fetched data (order doesn't matter here)
  const years = Array.from(
    new Set(
      listsData.docs // Use original listsData.docs for year extraction
        .map((list) => (list.publishedAt ? new Date(list.publishedAt).getFullYear() : null))
        .filter((year): year is number => year !== null),
    ),
  ).sort((a, b) => b - a) // Sort years descending for the filter UI

  return (
    <div className="w-full mx-auto max-w-7xl">
      <PageHeading title="Lists" description="Various lists of things." />
      {/* Pass the manually sorted array to the Client Component */}
      <ListsClientPage initialLists={sortedLists} availableYears={years} />
    </div>
  )
}
