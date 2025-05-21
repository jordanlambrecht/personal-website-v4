// src/components/ScrollDepthTracker.tsx

'use client'

import { useEffect, useState } from 'react'
import { usePlausible } from 'next-plausible'

export function ScrollDepthTracker({ pagePath, pageType }) {
  const plausible = usePlausible()
  const [trackedDepths, setTrackedDepths] = useState<Record<number, boolean>>({
    25: false,
    50: false,
    75: false,
    90: false,
  })

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercent = (scrollTop / docHeight) * 100

      // Check each threshold to see if it's been reached
      Object.entries(trackedDepths).forEach(([depth, tracked]) => {
        if (!tracked && scrollPercent >= Number(depth)) {
          plausible('Scroll', {
            props: {
              depth: `${depth}%`,
              page: pagePath || window.location.pathname,
              type: pageType,
            },
          })

          setTrackedDepths((prev) => ({
            ...prev,
            [depth]: true,
          }))
        }
      })
    }

    // Throttle for performance
    const throttledScroll = () => {
      let waiting = false
      if (!waiting) {
        window.requestAnimationFrame(() => {
          handleScroll()
          waiting = false
        })
        waiting = true
      }
    }

    window.addEventListener('scroll', throttledScroll)
    return () => window.removeEventListener('scroll', throttledScroll)
  }, [trackedDepths, plausible, pagePath, pageType])

  return null // This is a utility component with no UI
}
