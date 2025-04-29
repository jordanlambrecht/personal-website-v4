// /src/app/not-found.tsx
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <h1 className="mb-4 text-6xl font-bold">404</h1>
      <h2 className="mb-6 text-2xl">Page Not Found</h2>
      <p className="max-w-md mb-8 text-lg text-gray-600">
        The page you&apos;re looking for doesn&apos;t exist. There&apos;s probably a metaphor in
        there somewhere.
      </p>
      <Link
        href="/"
        className="px-6 py-3 font-medium text-white transition-colors rounded bg-amber-500 hover:bg-amber-600"
      >
        Return Home
      </Link>
    </div>
  )
}
