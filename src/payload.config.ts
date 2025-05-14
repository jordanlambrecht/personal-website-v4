// src/payload.config.ts
import { s3Storage } from '@payloadcms/storage-s3'
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
  PbArtifactCategories,
  ProductFiles,
  OpenSourceDocuments,
  Labels,
  PbArtifactTags,
} from '@/collections'
import { SiteSettings } from '@/globals/SiteSettings'
import { getServerSideURL } from '@/utils/getURL'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Check if 'generate:types' is in the command line arguments
const isGeneratingTypes = process.argv.includes('generate:types')

// Define the string prefix to be used in the S3 plugin configuration.
// This acts as a default if the hook in Media.ts doesn't set `doc.prefix`,
// and ensures `generate:types` receives a string.
const s3CollectionConfigPrefix = isGeneratingTypes ? 'placeholder_for_types/' : 'uploads_default/'

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  globals: [SiteSettings],
  collections: [
    ProductDesigns,
    OtherProjects,
    ProductFiles,
    Users,
    Media,
    Lists,
    Labels,
    PbArtifactCategories,
    PbArtifactTags,
    OpenSourceDocuments,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET,
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
    s3Storage({
      collections: {
        media: {
          prefix: s3CollectionConfigPrefix,
        },
      },
      bucket: process.env.S3_BUCKET!,
      config: {
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID!,
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
        },
        region: process.env.S3_REGION!,
      },
    }),
    seoPlugin({
      collections: ['product-design', 'lists', 'other-projects'],
      uploadsCollection: 'media',
      generateTitle: ({ doc }) => `Website.com — ${doc.title}`,
      generateDescription: ({ doc }) => doc.excerpt,
    }),
    redirectsPlugin({
      collections: ['product-design', 'lists', 'other-projects'],
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
