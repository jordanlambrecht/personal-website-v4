// src/payload.config.ts

import { postgresAdapter } from '@payloadcms/db-postgres'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import {
  Lists,
  Users,
  Media,
  ProductDesigns,
  OtherProjects,
  ProductFiles,
  Labels,
} from '@/collections'
import { getServerSideURL } from '@/utils/getURL'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [ProductDesigns, OtherProjects, ProductFiles, Users, Media, Lists, Labels],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
    migrationDir: path.resolve(dirname, 'migrations'),
    generateSchemaOutputFile: path.resolve(dirname, 'payload-generated-schema.ts'),
  }),
  sharp,
  cors: [getServerSideURL()].filter(Boolean),
  plugins: [
    seoPlugin({
      collections: ['product-designs', 'lists', 'other-projects'],
      uploadsCollection: 'media',
      generateTitle: ({ doc }) => `Website.com — ${doc.title}`,
      generateDescription: ({ doc }) => doc.excerpt,
    }),
    redirectsPlugin({
      collections: ['product-designs', 'lists', 'other-projects'],
      overrides: {
        fields: ({ defaultFields }) => {
          return [
            ...defaultFields,
            {
              type: 'text',
              name: 'customField',
            },
          ]
        },
      },
      redirectTypes: ['301', '302'],
      redirectTypeFieldOverride: {
        label: 'Redirect Type (Overridden)',
      },
    }),
  ],
  upload: {
    limits: {
      fileSize: 50000000, // 50MB
    },
  },
})
