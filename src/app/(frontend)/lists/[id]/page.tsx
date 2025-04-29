import { notFound } from 'next/navigation'
import { PageHeading } from '@/components/ui/PageHeading'
import { List } from '@/payload-types'
import { getPayload } from 'payload' // Import getPayload
import config from '@/payload.config' // Import your Payload config
import { RichText } from '@payloadcms/richtext-lexical/react' // Import RichText renderer

// Define the expected params shape
interface ListPageParams {
  id: string
}

// Make the component async and accept params
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
      // Optionally add depth if you need related data populated
      // depth: 1,
    })
  } catch (error) {
    // Handle potential errors during fetch (e.g., invalid ID format from Payload)
    console.error('Error fetching list:', error)
    // Let Payload's potential notFound error bubble up or fall through to the check below
  }

  // If the list wasn't found (findByID returns null or throws), show a 404 page
  if (!list) {
    notFound()
  }

  // Optional: Check if the list status is 'published' if you have such a field
  // if (list.status !== 'published') {
  //   notFound();
  // }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Use the list title for the PageHeading */}
      <PageHeading title={list.title} description={list.subheader || 'A list of things.'} />

      {/* Render the 'things' rich text field */}
      {list.things ? (
        // Ensure you have appropriate styling for the rich text output
        <div className="mt-6 prose prose-lg dark:prose-invert max-w-none">
          <RichText data={list.things} />
        </div>
      ) : (
        <p className="mt-6">This list is currently empty.</p>
      )}
    </div>
  )
}

// Optional: Generate Static Params (similar logic, using getPayload)
// export async function generateStaticParams() {
//   const payload = await getPayload({ config });
//   const lists = await payload.find({
//     collection: 'lists',
//     limit: 100, // Fetch all lists you want to pre-render
//     where: { status: { equals: 'published' } } // Only published ones
//   });
//
//   return lists.docs.map((list) => ({
//     id: list.id,
//   }));
// }
