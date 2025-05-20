import type { Metadata } from 'next'

import type { Media, Config, OtherProject, ProductDesign, List } from '@/payload-types'

import { mergeOpenGraph } from '@/utils/mergeOpenGraph'
import { getServerSideURL } from '@/utils/getURL'

const getImageURL = (image?: Media | Config['db']['defaultIDType'] | null) => {
  const serverUrl = getServerSideURL()

  let url = serverUrl + '/website-template-OG.webp' // TODO: need to update default image

  if (image && typeof image === 'object' && 'url' in image) {
    const ogUrl = 'sizes' in image && (image.sizes as { og?: { url?: string } })?.og?.url

    url = ogUrl ? serverUrl + ogUrl : serverUrl + image.url
  }

  return url
}

export const generateMeta = async (args: {
  doc: Partial<OtherProject> | Partial<ProductDesign> | Partial<List>
}): Promise<Metadata> => {
  const { doc } = args || {}

  const imageSource = 'images' in doc ? doc.images : 'image' in doc ? doc.image : null
  const ogImage = getImageURL(imageSource)

  const titleBase = doc?.title

  const title = titleBase
    ? titleBase + ' | Jordan Lambrecht'
    : 'Jordan Lambrecht | Creative Leader & Strategist'

  const description = 'description' in doc ? doc.description : undefined

  const path =
    'slug' in doc && doc.slug && 'collection' in doc
      ? `/${doc.collection}/${doc.slug}`
      : 'slug' in doc
        ? `/${doc.slug}`
        : '/'
  return {
    description:
      description ||
      'Hi, I&apos;m Jordan Lambrecht, a creative leader and strategist from the Midwest.',
    openGraph: mergeOpenGraph({
      description:
        description ||
        'Hi, I&apos;m Jordan Lambrecht, a creative leader and strategist from the Midwest.',
      images: ogImage
        ? [
            {
              url: ogImage,
            },
          ]
        : undefined,
      title,
      url: path,
    }),
    title,
  }
}
