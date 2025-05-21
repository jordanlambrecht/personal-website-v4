// src/components/EngagementTracker.tsx

'use client'

import { useEffect } from 'react'
import { usePlausible } from 'next-plausible'

export function EngagementTracker({ pagePath, pageType }) {
  const plausible = usePlausible()

  useEffect(() => {
    const startTime = Date.now()
    let engagementTimeout: NodeJS.Timeout

    // Track time at specific intervals
    const trackEngagementTime = (seconds: number) => {
      plausible('Engagement', {
        props: {
          seconds: seconds,
          page: pagePath || window.location.pathname,
          type: pageType,
        },
      })
    }

    // Set up interval tracking at 30s, 60s, 3min, 5min
    const timepoints = [30, 60, 180, 300]
    const timers: NodeJS.Timeout[] = []

    timepoints.forEach((seconds) => {
      const timer = setTimeout(() => {
        trackEngagementTime(seconds)
      }, seconds * 1000)

      timers.push(timer)
    })

    return () => {
      // Clear all timers
      timers.forEach((timer) => clearTimeout(timer))

      // Track final time spent if more than 5 seconds
      const timeSpent = Math.round((Date.now() - startTime) / 1000)
      if (timeSpent > 5) {
        trackEngagementTime(timeSpent)
      }
    }
  }, [plausible, pagePath, pageType])

  return null // No UI output
}
