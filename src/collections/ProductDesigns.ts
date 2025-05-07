// collections/ProductDesigns.ts
import type { CollectionConfig, CollectionBeforeChangeHook } from 'payload'
import {
  FixedToolbarFeature,
  HeadingFeature,
  LinkFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

const ensureProductDesignProjectType: CollectionBeforeChangeHook = async ({
  data,
  req,
  operation,
}) => {
  try {
    // --- Query the 'labels' collection ---
    const designTypeQuery = await req.payload.find({
      collection: 'labels',
      where: { name: { equals: 'Product Design' } },
      limit: 1,
      depth: 0,
    })

    if (designTypeQuery.docs.length > 0) {
      const designTypeId = designTypeQuery.docs[0].id
      console.log(`(${operation}) Setting projectType for Product Design to ID: ${designTypeId}`)
      data.projectType = designTypeId
    } else {
      console.error('CRITICAL: Could not find Label named "Product Design". Please create it.')
    }
  } catch (error) {
    console.error(`(${operation}) Error fetching/setting Label "Product Design":`, error)
  }
  return data // Return the modified data
}

export const ProductDesigns: CollectionConfig = {
  slug: 'product-design',
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
  hooks: {
    beforeChange: [ensureProductDesignProjectType],
    beforeValidate: [
      ({ data }) => {
        // Auto-generate slug from title if not provided
        if (!data.slug && data?.title) {
          data.slug = data.title
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
        }
        return data
      },
    ],
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
              required: true,
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
      type: 'collapsible',
      label: 'Links & Such',
      admin: {
        position: 'sidebar',
      },
      fields: [
        {
          name: 'pinned',
          label: 'Pin this design',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            position: 'sidebar',
            description: 'Pinned items appear first on the main page.',
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
          type: 'checkbox',
          name: 'enableMakerworld',
          label: 'Enable Makerworld',
          defaultValue: false,
        },
        {
          type: 'checkbox',
          name: 'enableDownload',
          label: 'Enable Download',
          defaultValue: false,
        },
        {
          type: 'checkbox',
          name: 'enablePurchase',
          label: 'Enable Buy',
          defaultValue: false,
        },
        {
          name: 'makerWorldLink',
          type: 'text',
          label: 'Makerworld Link',
          admin: {
            placeholder: 'enter a link to the Makerworld project',
            condition: (data, siblingData) => Boolean(siblingData?.enableMakerworld),
          },
        },
        {
          name: 'downloadLink',
          type: 'relationship',
          label: 'Download File',
          relationTo: 'product-files',
          admin: {
            description: 'Select a file from the Product Files collection',
            condition: (data, siblingData) => Boolean(siblingData?.enableDownload),
          },
        },
        {
          name: 'purchaseLink',
          type: 'text',
          label: 'Purchase Link',
          admin: {
            placeholder: 'enter a link to purchase this product',
            condition: (data, siblingData) => Boolean(siblingData?.enablePurchase),
          },
        },
      ],
    },

    // --- projectType field ---
    {
      name: 'projectType',
      label: 'Project Type',
      type: 'relationship',
      relationTo: 'labels',
      required: false, // Keep false
      admin: {
        readOnly: true,
        position: 'sidebar',
        description: 'Automatically assigned to the "Product Design" type.',
      },
    },

    {
      name: 'datePublished',
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
    },
  ],
}

export default ProductDesigns
