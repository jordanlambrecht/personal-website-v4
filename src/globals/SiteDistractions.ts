import { GlobalConfig } from 'payload'

const SiteDistractions: GlobalConfig = {
  slug: 'siteDistractions',
  label: 'Distractions',
  access: {
    read: () => true,
  },
  admin: {
    group: 'Micro-Content',
  },
  fields: [
    {
      name: 'distractionItems',
      label: 'Distraction Items',
      type: 'array',
      labels: {
        singular: 'Distraction',
        plural: 'Distractions',
      },
      admin: {
        description: 'Manage the list of current distractions. Items can be reordered by dragging.',
        initCollapsed: true,
      },
      fields: [
        {
          name: 'active',
          label: 'Active?',
          type: 'checkbox',
          required: true,
          defaultValue: true,
          admin: {
            width: '20%',
          },
        },
        {
          type: 'row',
          fields: [
            {
              name: 'icon',
              label: 'Icon (Emoji)',
              type: 'text',
              admin: {
                description: 'Example: 🐳, ⚛️, 🐈',
                width: '10%',
              },
            },
            {
              name: 'text',
              label: 'Text / Description',
              type: 'text',
              required: true,
              admin: {
                width: '60%',
              },
            },
          ],
        },
        {
          name: 'photoLinks',
          label: 'Photo Links (Optional)',
          type: 'array',
          admin: {
            initCollapsed: true,
          },
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'linkText',
                  label: 'Link Text',
                  type: 'text',
                  required: true,
                  admin: {
                    width: '25%',
                  },
                },
                {
                  name: 'imageFilename',
                  label: 'Image Filename',
                  type: 'text',
                  admin: {
                    width: '35%',
                    description:
                      'The filename of the image (e.g., my-cat.jpg). Images should be placed in the public/images/ folder.',
                  },
                  required: true,
                },
                {
                  name: 'caption',
                  label: 'Image Caption',
                  type: 'text',
                  required: true,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}

export default SiteDistractions
