// /src/app/(frontend)/pixel-bakery/page.tsx
import Link from 'next/link'
import { PageHeading } from '@/components/ui/PageHeading'

export default function PixelBakeryPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <PageHeading title="Pixel Bakery" />

      <div className="mb-10">
        <div className="relative mb-8 overflow-hidden bg-gray-100 rounded-lg h-80">
          {/* Replace with Pixel Bakery image */}
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-400">Pixel Bakery Image</p>
          </div>
        </div>

        <p className="mb-4 text-lg text-gray-700">
          I&apos;m the Director and Founder of Pixel Bakery Design Studio and sit on the Board of
          Directors for the Lux Center for the Arts. Sometimes I host workshops, create tutorials,
          and do some public speaking.
        </p>

        <p className="mb-4 text-lg text-gray-700">
          Pixel Bakery is a creative studio based in Lincoln, Nebraska, specializing in animation,
          design, and development. We work with clients of all sizes to create memorable and
          impactful visual experiences.
        </p>

        <p className="mb-6 text-lg text-gray-700">
          Our team is passionate about crafting content that leaves a lasting impression. From brand
          identity and web development to animation and social media content, we help businesses
          tell their stories in engaging ways.
        </p>

        <div className="mt-8">
          <Link
            href="https://pixelbakery.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 text-white transition-colors rounded-md bg-amber-500 hover:bg-amber-600"
          >
            Visit Pixel Bakery
          </Link>
        </div>
      </div>

      <div className="mb-10">
        <h2 className="mb-4 text-2xl font-bold">Services</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="p-4 bg-white border border-gray-200 rounded-md shadow-sm">
            <h3 className="mb-2 text-xl font-semibold">Animation</h3>
            <p className="text-gray-700">2D and 3D animation services for brands and businesses.</p>
          </div>
          <div className="p-4 bg-white border border-gray-200 rounded-md shadow-sm">
            <h3 className="mb-2 text-xl font-semibold">Design</h3>
            <p className="text-gray-700">Branding, print, and digital design that stands out.</p>
          </div>
          <div className="p-4 bg-white border border-gray-200 rounded-md shadow-sm">
            <h3 className="mb-2 text-xl font-semibold">Development</h3>
            <p className="text-gray-700">Web development and interactive experiences.</p>
          </div>
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-2xl font-bold">Get in Touch</h2>
        <p className="mb-4 text-lg text-gray-700">
          Interested in working with Pixel Bakery? Visit our website or reach out directly to learn
          more.
        </p>
        <div className="flex space-x-4">
          <Link
            href="mailto:hello@pixelbakery.com"
            className="inline-flex items-center px-4 py-2 transition-colors bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Contact Us
          </Link>
          <Link
            href="https://pixelbakery.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 transition-colors bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Visit Website
          </Link>
        </div>
      </div>
    </div>
  )
}
