// src/collections/Labels.ts

import type { CollectionConfig } from 'payload'
import { colorPickerField } from '@innovixx/payload-color-picker-field'

export const Labels: CollectionConfig = {
  slug: 'labels',
  admin: {
    useAsTitle: 'name',
    description: 'Manage category labels.',
    group: 'Organization',
    defaultColumns: ['name', 'bgColor', 'textColor'],
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'name',
          type: 'text',
          label: 'Category Name',
          required: true,
          index: true,
          unique: true,
          admin: {
            width: '50%',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'colorLabelName',
          type: 'text',
          label: 'Friendly Color Label Name',
          admin: {
            width: '50%',
            description: 'A human-readable name for this color scheme (e.g., "Primary Blue").',
          },
          required: false,
        },
      ],
    },
    {
      type: 'row',
      fields: [
        colorPickerField({
          name: 'bgColor',
          label: 'Background Color',
          required: true,
          admin: {
            width: '21.5%',
            description: 'Select the background color for labels/tags.',
            components: {
              Cell: './components/payload/ColorCell.tsx',
            },
          },
        }),
        colorPickerField({
          name: 'textColor',
          label: 'Text Color',
          required: false,
          admin: {
            width: '25%',
            style: { marginLeft: '4%' },
            components: {
              Cell: './components/payload/ColorCell.tsx',
            },
            description: 'Select the text color for labels/tags (ensure contrast with background).',
          },
        }),
      ],
    },
  ],
} as CollectionConfig
