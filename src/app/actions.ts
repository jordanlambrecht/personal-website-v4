'use server'

import { getDocuments } from '@/utils/getDocument'
import { ProductDesign, OtherProject, List, Label } from '@/payload-types'
import type { UnifiedProject } from '@/app/(frontend)/page'

export async function fetchProjectsPage(
  page: number = 1,
  limit: number = 20,
  labelId?: number | null,
): Promise<{ projects: UnifiedProject[]; hasNextPage: boolean }> {
  // Fetch Labels (needed for mapping and potentially filtering logic)
  const labelsData = await getDocuments<Label>({ collection: 'labels', limit: 100, depth: 0 })
  const allLabels = labelsData.docs
  const listLabel = allLabels.find((l) => l.name === 'List')
  const productDesignLabel = allLabels.find((l) => l.name === 'Product Design')

  // --- Base Where Clauses - Add visibility filter ---
  const productDesignWhere: Record<string, unknown> = {
    _status: { equals: 'published' }, // Correct: Uses _status
    'visibility.visibility-home': { equals: true },
  }
  // --- Change 'status' to '_status' for Other Projects ---
  const otherProjectWhere: Record<string, unknown> = {
    _status: { equals: 'published' }, // Correct: Use _status
    'visibility.visibility-home': { equals: true },
  }
  const listWhere: Record<string, unknown> = {
    _status: { equals: 'published' }, // Correct: Uses _status
    'visibility.visibility-home': { equals: true },
  }

  let fetchPD = true
  let fetchOP = true
  let fetchL = true

  // --- Apply Label Filter Logic ---
  if (labelId) {
    const selectedLabelInfo = allLabels.find((l) => l.id === labelId)

    // Check if the selected label is the specific "List" label
    if (listLabel && selectedLabelInfo?.id === listLabel.id) {
      // If filtering by "List", only fetch Lists
      fetchPD = false
      fetchOP = false
      fetchL = true // listWhere already filters by status
    }
    // Check if the selected label is the specific "Product Design" label
    else if (productDesignLabel && selectedLabelInfo?.id === productDesignLabel.id) {
      // If filtering by "Product Design", only fetch Product Designs
      productDesignWhere['projectType'] = { equals: labelId } // Add projectType to the _status query
      fetchPD = true
      fetchOP = false // Don't fetch Other Projects unless they can also have this label
      fetchL = false
    } else {
      // Assume other labels apply only to "Other Projects"
      // Modify this if Product Designs can have other labels too
      otherProjectWhere['projectLabel'] = { equals: labelId } // Add projectLabel to the status query
      fetchPD = false // Don't fetch Product Designs
      fetchOP = true
      fetchL = false // Don't fetch Lists
    }
  }
  // If no labelId (showing "All"), fetch everything (default true values)

  // --- Fetch ALL matching documents from relevant collections ---
  // Remove 'page' and 'limit' here, fetch everything matching the 'where' clause.
  // Add a large limit just in case, or remove if getDocuments fetches all by default when limit is unspecified.
  const largeLimit = 1000 // Adjust if you expect more items

  const productDesignsPromise = fetchPD
    ? getDocuments<ProductDesign>({
        collection: 'product-designs',
        limit: largeLimit, // Fetch all potentially relevant
        sort: '-datePublished', // Initial sort helps, but final sort is needed
        where: productDesignWhere,
        depth: 1,
      })
    : Promise.resolve({ docs: [], totalDocs: 0 }) // Only need docs now

  const otherProjectsPromise = fetchOP
    ? getDocuments<OtherProject>({
        collection: 'other-projects',
        limit: largeLimit,
        sort: '-dateCompleted',
        where: otherProjectWhere,
        depth: 1,
      })
    : Promise.resolve({ docs: [], totalDocs: 0 })

  const listsPromise = fetchL
    ? getDocuments<List>({
        collection: 'lists',
        limit: largeLimit,
        sort: '-publishedAt',
        where: listWhere,
        depth: 0,
      })
    : Promise.resolve({ docs: [], totalDocs: 0 })

  // Await all potential fetches
  const [productDesigns, otherProjects, lists] = await Promise.all([
    productDesignsPromise,
    otherProjectsPromise,
    listsPromise,
  ])

  // --- Combine, Normalize, Sort (only the fetched items for the current page) ---
  const combinedProjectsUnsorted: UnifiedProject[] = [
    // Combine first
    ...productDesigns.docs.map((item) => ({
      id: item.id,
      title: item.title,
      image: typeof item.image === 'object' ? item.image : null,
      collectionSlug: 'product-designs' as const,
      date: item.datePublished,
      pinned: item.pinned,
      label: productDesignLabel || null,
    })),
    ...otherProjects.docs.map((item) => ({
      id: item.id,
      title: item.title,
      image: typeof item.image === 'object' ? item.image : null,
      collectionSlug: 'other-projects' as const,
      date: item.dateCompleted,
      pinned: item.pinned,
      label:
        typeof item.projectLabel === 'number'
          ? allLabels.find((l) => l.id === item.projectLabel) || null
          : typeof item.projectLabel === 'object'
            ? item.projectLabel
            : null,
    })),
    ...lists.docs.map((item) => ({
      id: item.id,
      title: item.title,
      image: null,
      collectionSlug: 'lists' as const,
      date: item.publishedAt,
      pinned: item.pinned,
      label: listLabel || null,
    })),
  ]

  const combinedProjectsSorted = combinedProjectsUnsorted.sort((a, b) => {
    // Then sort
    // --- Ensure consistent sorting ---
    if (a.pinned && !b.pinned) return -1
    if (!a.pinned && b.pinned) return 1
    const dateA = a.date ? new Date(a.date).getTime() : 0
    const dateB = b.date ? new Date(b.date).getTime() : 0
    return dateB - dateA // Sort descending by date
  })

  // --- Calculate pagination variables based on the FULL sorted list ---
  const totalDocs = combinedProjectsSorted.length // Total is the length of the sorted array
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const projectsForPage = combinedProjectsSorted.slice(startIndex, endIndex) // Slice the correct page
  const hasNextPage = endIndex < totalDocs // Check if there are more items beyond the current slice

  console.log(
    `Page: ${page}, Limit: ${limit}, LabelId: ${labelId}, Fetched: [PD:${fetchPD}, OP:${fetchOP}, L:${fetchL}], Total Filtered Docs: ${totalDocs}, Returned Count: ${projectsForPage.length}, Calculated hasNext: ${hasNextPage}`, // Log returned count
  )

  // --- Return the correctly sliced page and hasNextPage ---
  return { projects: projectsForPage, hasNextPage }
}
