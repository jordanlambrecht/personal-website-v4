// src/collections/Lists.ts

import type { CollectionConfig, CollectionBeforeChangeHook } from 'payload'
import {
  FixedToolbarFeature,
  HeadingFeature,
  LinkFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

const ensureListProjectType: CollectionBeforeChangeHook = async ({ data, req, operation }) => {
  try {
    const listTypeQuery = await req.payload.find({
      collection: 'labels',
      where: { name: { equals: 'List' } },
      limit: 1,
      depth: 0,
    })

    if (listTypeQuery.docs.length > 0) {
      const listTypeId = listTypeQuery.docs[0].id
      console.log(`(${operation}) Setting projectType for List to ID: ${listTypeId}`)
      data.projectType = listTypeId
    } else {
      console.error('CRITICAL: Could not find ProjectType named "List". Please create it.')
      throw new Error('ProjectType "List" is mandatory.')
    }
  } catch (error) {
    console.error(`(${operation}) Error fetching/setting ProjectType "List":`, error)
    throw new Error('Failed to set ProjectType due to an error.')
  }
  return data
}

export const Lists: CollectionConfig = {
  slug: 'lists',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt', 'pinned', 'favorited', 'emoji'],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 30000,
      },
    },
    maxPerDoc: 15,
  },
  access: {
    read: () => true,
  },
  hooks: {
    beforeChange: [ensureListProjectType],
    // afterChange: [revalidatePost],
    // afterDelete: [revalidateDelete],
  },
  fields: [
    {
      name: 'emoji',
      label: 'Icon Emoji',
      type: 'text',
      maxLength: 4,
      admin: {
        description: 'Optional: An emoji to display as an icon.',
        width: '20%',
      },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        width: '50%',
      },
    },
    {
      name: 'subheader',
      type: 'text',
      required: false,
      admin: {
        width: '50%',
      },
    },
    {
      type: 'richText',
      name: 'things',
      label: 'things',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({
              enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'],
            }),

            FixedToolbarFeature(),
            InlineToolbarFeature(),
            HorizontalRuleFeature(),
            LinkFeature(),
          ]
        },
      }),
    },
    {
      type: 'tabs',
      tabs: [
        {
          name: 'content',
          fields: [],
        },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        position: 'sidebar',
      },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) => {
            if (siblingData._status === 'published' && !value) {
              return new Date()
            }
            return value
          },
        ],
      },
    },
    {
      name: 'images',
      type: 'relationship',
      relationTo: 'media',
      required: false,
    },
    {
      name: 'pinned',
      label: 'Pinned',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Pinned lists may be displayed more prominently.',
      },
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
      name: 'projectType',
      type: 'relationship',
      relationTo: 'labels',
      required: false, // Keep false
      admin: {
        readOnly: true,
        position: 'sidebar',
        description: 'Automatically assigned to the "List" project type.',
      },
    },
  ],
}
