// /src/app/(frontend)/about/page.tsx

import { PageHeading } from '@/components/ui/PageHeading'

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <PageHeading title="About" />

      <div className="grid grid-cols-1 gap-10 mb-10 md:grid-cols-3">
        <div className="col-span-2">
          <p className="mb-4 text-lg text-gray-700">
            I&apos;m Jordan Lambrecht, a designer and developer based in Lincoln, Nebraska. I
            specialize in creating digital experiences that are both beautiful and functional.
          </p>
          <p className="mb-4 text-lg text-gray-700">
            With a background in design and development, I bring a unique perspective to my work.
            I&apos;m passionate about creating products that solve real problems and delight users.
          </p>
          <p className="mb-4 text-lg text-gray-700">
            When I&apos;m not coding or designing, you can find me working on 3D models, woodworking
            projects, or spending time with my family and my Siberian Husky, Fuji.
          </p>
        </div>
        <div className="relative h-64 overflow-hidden bg-gray-100 rounded-lg md:h-auto">
          {/* Replace with your image */}
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-400">Profile Image</p>
          </div>
        </div>
      </div>

      <div className="mb-10">
        <h2 className="mb-4 text-2xl font-bold">Skills</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="p-4 text-center bg-gray-100 rounded-md">
            <p className="font-medium">Design</p>
          </div>
          <div className="p-4 text-center bg-gray-100 rounded-md">
            <p className="font-medium">Development</p>
          </div>
          <div className="p-4 text-center bg-gray-100 rounded-md">
            <p className="font-medium">3D Modeling</p>
          </div>
          <div className="p-4 text-center bg-gray-100 rounded-md">
            <p className="font-medium">Woodworking</p>
          </div>
        </div>
      </div>

      <div className="mb-10">
        <h2 className="mb-4 text-2xl font-bold">Experience</h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold">Founder & Creative Director</h3>
            <p className="text-lg font-medium text-blue-600">Pixel Bakery</p>
            <p className="text-gray-600">2015 - Present</p>
            <p className="mt-2 text-gray-700">
              Founded and grew a creative studio specializing in animation, design, and development.
            </p>
          </div>

          {/* Add more experience items as needed */}
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-2xl font-bold">Education</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-semibold">University Degree</h3>
            <p className="text-gray-600">University Name, 20XX - 20XX</p>
          </div>

          {/* Add more education items as needed */}
        </div>
      </div>
    </div>
  )
}
