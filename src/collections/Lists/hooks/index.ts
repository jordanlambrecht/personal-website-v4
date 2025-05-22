import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  CollectionBeforeChangeHook,
} from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { List } from '@/payload-types'

export const revalidateList: CollectionAfterChangeHook<List> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      const path = `/lists/${doc.slug}`

      payload.logger.info(`Revalidating post at path: ${path}`)

      revalidatePath(path)
      revalidateTag('posts-sitemap')
    }

    // If the post was previously published, we need to revalidate the old path
    if (previousDoc._status === 'published' && doc._status !== 'published') {
      const oldPath = `/posts/${previousDoc.slug}`

      payload.logger.info(`Revalidating old post at path: ${oldPath}`)

      revalidatePath(oldPath)
      revalidateTag('posts-sitemap')
    }
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<List> = ({ doc, req: { context } }) => {
  if (!context.disableRevalidate) {
    const path = `/lists/${doc?.slug}`

    revalidatePath(path)
    revalidateTag('posts-sitemap')
  }

  return doc
}

export const ensureListProjectType: CollectionBeforeChangeHook = async ({
  data,
  req,
  operation,
}) => {
  try {
    const listTypeQuery = await req.payload.find({
      collection: 'labels',
      where: { name: { equals: 'List' } },
      limit: 1,
      depth: 0,
    })

    if (listTypeQuery.docs.length > 0) {
      const listTypeId = listTypeQuery.docs[0].id
      // console.log(`(${operation}) Setting projectType for List to ID: ${listTypeId}`)
      data.projectType = listTypeId
    } else {
      console.error('CRITICAL: Could not find ProjectType named "List". Please create it.')
      throw new Error('ProjectType "List" is mandatory.')
    }
  } catch (error) {
    console.error(`(${operation}) Error fetching/setting ProjectType "List":`, error)
    throw new Error('Failed to set ProjectType due to an error.')
  }
  return data
}
