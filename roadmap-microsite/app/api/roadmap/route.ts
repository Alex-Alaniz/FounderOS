import { NextResponse } from 'next/server'
import { Client } from '@notionhq/client'

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
})

const ROADMAP_DATABASE_ID = '2b26468866ef8093a5bfe0775e96abda'

interface RoadmapItem {
  id: string
  initiative: string
  product: string
  milestone: string
  status: string
  priority: string
  project: string
  startDate: string | null
  dueDate: string | null
  description: string | null
  owner: string | null
  notes: string | null
}

export async function GET() {
  try {
    const response = await notion.databases.query({
      database_id: ROADMAP_DATABASE_ID,
      sorts: [
        {
          property: 'Due Date',
          direction: 'ascending',
        },
      ],
    })

    const roadmapItems: RoadmapItem[] = response.results.map((page: any) => {
      const props = page.properties
      
      return {
        id: page.id,
        initiative: props.Initiative?.title?.[0]?.plain_text || '',
        product: props.Product?.select?.name || '',
        milestone: props.Milestone?.select?.name || '',
        status: props.Status?.status?.name || '',
        priority: props.Priority?.select?.name || '',
        project: props.Project?.rich_text?.[0]?.plain_text || '',
        startDate: props['Start Date']?.date?.start || null,
        dueDate: props['Due Date']?.date?.start || null,
        description: props.Description?.rich_text?.[0]?.plain_text || null,
        owner: props.Owner?.people?.[0]?.name || null,
        notes: props.Notes?.rich_text?.[0]?.plain_text || null,
      }
    })

    return NextResponse.json({ items: roadmapItems })
  } catch (error) {
    console.error('Error fetching roadmap:', error)
    return NextResponse.json(
      { error: 'Failed to fetch roadmap data' },
      { status: 500 }
    )
  }
}

