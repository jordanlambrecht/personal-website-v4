// /src/app/api/other-projects/route.ts
import { getPayload } from 'payload'
import { NextResponse } from 'next/server'
import config from '@payload-config'

export async function GET() {
  try {
    const payload = await getPayload({ config })

    const otherProjects = await payload.find({
      collection: 'other-projects',
      limit: 100,
      sort: '-dateCompleted',
    })

    return NextResponse.json(otherProjects)
  } catch (error) {
    console.error('Error fetching other projects:', error)
    return NextResponse.json({ error: 'Failed to fetch other projects' }, { status: 500 })
  }
}
