import type { CollectionConfig } from 'payload'

export const Links: CollectionConfig = {
  slug: 'links',
  defaultPopulate: {
    url: true,
  },
  admin: {
    useAsTitle: 'title',
    description: 'Manage links.',
    group: 'Content',
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Link Title',
      localized: true,
    },
    {
      name: 'url',
      type: 'text',
      required: true,
      label: 'Link URL',
      admin: {
        description: 'The URL of the link.',
      },
      validate: (val) => {
        if (val && typeof val === 'string' && !val.startsWith('http')) {
          return 'Please enter a valid URL (e.g., https://example.com)'
        }
        return true
      },
    },
    {
      name: 'usedInOpenSourceDocuments',
      type: 'join',
      collection: 'open-source-documents',
      on: 'documentLink',
      label: 'Used In Open Source Documents',
      orderable: true,
      admin: {
        description: 'Shows which Open Source Documents use this link.',
      },
    },
  ],
}
