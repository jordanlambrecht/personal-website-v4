import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { seoPlugin } from '@payloadcms/plugin-seo'

import { Plugin } from 'payload'

import { revalidateRedirects } from '@/hooks/revalidateRedirects'
import { GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types'
import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs'
import type { ProductDesign, OtherProject, OpenSourceDocument, List } from '@/payload-types'
import { getServerSideURL } from '@/utils/getURL'

const generateTitle: GenerateTitle<ProductDesign | List | OtherProject | OpenSourceDocument> = ({
  doc,
}) => {
  return doc?.title ? `${doc.title} | Payload Website Template` : 'Payload Website Template'
}

const generateURL: GenerateURL<ProductDesign | OtherProject | OpenSourceDocument | List> = ({
  doc,
  collectionConfig, // Add collectionConfig to the destructured arguments
}) => {
  const baseUrl = getServerSideURL()
  if (doc?.slug && collectionConfig?.slug) {
    // Construct the URL with the collection slug and document slug
    return `${baseUrl}/${collectionConfig.slug}/${doc.slug}`
  }
  return baseUrl // Fallback to base URL if slugs are missing
}

export const plugins: Plugin[] = [
  seoPlugin({
    generateURL,
    collections: ['product-design', 'lists', 'other-projects', 'open-source-documents'],
    uploadsCollection: 'media',
    generateTitle,
    generateDescription: ({ doc }) => doc.excerpt, // Ensure 'excerpt' exists on all these doc types
  }),
  nestedDocsPlugin({
    collections: ['product-design'],
    generateURL: (docs) => docs.reduce((url, doc) => `${url}/${doc.slug}`, ''),
  }),
  redirectsPlugin({
    collections: ['product-design', 'lists', 'other-projects'],
    overrides: {
      // @ts-expect-error - This is a valid override, mapped fields don't resolve to the same type
      fields: ({ defaultFields }) => {
        return defaultFields.map((field) => {
          if ('name' in field && field.name === 'from') {
            return {
              ...field,
              admin: {
                description: 'You will need to rebuild the website when changing this field.',
              },
            }
          }
          return field
        })
      },
    },
    hooks: {
      afterChange: [revalidateRedirects],
    },
    redirectTypes: ['301', '302'],
    redirectTypeFieldOverride: {
      label: 'Redirect Type (Overridden)',
    },
  }),
]
