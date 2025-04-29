// collections/ProductFiles.ts
import type { CollectionConfig } from 'payload'

export const ProductFiles: CollectionConfig = {
  slug: 'product-files',
  admin: {
    useAsTitle: 'name',
    description: 'Downloadable files for products',
  },
  access: {
    read: () => true,
  },
  upload: {
    staticDir: 'product-files',
    mimeTypes: [
      'application/zip',
      'application/x-zip-compressed',
      'application/octet-stream',
      'model/stl',
      'application/x-stl',
      'model/gltf+json',
      'model/gltf-binary',
    ],
    adminThumbnail: 'thumbnail',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'fileDescription',
      type: 'textarea',
      label: 'File Description',
    },
    {
      name: 'fileSize',
      type: 'number',
      label: 'File Size (in KB)',
      admin: {
        description: 'Size of the file in kilobytes',
      },
    },
    {
      name: 'fileType',
      type: 'select',
      options: [
        { label: 'STL', value: 'stl' },
        { label: 'GLTF', value: 'gltf' },
        { label: 'GLB', value: 'glb' },
        { label: 'ZIP', value: 'zip' },
        { label: 'Other', value: 'other' },
      ],
      admin: {
        description: 'Type of file being uploaded',
      },
      defaultValue: 'stl',
    },
  ],
}

export default ProductFiles
