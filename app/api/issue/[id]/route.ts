import { NextResponse } from 'next/server'
import { db } from '@/db'
import { issues } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const numericId = parseInt(id, 10)
    if (isNaN(numericId)) {
      return NextResponse.json(
        { error: 'Invalid issue ID' },
        { status: 400 }
      )
    }

    const issue = await db.query.issues.findFirst({
      where: eq(issues.id, numericId),
    })

    if (!issue) {
      return NextResponse.json({ error: 'Issue not found' }, { status: 404 })
    }

    return NextResponse.json(issue)
  } catch (error) {
    console.error('Error fetching issue:', error)
    return NextResponse.json(
      { error: 'Failed to fetch issue' },
      { status: 500 }
    )
  }
}