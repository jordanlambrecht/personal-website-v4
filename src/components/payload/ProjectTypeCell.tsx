import React from 'react'
import type { DefaultServerCellComponentProps } from 'payload' // Use correct import path

const ProjectTypeCell = (props: DefaultServerCellComponentProps) => {
  const { cellData } = props

  // cellData might be the ID (if depth=0) or the full Label object (if depth > 0)
  if (typeof cellData === 'object' && cellData !== null && 'name' in cellData) {
    // If it's the populated object, render the name
    return <span>{cellData.name}</span>
  }

  // If it's just the ID or null/undefined, render '-' or the ID itself
  return <span>{cellData?.toString() || '-'}</span>
}

export default ProjectTypeCell
