import type { CollectionConfig } from 'payload'

export const PbArtifactCategories: CollectionConfig = {
  slug: 'pb-artifact-categories',
  admin: {
    useAsTitle: 'name',
    description: 'Manage categories for open source documents.',
    group: 'Organization',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Category Name',
      unique: true,
    },
    {
      name: 'usedInOpenSourceDocuments',
      type: 'join',
      collection: 'open-source-documents',
      on: 'pb-artifact-category',
      label: 'Used In Open Source Documents',
      admin: {
        description: 'Shows which Open Source Documents use this category.',
      },
    },
  ],
}
