// src/collections/Lists.ts

import type { CollectionConfig } from 'payload'
import {
  FixedToolbarFeature,
  HeadingFeature,
  LinkFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { slugField } from '@/fields/slug'
import { revalidateDelete, revalidateList, ensureListProjectType } from './hooks'

export const Lists: CollectionConfig = {
  slug: 'lists',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'emoji', 'slug', 'updatedAt', 'pinned', 'favorited'],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 30000,
      },
      schedulePublish: true,
    },
    maxPerDoc: 15,
  },
  access: {
    read: () => true,
  },
  hooks: {
    beforeChange: [ensureListProjectType],
    afterChange: [revalidateList],
    afterDelete: [revalidateDelete],
  },
  fields: [
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
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        width: '50%',
      },
    },
    {
      name: 'images',
      type: 'relationship',
      relationTo: 'media',
      required: false,
    },
    {
      type: 'tabs',
      tabs: [
        {
          name: 'content',
          fields: [
            {
              name: 'emoji',
              label: 'Icon Emoji',
              type: 'text',
              admin: {
                description: 'Optional: An emoji to display as an icon.',
                width: '20%',
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
          ],
        },
      ],
    },
    {
      type: 'group',
      label: 'sorting',
      name: 'sorting',
      admin: {
        position: 'sidebar',
      },
      fields: [
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
    ...slugField(),
  ],
}
