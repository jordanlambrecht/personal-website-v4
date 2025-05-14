import type { CollectionConfig, CollectionBeforeChangeHook } from 'payload'

// Helper function to generate a title from a filename
const generateTitleFromFilename = (filename?: string): string | undefined => {
  if (!filename) return undefined

  // Remove file extension
  const nameWithoutExtension = filename.split('.').slice(0, -1).join('.')
  if (!nameWithoutExtension) return undefined // Handle cases like ".bashrc"

  // Replace hyphens and underscores with spaces, then capitalize words
  const title = nameWithoutExtension
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
  return title
}

// Define the beforeChange hook
const populateMediaMetaHook: CollectionBeforeChangeHook = async ({ data, operation }) => {
  // For 'create' operation, if filename is present and title is not already set
  // Note: 'data.filename' is populated by Payload's upload handler *before* this hook runs for 'create'.
  // For 'update' with a new file, 'req.file.name' might be more reliable if 'data.filename' isn't updated yet.
  // However, for simplicity and common 'create' case, we'll use data.filename.
  if (operation === 'create' && data.filename && !data.title) {
    data.title = generateTitleFromFilename(data.filename as string)
  }

  return data
}

export const Docs: CollectionConfig = {
  slug: 'docs',
  admin: {
    useAsTitle: 'title', // Use the new 'title' field as the display title in admin
    defaultColumns: ['title', 'filename', 'fileType', 'updatedAt'], // Added 'title'
    group: 'Content',
    description: 'Collection for all uploaded documents.', // Updated description
  },
  access: {
    read: () => true,
  },
  hooks: {
    beforeChange: [populateMediaMetaHook],
  },
  fields: [
    {
      name: 'title', // NEW title field
      type: 'text',
      label: 'Title',
      admin: {
        description: 'A human-readable title for the document. Defaults to a formatted filename.',
      },
    },
    {
      name: 'filename', // Payload populates this automatically on upload
      type: 'text',
      label: 'File Name',
      required: true, // This is usually set by Payload's upload feature
      unique: true, // This is usually set by Payload's upload feature
      admin: {
        description: 'The original name of the uploaded file.',
        readOnly: true, // Often good to make this read-only after initial upload
      },
    },

    {
      name: 'usedInOpenSourceDocuments',
      type: 'join',
      collection: 'open-source-documents',
      on: 'documentFile',
      label: 'Used In Open Source Documents',
      admin: {
        description: 'Shows which Open Source Documents use this document.',
      },
    },
  ],
  upload: {
    staticDir: 'docs', // This is for local storage if S3 is not used/fails.
    // S3 plugin will handle the actual cloud storage.
    mimeTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'text/plain',
      'text/csv',
    ],
    // If you want the generated title to also affect the filename on S3,
    // you would need a more complex hook or to use the 'admin.useAsTitle'
    // in conjunction with how the S3 adapter might use it, but that's less direct.
    // The current approach sets a metadata title, not the stored filename.
  },
}
