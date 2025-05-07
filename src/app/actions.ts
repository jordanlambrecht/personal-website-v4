'use server'

import { getDocuments } from '@/utils/getDocument'
import { ProductDesign, OtherProject, List, Label, SiteSetting } from '@/payload-types' // Add SiteSettings
import type { UnifiedProject } from '@/app/(frontend)/page'
import { getPayload } from 'payload' // Import getPayload
import config from '@payload-config' // Import your payload config

export async function fetchProjectsPage(
  page: number = 1,
  limit: number = 20,
  labelId?: number | null,
): Promise<{ projects: UnifiedProject[]; hasNextPage: boolean }> {
  const payload = await getPayload({ config }) // Get payload instance

  // Fetch Site Settings
  const siteSettings = (await payload.findGlobal({
    slug: 'siteSettings',
    depth: 0,
  })) as SiteSetting // Cast to SiteSettings type

  const labelsData = await getDocuments<Label>({ collection: 'labels', limit: 100, depth: 0 })
  const allLabels = labelsData.docs
  const listLabel = allLabels.find((l) => l.name === 'List')
  const productDesignLabel = allLabels.find((l) => l.name === 'Product Design')

  const productDesignWhere: Record<string, unknown> = {
    _status: { equals: 'published' },
    'visibility.visibility-home': { equals: true },
  }
  const otherProjectWhere: Record<string, unknown> = {
    _status: { equals: 'published' },
    'visibility.visibility-home': { equals: true },
  }
  const listWhere: Record<string, unknown> = {
    _status: { equals: 'published' },
    'visibility.visibility-home': { equals: true },
  }

  let fetchPD = siteSettings.showProductDesigns // Initialize with site settings
  let fetchOP = siteSettings.showOtherProjects
  let fetchL = siteSettings.showLists

  if (labelId) {
    const selectedLabelInfo = allLabels.find((l) => l.id === labelId)
    if (listLabel && selectedLabelInfo?.id === listLabel.id) {
      fetchPD = false // Only fetch lists if list label is selected
      fetchOP = false
      fetchL = siteSettings.showLists // Still respect global toggle for lists
    } else if (productDesignLabel && selectedLabelInfo?.id === productDesignLabel.id) {
      productDesignWhere['projectType'] = { equals: labelId }
      fetchPD = siteSettings.showProductDesigns // Respect global toggle
      fetchOP = false
      fetchL = false
    } else {
      otherProjectWhere['projectLabel'] = { equals: labelId }
      fetchPD = false
      fetchOP = siteSettings.showOtherProjects // Respect global toggle
      fetchL = false
    }
  } else {
    // If no labelId, respect global toggles for all
    fetchPD = siteSettings.showProductDesigns
    fetchOP = siteSettings.showOtherProjects
    fetchL = siteSettings.showLists
  }

  // Note: This fetches all matching documents up to largeLimit and sorts/paginates in memory.
  // For very large datasets, a more complex DB-level pagination strategy might be needed.
  const largeLimit = 1000

  const productDesignsPromise = fetchPD
    ? getDocuments<ProductDesign>({
        collection: 'product-design',
        limit: largeLimit,
        sort: '-datePublished',
        where: productDesignWhere,
        depth: 1,
      })
    : Promise.resolve({ docs: [], totalDocs: 0 })

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

  const [productDesigns, otherProjects, lists] = await Promise.all([
    productDesignsPromise,
    otherProjectsPromise,
    listsPromise,
  ])

  const combinedProjectsUnsorted: UnifiedProject[] = [
    ...productDesigns.docs.map((item) => ({
      id: item.id,
      title: item.title,
      image: typeof item.image === 'object' ? item.image : null,
      collectionSlug: 'product-design' as const,
      date: item.datePublished,
      pinned: item.pinned,
      favorited: item.favorited,
      label: productDesignLabel || null,
    })),
    ...otherProjects.docs.map((item) => ({
      id: item.id,
      title: item.title,
      image: typeof item.image === 'object' ? item.image : null,
      collectionSlug: 'other-projects' as const,
      date: item.dateCompleted,
      pinned: item.pinned,
      favorited: item.favorited,
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
      favorited: item.favorited,
      label: listLabel || null,
    })),
  ]

  const combinedProjectsSorted = combinedProjectsUnsorted.sort((a, b) => {
    if (a.pinned && !b.pinned) return -1
    if (!a.pinned && b.pinned) return 1
    if (a.pinned === b.pinned) {
      if (a.favorited && !b.favorited) return -1
      if (!a.favorited && b.favorited) return 1
    }
    const dateA = a.date ? new Date(a.date).getTime() : 0
    const dateB = b.date ? new Date(b.date).getTime() : 0
    return dateB - dateA
  })

  const totalDocs = combinedProjectsSorted.length
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const projectsForPage = combinedProjectsSorted.slice(startIndex, endIndex)
  const hasNextPage = endIndex < totalDocs

  console.log(
    `Page: ${page}, Limit: ${limit}, LabelId: ${labelId}, Fetched: [PD:${fetchPD}, OP:${fetchOP}, L:${fetchL}], Total Filtered Docs: ${totalDocs}, Returned Count: ${projectsForPage.length}, Calculated hasNext: ${hasNextPage}`,
  )

  return { projects: projectsForPage, hasNextPage }
}
