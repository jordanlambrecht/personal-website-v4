import type { CollectionConfig } from 'payload'

export const PbArtifactTags: CollectionConfig = {
  slug: 'pb-artifact-tags',
  labels: {
    singular: 'PB Artifact Tag',
    plural: 'PB Artifact Tags',
  },
  admin: {
    useAsTitle: 'name',
    description: 'Manage tags for open source documents.',
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
      label: 'Tag Name',
      unique: true,
    },
    {
      name: 'usedInOpenSourceDocuments',
      type: 'join',
      collection: 'open-source-documents',
      on: 'pb-artifact-tag',
      label: 'Used In Open Source Documents',
      admin: {
        description: 'Shows which Open Source Documents use this tag.',
      },
    },
  ],
}
