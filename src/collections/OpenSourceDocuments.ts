import type { CollectionConfig } from 'payload'

export const OpenSourceDocuments: CollectionConfig = {
  slug: 'open-source-documents',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', '_status', 'publishedDate', 'updatedAt'],
    description:
      'A collection of open-source documents, templates, and artifacts left over from Pixel Bakery.',
  },
  versions: {
    drafts: {
      autosave: true,
    },
    maxPerDoc: 10,
  },
  access: {
    read: () => true, // Publicly readable
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Document Title',
      localized: true,
    },
    {
      name: 'publishedDate',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
        },
        position: 'sidebar',
      },
      defaultValue: () => new Date().toISOString(),
    },
    {
      name: 'pb-artifact-category',
      type: 'relationship',
      relationTo: 'pb-artifact-categories',
      label: 'Category',
      hasMany: false,
      admin: {
        description: 'Categorize the document for easier filtering.',
      },
    },
    {
      name: 'pb-artifact-tag',
      type: 'relationship',
      relationTo: 'pb-artifact-tags',
      label: 'Tag',
      hasMany: true,
      admin: {
        description: 'Tag the document for easier filtering.',
      },
    },
    {
      name: 'shortDescription',
      type: 'textarea',
      required: false,
      label: 'Short Description',
      admin: {
        description: 'A brief summary of what this document/resource is about.',
      },
      maxLength: 300,
    },
    {
      name: 'resourceType',
      type: 'radio',
      label: 'Resource Type',
      options: [
        { label: 'File Upload', value: 'file' },
        { label: 'External Link', value: 'link' },
      ],
      defaultValue: 'file',
      admin: {
        layout: 'horizontal',
      },
    },
    {
      name: 'documentFile',
      label: 'Document File',
      type: 'upload',
      relationTo: 'media',
      admin: {
        condition: (_, siblingData) => siblingData.resourceType === 'file',
        description: 'Upload the document file (e.g., PDF, DOCX, template).',
      },
    },
    {
      name: 'documentLink',
      label: 'External Link',
      type: 'text', // URL field type could also be used if available and preferred
      admin: {
        condition: (_, siblingData) => siblingData.resourceType === 'link',
        description: 'Link to the document (e.g., Google Doc, Notion page, GitHub repo).',
      },
      validate: (val) => {
        if (val && typeof val === 'string' && !val.startsWith('http')) {
          return 'Please enter a valid URL (e.g., https://example.com)'
        }
        return true
      },
    },
  ],
}
