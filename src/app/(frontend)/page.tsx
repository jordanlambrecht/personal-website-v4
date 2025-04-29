// /src/app/(frontend)/page.tsx

import Image from 'next/image'

import { getDocuments } from '@/utils/getDocument'
import { Label } from '@/payload-types' // Add List and Label
import ComeFindMe from '@/components/home/ComeFindMe'
import Distractions from '@/components/home/Distractions'
import IntroText from '@/components/home/IntroText'
import { ProjectGalleryClient } from '@/components/home/ProjectGalleryClient' // Import the new client component
import { fetchProjectsPage } from '@/app/actions' // Import the server action

import { H2 } from '@typography'
import { getPayload } from 'payload' // Or your utility to get payload
import config from '@payload-config' // Adjust path if needed

const PAGE_SIZE = 20 // Define how many items per page

// Define an extended Label type to include the count
interface LabelWithCount extends Label {
  projectCount: number
}

// --- Ensure this type definition exists and is exported ---
export type UnifiedProject = {
  id: string | number
  title: string
  image: { url?: string; alt?: string } | null // Or your specific image type
  collectionSlug: 'product-designs' | 'other-projects' | 'lists'
  date?: string | null // Ensure date is optional or always present
  pinned?: boolean | null
  label: Label | null // Use the Label type from payload-types
}

export default async function HomePage() {
  const payload = await getPayload({ config }) // Get payload instance

  // --- Fetch Labels (Still need all for filtering) ---
  const labelsData = await getDocuments<Label>({
    collection: 'labels',
    limit: 100,
    depth: 0,
  })
  const allLabelsRaw = labelsData.docs
  const listLabelDefinition = allLabelsRaw.find((l) => l.name === 'List')
  const productDesignLabelDefinition = allLabelsRaw.find((l) => l.name === 'Product Design')

  // --- Fetch counts for each label ---
  console.log('\n--- Starting Label Count Calculation ---')
  const labelsWithCounts: LabelWithCount[] = await Promise.all(
    allLabelsRaw.map(async (label): Promise<LabelWithCount> => {
      let count = 0
      const labelId = label.id
      const labelName = label.name // For logging

      // Determine which collections *could* have this label based on its definition
      const isListLabel = listLabelDefinition && label.id === listLabelDefinition.id
      const isProductDesignLabel =
        productDesignLabelDefinition && label.id === productDesignLabelDefinition.id
      // *** IMPORTANT: Re-evaluate this logic. Does it correctly capture all cases? ***
      // If a label can apply to BOTH PD and OP, this logic is flawed.
      const isOtherLabel = !isListLabel && !isProductDesignLabel

      console.log(`\nCalculating count for Label: "${labelName}" (ID: ${labelId})`)
      console.log(
        `  Is List: ${isListLabel}, Is PD: ${isProductDesignLabel}, Is Other: ${isOtherLabel}`,
      )

      try {
        // Count Product Designs
        // *** Should we query PD only if isProductDesignLabel is true, OR always if not isListLabel? ***
        // Let's query if the label *could* be a PD label for now.
        if (isProductDesignLabel) {
          // Query only if it's the designated PD label
          console.log(`  Querying Product Designs for projectType: ${labelId}`)
          const pdCountData = await payload.find({
            collection: 'product-designs',
            where: { _status: { equals: 'published' }, projectType: { equals: labelId } },
            limit: 0,
            depth: 0,
          })
          console.log(`  Product Designs count: ${pdCountData.totalDocs}`)
          count += pdCountData.totalDocs
        } else {
          console.log(
            `  Skipping Product Designs query (Label is not the designated 'Product Design' label).`,
          )
        }

        // Count Other Projects
        // *** Should we query OP only if isOtherLabel is true? ***
        // Let's query if the label *could* be an OP label.
        if (isOtherLabel) {
          // Query only if it's not List and not PD label
          console.log(`  Querying Other Projects for projectLabel: ${labelId}`)
          const opCountData = await payload.find({
            collection: 'other-projects',
            where: { _status: { equals: 'published' }, projectLabel: { equals: labelId } },
            limit: 0,
            depth: 0,
          })
          console.log(`  Other Projects count: ${opCountData.totalDocs}`)
          count += opCountData.totalDocs
        } else {
          console.log(
            `  Skipping Other Projects query (Label is List or designated 'Product Design' label).`,
          )
        }

        // Count Lists
        if (isListLabel) {
          // Query only if it's the designated List label
          console.log(`  Querying Lists count`)
          const listCountData = await payload.find({
            collection: 'lists',
            where: { _status: { equals: 'published' } },
            limit: 0,
            depth: 0,
          })
          console.log(`  Lists count: ${listCountData.totalDocs}`)
          count += listCountData.totalDocs
        } else {
          console.log(`  Skipping Lists query (Label is not the designated 'List' label).`)
        }

        console.log(`  ==> Final calculated count for "${labelName}": ${count}`)
      } catch (error) {
        console.error(`Error fetching count for label "${label.name}" (${label.id}):`, error)
        console.log(`  ==> Error resulted in count 0 for "${labelName}"`)
      }

      return { ...label, projectCount: count }
    }),
  )

  // Filter out labels with zero projects before passing to client
  const availableLabelsWithProjects = labelsWithCounts.filter((l) => l.projectCount > 0)
  console.log('\n--- Finished Label Count Calculation ---')
  console.log(
    'Labels with count > 0 being passed to client:',
    availableLabelsWithProjects.map((l) => ({ name: l.name, count: l.projectCount })),
  )

  // --- Fetch Initial Page (Page 1) using the Server Action logic ---
  // We can call the action directly on the server too
  const initialData = await fetchProjectsPage(1, PAGE_SIZE) // Fetch page 1

  // --- Render Page ---
  return (
    <div className="max-w-7xl">
      {/* --- Intro Section --- */}
      <section className="grid grid-cols-1 gap-x-12 md:grid-cols-5">
        <div className="relative col-span-3 overflow-hidden md:h-auto">
          <div className="flex flex-col aspect-3/2">
            <Image
              src="/images/jordan-plant-store.jpg"
              alt="Jordan Lambrecht"
              width={1920}
              height={1440}
              className="w-full h-auto"
            />
          </div>
        </div>
        <div className="col-span-2">
          <IntroText />
        </div>
      </section>

      {/* --- Come Find Me & Distractions Grid --- */}
      <section className="grid w-full grid-cols-1 pt-24 mt-24 space-x-24 border-t-2 border-black gap-y-12 md:grid-cols-6 md:gap-y-0">
        <ComeFindMe className="col-span-2" />
        <Distractions className="col-span-4" />
      </section>

      {/* --- Recent Projects Section (Using Client Component) --- */}
      <div className="mt-16">
        <H2>Recent Projects</H2>
        {/* Pass initial projects, labels with projects, and pagination info */}
        <ProjectGalleryClient
          initialProjects={initialData.projects}
          availableLabels={availableLabelsWithProjects} // Pass labels that have projects
          initialHasMore={initialData.hasNextPage}
          pageSize={PAGE_SIZE}
        />
      </div>
    </div>
  )
}
