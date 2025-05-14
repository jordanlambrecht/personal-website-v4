// /src/app/(frontend)/pixel-bakery/page.tsx

import { PageHeading } from '@/components/ui/PageHeading'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { OpenSourceDocument, PbArtifactCategory, PbArtifactTag } from '@/payload-types'
import { OpenSourceArtifactsClient } from './OpenSourceArtifacts.client'
import { H2, P } from '@typography'

export default async function PixelBakeryPage() {
  const payload = await getPayload({ config })

  const artifactsData = await payload.find({
    collection: 'open-source-documents',
    limit: 100,
    depth: 2, // To populate category, tags, and documentFile (media)
    where: {
      _status: { equals: 'published' },
    },
  })

  const categoriesData = await payload.find({
    collection: 'pb-artifact-categories',
    limit: 100,
  })

  const tagsData = await payload.find({
    collection: 'pb-artifact-tags',
    limit: 100,
  })

  const artifacts = artifactsData.docs as OpenSourceDocument[]
  const categories = categoriesData.docs as PbArtifactCategory[]
  const tags = tagsData.docs as PbArtifactTag[]

  return (
    <div className="max-w-6xl mx-auto">
      <PageHeading title="Pixel Bakery" />

      <div className="mb-10">
        <div className="relative mb-8 overflow-hidden bg-gray-100 rounded-lg h-80">
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-400">Pixel Bakery Image</p>
          </div>
        </div>
      </div>

      {/* Open Source Artifacts Section */}
      <div className="my-16">
        <H2>Open-Source Artifacts</H2>
        <P>
          One of my closely-held personal values is that knowledge should be shared. We built some
          pretty useful things over the years, and I want to share it with you rather than let it
          collect digital dust. I hope you find it useful.
        </P>
        <P>
          I&#39;ve packaged our most valuable resources: client onboarding workflows, project
          management frameworks, creative brief templates, production timelines, and quality
          assurance checklists, etc etc.
        </P>
        <P>
          Some were born from spectacular failures, others from gradual refinement. Some are
          incomplete, some are crazy intricate. None are perfect, but all are battle-tested. Take
          what works, improve what doesn&#39;t, and build something better.
        </P>
        <OpenSourceArtifactsClient
          initialArtifacts={artifacts}
          allCategories={categories}
          allTags={tags}
        />
      </div>
    </div>
  )
}
