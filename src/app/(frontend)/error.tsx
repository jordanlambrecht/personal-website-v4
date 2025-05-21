'use client'

import { useEffect } from 'react'
import { usePlausible } from 'next-plausible'

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  const plausible = usePlausible()

  useEffect(() => {
    console.error(error)

    // Track error in Plausible
    plausible('Error', {
      props: {
        errorMessage: error.message,
        errorName: error.name,
        errorStack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
        errorUrl: typeof window !== 'undefined' ? window.location.pathname : '',
        errorTimestamp: new Date().toISOString(),
      },
    })
  }, [error, plausible])

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] px-4 py-16 text-center">
      <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
        We've logged this error and will look into it.
      </p>
      <button
        onClick={() => reset()}
        className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/80 transition-colors"
      >
        Try again
      </button>
    </div>
  )
}
