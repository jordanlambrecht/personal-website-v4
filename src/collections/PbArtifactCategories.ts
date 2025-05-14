import type { CollectionConfig } from 'payload'

export const PbArtifactCategories: CollectionConfig = {
  slug: 'pb-artifact-categories',
  admin: {
    useAsTitle: 'name',
    description: 'Manage categories for open source documents.',
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
  ],
}
