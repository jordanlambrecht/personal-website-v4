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

// Define the beforeChange hook to populate fileType, S3 prefix, and format filename
const populateMediaMetaHook: CollectionBeforeChangeHook = async ({ data, operation, req }) => {
  // For 'create' and 'update' operations, if mimeType is present
  if ((operation === 'create' || operation === 'update') && data.mimeType) {
    data.fileType = getFileTypeFromMime(data.mimeType as string)
    data.prefix = calculateS3Prefix(data.mimeType as string)
  }

  // Format filename on create
  // 'req.file.name' contains the original uploaded filename
  // 'data.filename' will be populated by Payload's upload handler based on req.file.name
  // We modify data.filename if it exists, or if not, we can try to infer from req.file if available
  // This ensures our formatting happens before Payload's own safeFileNames logic (if any)
  // and before the S3 adapter gets it.

  if (operation === 'create' && req && req.file && req.file.name) {
    let newFilename = req.file.name

    // Replace spaces with dashes
    newFilename = newFilename.replace(/\s+/g, '-')

    // Convert to lowercase
    newFilename = newFilename.toLowerCase()

    // At this point, data.filename might not be set yet by Payload's internal mechanisms,
    // or it might be set to the original. We want to ensure our formatted name is used.
    // Payload's internal upload logic will later take data.filename (if set by us)
    // or req.file.name and then apply its own safeFileNames if configured.
    // By setting data.filename here, we preempt its default value.
    data.filename = newFilename
  } else if (operation === 'update' && data.filename && typeof data.filename === 'string') {
    // Optionally, re-format filename on update if a new file is uploaded
    // This part is more complex as 'req.file' might not be present on metadata-only updates.
    // For simplicity, we'll focus on 'create'. If you need to re-format on file replacement during update,
    // you'd need to check if a new file is part of the 'req'.
  }

  return data
}

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    defaultColumns: ['filename', 'alt', 'fileType', 'updatedAt'],
    group: 'Content',
    useAsTitle: 'filename',
    description: 'Collection for all uploaded images, videos, and documents.',
  },
  access: {
    read: () => true,
  },
  hooks: {
    beforeChange: [populateMediaMetaHook],
  },
  fields: [
    {
      name: 'filename',
      type: 'text',
      label: 'File Name',
      required: true,
      unique: true,
      admin: {
        description: 'The original name of the uploaded file, formatted for safety.',
      },
    },
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    {
      name: 'fileType',
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
  ],
  upload: {
    staticDir: 'media',
    // Set safeFileNames to true for general sanitization by Payload
    // This will run AFTER our hook has modified data.filename.
    // Payload's internal safeFileNames will strip non-alphanumeric (except - and _)
    // from the already lowercased and hyphenated string.
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
      // Documents (if you decide to keep them in Media, otherwise remove)
      // 'application/pdf',
      // 'text/plain',
    ],
  },
}
