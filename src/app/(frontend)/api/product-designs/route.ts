// /src/app/api/product-design/route.ts
import { getPayload } from 'payload'
import { NextResponse } from 'next/server'
import config from '@payload-config'

export async function GET() {
  try {
    const payload = await getPayload({ config })

    const productDesigns = await payload.find({
      collection: 'product-design',
      limit: 100,
      sort: '-datePublished',
    })

    return NextResponse.json(productDesigns)
  } catch (error) {
    console.error('Error fetching product designs:', error)
    return NextResponse.json({ error: 'Failed to fetch product designs' }, { status: 500 })
  }
}
