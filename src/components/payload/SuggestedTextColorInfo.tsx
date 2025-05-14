'use client'

import React, { useEffect, useState } from 'react'
// --- Import useAllFormFields ---
import { useAllFormFields } from '@payloadcms/ui/forms/Form'
import { getContrastTextColor } from './accessibilityHelpers'

const SuggestedTextColorInfo: React.FC = () => {
  // --- Use useAllFormFields to get the full fields state ---
  const [fields] = useAllFormFields() // Get the fields state object

  // --- Extract the value directly from the fields state ---
  const bgColorValue = fields?.bgColor?.value as string | undefined

  const [suggestedColor, setSuggestedColor] = useState<string>('#000000')

  // Log the fields object to see its structure
  // console.log('All fields state received:', fields)

  useEffect(() => {
    // console.log('useEffect - bgColorValue:', bgColorValue)

    if (bgColorValue && typeof bgColorValue === 'string' && bgColorValue.length >= 6) {
      try {
        const contrastColor = getContrastTextColor(bgColorValue)
        // console.log('useEffect - Calculated contrastColor:', contrastColor)
        setSuggestedColor(contrastColor)
      } catch (error) {
        // console.error('useEffect - Error calculating contrast:', error)
        setSuggestedColor('#000000')
      }
    } else {
      // console.log('useEffect - bgColorValue is invalid or empty, resetting suggestion.')
      setSuggestedColor('#000000')
    }
    // --- Dependency array still uses the extracted value ---
  }, [bgColorValue])

  // console.log('Rendering with suggestedColor:', suggestedColor)

  return (
    <div style={{ marginTop: '10px', color: '#666', fontSize: '0.85em' }}>
      Suggested contrast text color based on background:{' '}
      <strong
        style={{
          color: suggestedColor === '#ffffff' ? '#fff' : '#000',
          backgroundColor: suggestedColor === '#ffffff' ? '#000' : '#fff',
          padding: '2px 4px',
          borderRadius: '3px',
        }}
      >
        {suggestedColor} ({suggestedColor === '#ffffff' ? 'White' : 'Black'})
      </strong>
    </div>
  )
}
export default SuggestedTextColorInfo
