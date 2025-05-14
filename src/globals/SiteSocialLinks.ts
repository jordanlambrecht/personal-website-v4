import { GlobalConfig } from 'payload'

const SiteSocialLinks: GlobalConfig = {
  slug: 'siteSocialLinks',
  label: 'Social Links',
  access: {
    read: () => true,
  },
  admin: {
    group: 'Micro-Content',
  },
  fields: [
    {
      name: 'socialLinks',
      label: 'Social Links',
      type: 'array',
      labels: {
        singular: 'Social Link',
        plural: 'Social Links',
      },
      admin: {
        description: 'Manage the list of current social links. Items can be reordered by dragging.',
        initCollapsed: true,
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'title',
              label: 'Title',
              type: 'text',
              required: true,
              admin: {
                width: '25%',
              },
            },
            {
              name: 'url',
              label: 'URL',
              type: 'text',
              required: true,
              admin: {
                width: '50%',
              },
            },
          ],
        },

        {
          type: 'row',
          admin: {
            width: '50%',
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
              name: 'targetBlank',
              label: 'Open in New Tab?',
              type: 'checkbox',
              required: true,
              defaultValue: true,
              admin: {
                width: '20%',
              },
            },
          ],
        },
      ],
    },
  ],
}

export default SiteSocialLinks
