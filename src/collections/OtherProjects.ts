// src/collections/OtherProjects.ts

import type { CollectionConfig } from 'payload'
import {
  FixedToolbarFeature,
  HeadingFeature,
  LinkFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor,
  // BlocksFeature,
} from '@payloadcms/richtext-lexical'

export const languages = {
  ts: 'TypeScript',
  plaintext: 'Plain Text',
  tsx: 'TSX',
  js: 'JavaScript',
  jsx: 'JSX',
  yml: 'yaml',
  yaml: 'yaml',
}

export const OtherProjects: CollectionConfig = {
  slug: 'other-projects',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'projectType', '_status', 'updatedAt'],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100,
      },
    },
    maxPerDoc: 50,
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
            },
            {
              name: 'image',
              label: 'Main Image',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'description',
              type: 'textarea',
            },
            {
              type: 'richText',
              name: 'details',
              label: 'Details',
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    HeadingFeature({
                      enabledHeadingSizes: ['h2', 'h3', 'h4'],
                    }),
                    FixedToolbarFeature(),
                    InlineToolbarFeature(),
                    HorizontalRuleFeature(),
                    LinkFeature(),
                  ]
                },
              }),
            },
          ],
        },
        {
          label: 'Extra Content',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  type: 'checkbox',
                  name: 'enableExtraImages',
                  label: 'Enable Extra Images',
                  defaultValue: false,
                },
                {
                  type: 'checkbox',
                  name: 'enableWrittenContent',
                  label: 'Enable Extra Written Content',
                  defaultValue: false,
                },
              ],
            },
            {
              type: 'upload',
              relationTo: 'media',
              name: 'extraImages',
              hasMany: true,
              filterOptions: {
                mimeType: { contains: 'image' },
              },
              admin: {
                condition: (data, siblingData) => Boolean(siblingData?.enableExtraImages),
              },
            },
            {
              type: 'richText',
              name: 'extraRichTextContent',
              label: 'Extra Written Content',
              admin: {
                condition: (data, siblingData) => Boolean(siblingData?.enableWrittenContent),
              },
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    HeadingFeature({
                      enabledHeadingSizes: ['h2', 'h3', 'h4'],
                    }),
                    FixedToolbarFeature(),
                    InlineToolbarFeature(),
                    HorizontalRuleFeature(),
                    LinkFeature(),
                  ]
                },
              }),
            },
          ],
        },
      ],
    },
    {
      name: 'visibility',
      type: 'group',
      label: 'Visibility',
      admin: {
        position: 'sidebar',
      },
      fields: [
        {
          name: 'visibility-home',
          type: 'checkbox',
          label: 'Home Page',
          defaultValue: true,
          index: true,
        },
        {
          name: 'visibility-collection-page',
          type: 'checkbox',
          label: 'Collection Page',
          defaultValue: true,
          index: true,
        },
      ],
    },
    {
      name: 'projectLabel',
      label: 'Project Label',
      type: 'relationship',
      relationTo: 'labels',
      required: true,
      hasMany: false,
      validate: async (value, { operation }) => {
        console.log(`--- Validating projectLabel during ${operation} ---`)
        console.log('Value received:', value)
        console.log('Type of value:', typeof value)

        if (
          (value === null || typeof value === 'undefined' || value === '') &&
          operation !== 'delete'
        ) {
          console.error('Validation Failed: projectLabel is empty or undefined.')
          return 'Project Label is required.'
        }

        console.log('--- Validation Passed ---')
        return true
      },
      admin: {
        position: 'sidebar',
        components: {
          Field: './components/payload/LabelSelector.tsx',
          Cell: './components/payload/ProjectTypeCell.tsx',
        },
      },
    },
    {
      type: 'collapsible',
      label: 'Project Details',
      admin: {
        position: 'sidebar',
      },
      fields: [
        {
          name: 'pinned',
          type: 'checkbox',
          label: 'Pin this project',
        },
        {
          name: 'favorited',
          label: 'Favorited',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            position: 'sidebar',
            description: 'Mark this list as a favorite.',
          },
        },

        {
          name: 'projectLink',
          type: 'text',
          admin: {
            description: 'Link to the project (GitHub, etc.)',
          },
        },
      ],
    },
    {
      name: 'dateCompleted',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        position: 'sidebar',
      },
    },

    {
      name: 'tags',
      type: 'array',
      admin: {
        position: 'sidebar',
      },
      fields: [
        {
          name: 'tag',
          type: 'text',
        },
      ],
    },
    {
      name: 'slug',
      type: 'text',
      admin: {
        position: 'sidebar',
        description: 'URL-friendly version of the title (auto-generated if left blank)',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (!value && data?.title) {
              return data.title
                .toLowerCase()
                .replace(/[^\w\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-')
            }
            return value
          },
        ],
      },
    },
  ],
}

export default OtherProjects
