import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'siteSettings',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'maintenanceMode',
      type: 'checkbox',
      label: 'Enable Maintenance Mode (Site-wide Banner)',
      defaultValue: false,
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Collection Visibility',
          fields: [
            {
              name: 'showPixelBakery',
              type: 'checkbox',
              label: 'Show Pixel Bakery Section',
              defaultValue: true,
            },
            {
              name: 'showProductDesigns',
              type: 'checkbox',
              label: 'Show Product Designs Section',
              defaultValue: true,
            },
            {
              name: 'showOtherProjects',
              type: 'checkbox',
              label: 'Show Other Projects Section',
              defaultValue: true,
            },
            {
              name: 'showLists',
              type: 'checkbox',
              label: 'Show Lists Section',
              defaultValue: true,
            },
            // Add more toggles here for other future collections/sections
            // e.g., showBlog, showPortfolio, etc.
          ],
        },
        // You can add other tabs for different site-wide settings later
      ],
    },
  ],
}
