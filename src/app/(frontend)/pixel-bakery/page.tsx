// /src/app/(frontend)/pixel-bakery/page.tsx

import { PageHeading } from '@/components/ui/PageHeading'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { OpenSourceDocument, PbArtifactCategory, PbArtifactTag } from '@/payload-types'
import { OpenSourceArtifactsClient } from './OpenSourceArtifacts.client'
import { H2, P } from '@typography'
import PbOffice01 from '/public/images/pixel-bakery-office-01.jpg'
import PbOffice02 from '/public/images/pixel-bakery-office-02.jpg'
import Image from 'next/image'
import Link from 'next/link'
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
    <>
      <PageHeading title="Pixel Bakery" />

      <section className="mb-6 md:mb-0">
        <div className="grid grid-cols-1 gap-x-12 md:grid-cols-6  md:max-h-dvh">
          <div className="relative mb-8 overflow-hidden bg-gray-100 rounded-sm aspect-16/9 md:hidden">
            <div className="flex items-center justify-center h-full">
              <Image src={PbOffice01} alt="Pixel Bakery Office" fill className="object-cover" />
            </div>
          </div>
          <div className="col-span-3 relative mb-8 overflow-hidden bg-gray-100 rounded-sm w-full  aspect-3/4 hidden md:block max-h-[80%]">
            <div className="flex items-center justify-center h-full scale-110">
              <Image src={PbOffice02} alt="Pixel Bakery Office" fill className="object-cover" />
            </div>
          </div>
          <div className="col-span-1 md:col-span-3">
            <P>
              <Link href="https://pixelbakery.com"> Pixel Bakery Design Studio</Link> was a
              multidisciplinary production studio that tells brand stories using motion design,
              animation, and video production. I started PB over a decade ago with two of my college
              best friends, Tony Bertino and Karley Johnson. It was just the three of us in a tiny
              closet of an office that had no windows. We were young, hungry, and pretty naive about
              what running a business actually meant. We had no money, no clients, and absolutely no
              idea what we were doing.
            </P>
            <P>
              Fast forward to present, we&#39;ve had over 50 employees pass through our doors,{' '}
              <Link href={'https://pixelbakery.com/work'} target="_blank">
                hundreds of clients
              </Link>{' '}
              trust us with their brand, worked with some pretty big fish clients like L&apos;Oréal,
              won 40+{' '}
              <Link href={'https://pixelbakery.com/about#awards'} target="_blank">
                industry awards
              </Link>
              , and grossed millions in revenue.
            </P>
            <P>Our success came from two things.</P>
            <P>
              Our mission: we create intentional and beautiful moments for exciting people that
              share our beliefs and passions.
            </P>
            <P>And our values/beliefs:</P>
            <ul className="flex flex-col gap-2 list-disc list-inside mb-4">
              <li>
                Life is fleeting, and you only have so many days to craft the world you&apos;d like
                to live in.
              </li>
              <li>
                Our success is a direct result of the people in our lives. Our employees, our
                clients, and our community are vitally important to us.
              </li>
              <li>
                We are who we are and we treat everyone exactly the same. We practice this with
                vulnerability, constructive criticism, and honesty.
              </li>
              <li>
                If you&apos;re going to do something, do it right or don&apos;t do it at all. We
                don&apos;t take shortcuts.
              </li>
            </ul>
            <P>
              In May of 2025, I officially decided it was time to close our doors and see what the
              universe has in store for me next. I&apos;m proud of what I built and I will forever
              look back at the past decade I dedicated to building it as the best time of my life.
            </P>
          </div>
        </div>
      </section>

      {/* Open Source Artifacts Section */}
      <section className="mt-6 md:my-0">
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
        <P>🚧 This is a work-in-progress. It&#39;s a slow process. More soon.</P>
        <OpenSourceArtifactsClient
          initialArtifacts={artifacts}
          allCategories={categories}
          allTags={tags}
        />
      </section>
    </>
  )
}
