// /src/app/(frontend)/page.tsx

import Image from 'next/image'
// import { notFound } from 'next/navigation'
import { getDocuments } from '@/utils/getDocument'
import { Label, Media, SiteSetting } from '@/payload-types'
import ComeFindMe from '@/components/home/ComeFindMe'
import Distractions from '@/components/home/Distractions'
import IntroText from '@/components/home/IntroText'
import { ProjectGalleryClient } from '@/components/home/ProjectGalleryClient'
import { fetchProjectsPage } from '@/app/actions'
import { H2 } from '@typography'
import InnerWrapper from '@/components/layout/InnerWrapper'
import { getPayload } from 'payload'
import config from '@payload-config'

const PAGE_SIZE = 20

interface LabelWithCount extends Label {
  projectCount: number
}

export interface UnifiedProject {
  id: string | number
  title: string
  image: Media | null
  collectionSlug: 'product-design' | 'other-projects' | 'lists'
  date?: string | null
  pinned?: boolean | null
  favorited?: boolean | null
  label: Label | null
}

export default async function HomePage() {
  const payload = await getPayload({ config })

  // --- Fetch Site Settings ---
  const siteSettings = (await payload.findGlobal({
    slug: 'siteSettings',
    depth: 0,
  })) as SiteSetting

  // --- Fetch Labels ---
  const labelsData = await getDocuments<Label>({
    collection: 'labels',
    limit: 100,
    depth: 0,
  })
  const allLabelsRaw = labelsData.docs
  const listLabelDefinition = allLabelsRaw.find((l) => l.name === 'List')
  const productDesignLabelDefinition = allLabelsRaw.find((l) => l.name === 'Product Design')

  // --- Fetch counts for each label ---
  // console.log('\n--- Starting Label Count Calculation ---')
  const labelsWithCounts: LabelWithCount[] = await Promise.all(
    allLabelsRaw.map(async (label): Promise<LabelWithCount> => {
      let count = 0
      const labelId = label.id
      const labelName = label.name

      // Determine which collections *could* have this label based on its definition
      const isListLabel = listLabelDefinition && label.id === listLabelDefinition.id
      const isProductDesignLabel =
        productDesignLabelDefinition && label.id === productDesignLabelDefinition.id
      // *** TODO: Need to re-evaluate this logic later***
      // If a label can apply to BOTH PD and OP, this logic is flawed.
      const isOtherLabel = !isListLabel && !isProductDesignLabel

      // console.log(`\nCalculating count for Label: "${labelName}" (ID: ${labelId})`)
      // console.log(
      //   `  Is List: ${isListLabel}, Is PD: ${isProductDesignLabel}, Is Other: ${isOtherLabel}`,
      // )

      try {
        if (isProductDesignLabel && siteSettings.showProductDesigns) {
          // Check global toggle
          // console.log(`  Querying Product Designs for projectType: ${labelId}`)
          const pdCountData = await payload.find({
            collection: 'product-design',
            where: { _status: { equals: 'published' }, projectType: { equals: labelId } },
            limit: 0,
            depth: 0,
          })
          // console.log(`  Product Designs count: ${pdCountData.totalDocs}`)
          count += pdCountData.totalDocs
        } else {
          // console.log(`  Skipping Product Designs query (Label is not PD or PD section disabled).`)
        }

        if (isOtherLabel && siteSettings.showOtherProjects) {
          // Check global toggle
          // console.log(`  Querying Other Projects for projectLabel: ${labelId}`)
          const opCountData = await payload.find({
            collection: 'other-projects',
            where: { _status: { equals: 'published' }, projectLabel: { equals: labelId } },
            limit: 0,
            depth: 0,
          })
          // console.log(`  Other Projects count: ${opCountData.totalDocs}`)
          count += opCountData.totalDocs
        } else {
          // console.log(
          //   `  Skipping Other Projects query (Label is not Other or OP section disabled).`,
          // )
        }

        if (isListLabel && siteSettings.showLists) {
          // Check global toggle
          // console.log(`  Querying Lists count`)
          const listCountData = await payload.find({
            collection: 'lists',
            where: { _status: { equals: 'published' } },
            limit: 0,
            depth: 0,
          })
          // console.log(`  Lists count: ${listCountData.totalDocs}`)
          count += listCountData.totalDocs
        } else {
          // console.log(`  Skipping Lists query (Label is not List or Lists section disabled).`)
        }

        // console.log(`  ==> Final calculated count for "${labelName}": ${count}`)
      } catch (error) {
        console.error(`Error fetching count for label "${label.name}" (${label.id}):`, error)
        // console.log(`  ==> Error resulted in count 0 for "${labelName}"`)
      }

      return { ...label, projectCount: count }
    }),
  )

  // Filter out labels with zero projects before passing to client
  const availableLabelsWithProjects = labelsWithCounts.filter((l) => l.projectCount > 0)
  // console.log('\n--- Finished Label Count Calculation ---')
  // console.log(
  //   'Labels with count > 0 being passed to client:',
  //   availableLabelsWithProjects.map((l) => ({ name: l.name, count: l.projectCount })),
  // )

  // --- Fetch Initial Page (Page 1) using the Server Action logic ---
  const initialData = await fetchProjectsPage(1, PAGE_SIZE) // Fetch page 1

  return (
    <>
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
        <div className="col-span-2 mt-12 md:mt-0">
          <IntroText />
        </div>
      </section>

      {/* --- Come Find Me & Distractions Grid --- */}
      <section className="grid w-full grid-cols-1 pt-6 mt-6 md:pt-24 md:mt-24 space-x-24 md:border-t-2 border-black gap-y-12 md:grid-cols-6 md:gap-y-0">
        <ComeFindMe className="col-span-2" />
        <Distractions className="col-span-4" />
      </section>

      {/* --- Recent Projects --- */}
      <div className="mt-16">
        <H2>Recent Projects</H2>
        <ProjectGalleryClient
          initialProjects={initialData.projects}
          availableLabels={availableLabelsWithProjects}
          initialHasMore={initialData.hasNextPage}
          pageSize={PAGE_SIZE}
        />
      </div>
    </>
  )
}
