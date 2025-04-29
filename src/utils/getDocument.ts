// /src/utils/getDocument.ts
import { getPayload, CollectionSlug } from 'payload'
import config from '@/payload.config'

type GetDocumentsOptions = {
  collection: CollectionSlug
  limit?: number
  page?: number
  sort?: string
  where?: Record<string, unknown>
  depth?: number
}

export const getDocument = async <T>({
  collection,
  id,
  depth = 1,
}: {
  collection: CollectionSlug
  id: string
  depth?: number
}): Promise<T | null> => {
  try {
    const payload = await getPayload({ config })
    const doc = await payload.findByID({
      collection,
      id,
      depth,
    })

    return doc as T
  } catch (error) {
    console.error(`Error fetching document ${id} from ${collection}:`, error)
    return null
  }
}

export async function getDocuments<T>(
  options: GetDocumentsOptions,
): Promise<{ docs: T[]; hasNextPage: boolean; totalDocs: number }> {
  try {
    const payload = await getPayload({ config })
    const { collection, limit, page, sort, where, depth } = options
    const response = await payload.find({
      collection,
      limit,
      page,
      sort,
      where,
      depth,
    })

    return {
      docs: response.docs as T[],
      totalDocs: response.totalDocs,
      hasNextPage: response.hasNextPage,
    }
  } catch (error) {
    console.error(`Error fetching documents from ${options.collection}:`, error)
    return {
      docs: [],
      totalDocs: 0,
      hasNextPage: false,
    }
  }
}
