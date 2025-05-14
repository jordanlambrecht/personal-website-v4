import type { CollectionConfig, CollectionBeforeChangeHook } from 'payload'

// Helper function to determine file type
const getFileTypeFromMime = (mimeType?: string): string => {
  if (!mimeType) return 'general'
  if (mimeType.startsWith('image/')) return 'image'
  if (mimeType.startsWith('video/')) return 'video'
  const documentTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain',
    'text/csv',
  ]
  if (documentTypes.includes(mimeType) || mimeType.startsWith('application/vnd')) {
    return 'document'
  }
  return 'general'
}

// Helper function to determine S3 object prefix from mimeType
const calculateS3Prefix = (mimeType?: string): string => {
  if (!mimeType) return 'general/' // Default prefix
  if (mimeType.startsWith('image/')) return 'images/'
  if (mimeType.startsWith('video/')) return 'videos/'
  const documentTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain',
    'text/csv',
  ]
  if (documentTypes.includes(mimeType) || mimeType.startsWith('application/vnd')) {
    return 'docs/'
  }
  return 'uploads/' // Fallback prefix for other types
}

// Define the beforeChange hook to populate fileType and the S3 prefix
const populateMediaMetaHook: CollectionBeforeChangeHook = async ({ data, operation }) => {
  if ((operation === 'create' || operation === 'update') && data.mimeType) {
    // Populate fileType
    data.fileType = getFileTypeFromMime(data.mimeType as string)

    // Populate the 'prefix' field for S3 storage
    // The s3Storage plugin will look for a field named 'prefix' on the document.
    data.prefix = calculateS3Prefix(data.mimeType as string)
  }
  return data
}

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    defaultColumns: ['filename', 'alt', 'fileType', 'updatedAt'],
    group: 'Content',
    description: 'Collection for all uploaded images, videos, and documents.',
  },
  access: {
    read: () => true,
  },
  hooks: {
    beforeChange: [
      populateMediaMetaHook, // This hook now handles both fileType and prefix
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    {
      name: 'fileType', // This field is still useful for display/filtering in Admin UI
      type: 'select',
      label: 'File Type',
      options: [
        { label: 'Image', value: 'image' },
        { label: 'Video', value: 'video' },
        { label: 'Document', value: 'document' },
        { label: 'General', value: 'general' },
      ],
      admin: {
        readOnly: true,
        position: 'sidebar',
        description: 'Automatically determined based on the uploaded file.',
      },
    },

    // Our hook will populate `data.prefix`, and this value will be saved to that field.
  ],
  upload: {
    staticDir: 'media',
    mimeTypes: [
      // Images
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/svg+xml',
      'image/webp',
      // Videos
      'video/webm',
      'video/mp4',
      // Documents
      'application/pdf',
      'application/msword', // .doc
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
      'application/vnd.ms-excel', // .xls
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-powerpoint', // .ppt
      'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
      'text/plain', // .txt
      'text/csv', // .csv
    ],
  },
}
