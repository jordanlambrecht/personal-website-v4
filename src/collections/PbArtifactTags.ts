import type { CollectionConfig } from 'payload'

export const PbArtifactTags: CollectionConfig = {
  slug: 'pb-artifact-tags',
  admin: {
    useAsTitle: 'name',
    description: 'Manage tags for open source documents.',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Tag Name',
      unique: true,
    },
  ],
}
