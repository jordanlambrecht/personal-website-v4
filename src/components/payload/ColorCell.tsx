//  src/components/payload/ColorCell.tsx

import { DefaultServerCellComponentProps } from 'payload'
import React from 'react'
import { getContrastTextColor } from './accessibilityHelpers'

const ColorCell = ({ cellData, rowData, field }: DefaultServerCellComponentProps) => {
  if ('name' in field && field.name === 'textColor') {
    if (!cellData || typeof cellData !== 'string' || cellData.trim() === '') {
      return (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#666',
          }}
        >
          <div
            style={{
              width: '16px',
              height: '16px',
              borderRadius: '3px',
              border: '1px solid #ccc',
              position: 'relative',
              backgroundColor: 'none',
            }}
            title="No text color defined"
          >
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '0',
                right: '0',
                height: '1px',
                backgroundColor: 'red',
                transform: 'rotate(-45deg)',
                transformOrigin: 'center',
              }}
            ></div>
          </div>
          <span>None</span>
        </div>
      )
    }

    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div
          style={{
            width: '16px',
            height: '16px',
            backgroundColor: cellData,
            borderRadius: '3px',
            border: '1px solid #ccc',
          }}
          title={cellData}
        />
        <span>{cellData}</span>
      </div>
    )
  }

  // Handle bgColor
  if (!cellData || typeof cellData !== 'string') {
    return null
  }

  const colorBlockTextColor = rowData?.textColor || getContrastTextColor(cellData)
  const colorBlockLabelText = rowData?.colorLabelName || cellData

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'start',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          height: '25px',
          backgroundColor: cellData,
          padding: '5px 10px',
          display: 'flex',
          width: '100%',
          maxWidth: '200px',
          overflow: 'hidden',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '3px',
        }}
        title={`Background: ${cellData}\nText: ${colorBlockTextColor}`}
      >
        <span
          style={{
            color: colorBlockTextColor,
          }}
        >
          {colorBlockLabelText}
        </span>
      </div>
    </div>
  )
}

export default ColorCell
