import type { NextApiRequest, NextApiResponse } from 'next';
import { fetchRoadmapData } from '@/lib/notion';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check for Notion API key
  if (!process.env.NOTION_API_KEY) {
    return res.status(500).json({ 
      error: 'NOTION_API_KEY not configured. Please add it to your environment variables.' 
    });
  }

  try {
    const data = await fetchRoadmapData();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching roadmap:', error);
    res.status(500).json({ 
      error: 'Failed to fetch roadmap data',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

