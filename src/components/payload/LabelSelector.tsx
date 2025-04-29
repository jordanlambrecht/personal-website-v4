// src/components/payload/LabelSelector.tsx

'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useField } from '@payloadcms/ui'
import { getContrastTextColor } from './accessibilityHelpers'
import type { Label as GeneratedProjectType } from '../../payload-types'

type CustomFieldProps = {
  path: string
  label?: string
}

export const LabelSelector: React.FC<CustomFieldProps> = ({ path, label: fieldLabel }) => {
  const { value, setValue } = useField<string | null>({ path })
  const [Labels, setLabels] = useState<GeneratedProjectType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchLabels = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await fetch('/api/labels?limit=100&depth=0&sort=name')
        if (!response.ok) {
          throw new Error(`API Error: ${response.statusText}`)
        }
        const data = await response.json()
        if (data && Array.isArray(data.docs)) {
          setLabels(data.docs as GeneratedProjectType[])
        } else {
          throw new Error('Unexpected API response structure.')
        }
      } catch (err) {
        console.error('Error fetching Labels:', err)
        setError(`Failed to load Labels: ${err.message}`)
      } finally {
        setIsLoading(false)
      }
    }
    fetchLabels()
  }, [])

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const selectedId = e.target.value
      setValue(selectedId || null)
    },
    [setValue],
  )

  if (isLoading) {
    return (
      <div>
        <label htmlFor={path}>{fieldLabel || 'Label'}</label>
        <select id={path} disabled style={{ width: '100%' }}>
          <option>Loading types...</option>
        </select>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <label htmlFor={path}>{fieldLabel || 'Label'}</label>
        <div style={{ color: 'red' }}>{error}</div>
      </div>
    )
  }

  const selectedProjectType = Labels.find((pt) => pt.id.toString() === value)
  const selectBgColor = selectedProjectType?.bgColor || '#ffffff'
  const selectTextColor =
    selectedProjectType?.textColor ||
    getContrastTextColor(selectBgColor.startsWith('#') ? selectBgColor : '#ffffff')

  return (
    <div>
      <label htmlFor={path}>{fieldLabel || 'Label'}</label>
      <select
        id={path}
        value={value || ''}
        onChange={handleChange}
        style={{
          backgroundColor: selectBgColor,
          color: selectTextColor,
          width: '100%',
          padding: '8px 12px',
          border: '1px solid #ccc',
          borderRadius: '4px',
        }}
      >
        <option value="" style={{ backgroundColor: '#ffffff', color: '#000000' }}>
          -- Select Type --
        </option>
        {Labels.map((type) => {
          const optionBgColor = type.bgColor || '#ffffff'
          const optionTextColor =
            type.textColor ||
            getContrastTextColor(optionBgColor.startsWith('#') ? optionBgColor : '#ffffff')
          const label = type.name

          return (
            <option
              key={type.id}
              value={type.id.toString()}
              style={{
                backgroundColor: optionBgColor,
                color: optionTextColor,
              }}
            >
              {label}
            </option>
          )
        })}
      </select>
    </div>
  )
}

export default LabelSelector
