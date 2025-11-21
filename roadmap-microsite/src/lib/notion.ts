import { Client } from '@notionhq/client';

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

const ROADMAP_DATABASE_ID = '2b26468866ef8093a5bfe0775e96abda';

export interface RoadmapItem {
  id: string;
  initiative: string;
  product: string;
  milestone: string;
  status: string;
  priority: string;
  description?: string;
  startDate?: string;
  dueDate?: string;
  project?: string;
}

export async function fetchRoadmapData(): Promise<RoadmapItem[]> {
  try {
    const response = await notion.databases.query({
      database_id: ROADMAP_DATABASE_ID,
      sorts: [
        {
          property: 'Due Date',
          direction: 'ascending',
        },
      ],
    });

    return response.results.map((page: any) => {
      const props = page.properties;
      return {
        id: page.id,
        initiative: props.Initiative?.title?.[0]?.plain_text || '',
        product: props.Product?.select?.name || '',
        milestone: props.Milestone?.select?.name || '',
        status: props.Status?.status?.name || '',
        priority: props.Priority?.select?.name || '',
        description: props.Description?.rich_text?.[0]?.plain_text || '',
        startDate: props['Start Date']?.date?.start || undefined,
        dueDate: props['Due Date']?.date?.start || undefined,
        project: props.Project?.rich_text?.[0]?.plain_text || '',
      };
    });
  } catch (error) {
    console.error('Error fetching roadmap data:', error);
    return [];
  }
}

export function groupByMilestone(items: RoadmapItem[]): Record<string, RoadmapItem[]> {
  const grouped: Record<string, RoadmapItem[]> = {
    'Milestone 1': [],
    'Milestone 2': [],
    'Milestone 3': [],
  };

  items.forEach((item) => {
    if (item.milestone && grouped[item.milestone]) {
      grouped[item.milestone].push(item);
    }
  });

  return grouped;
}

