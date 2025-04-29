// /src/components/analytics/Plausible.tsx
'use client'

export function PlausibleAnalytics() {
  if (process.env.NODE_ENV !== 'production') {
    return null
  }

  return (
    <script
      defer
      data-domain="jordanlambrecht.com"
      data-api="https://analytics.jordy.world/api/event"
      src="https://analytics.jordy.world/js/script.js"
    />
  )
}
