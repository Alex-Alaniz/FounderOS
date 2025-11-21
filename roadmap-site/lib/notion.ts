import { Client } from "@notionhq/client";

export const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

export const DATABASE_ID = process.env.NOTION_DATABASE_ID || "2b264688-66ef-8093-a5bf-e0775e96abda";

export type RoadmapItem = {
  id: string;
  title: string;
  milestone: string;
  product: string;
  status: string;
  description: string;
  dueDate: string | null;
  priority: string;
};

export async function getRoadmapItems(): Promise<RoadmapItem[]> {
  // If no API key, return mock data for demo purposes
  if (!process.env.NOTION_API_KEY) {
    console.warn("No NOTION_API_KEY found, returning mock data");
    return MOCK_ITEMS;
  }

  try {
    const response = await notion.databases.query({
      database_id: DATABASE_ID,
      sorts: [
        {
          property: "Due Date",
          direction: "ascending",
        },
      ],
    });

    return response.results.map((page: any) => {
      const props = page.properties;
      return {
        id: page.id,
        title: props.Initiative?.title?.[0]?.plain_text || "Untitled",
        milestone: props.Milestone?.select?.name || "Unassigned",
        product: props.Product?.select?.name || "General",
        status: props.Status?.status?.name || "Not Started",
        description: props.Description?.rich_text?.[0]?.plain_text || "",
        dueDate: props["Due Date"]?.date?.start || null,
        priority: props.Priority?.select?.name || "P3",
      };
    });
  } catch (error) {
    console.error("Error fetching roadmap:", error);
    return MOCK_ITEMS;
  }
}

const MOCK_ITEMS: RoadmapItem[] = [
  {
    id: "1",
    title: "BEARO MVP Development",
    milestone: "Milestone 1",
    product: "BEARO",
    status: "In Progress",
    description: "Core P2P payments and user auth.",
    dueDate: "2025-01-01",
    priority: "P0 (Critical)",
  },
  {
    id: "2",
    title: "AlphaBuilder Market Validation",
    milestone: "Milestone 1",
    product: "AlphaBuilder",
    status: "Todo",
    description: "Validate construction estimation tool with initial clients.",
    dueDate: "2025-02-01",
    priority: "P1 (High)",
  },
  {
    id: "3",
    title: "Primape Game Launch",
    milestone: "Milestone 2",
    product: "PRIMAPE",
    status: "Not Started",
    description: "Launch play-to-earn mechanics.",
    dueDate: "2025-03-01",
    priority: "P1 (High)",
  },
  {
    id: "4",
    title: "Chimpanion AI Training",
    milestone: "Milestone 2",
    product: "CHIMPANION",
    status: "In Progress",
    description: "Train models on crypto market data.",
    dueDate: "2025-04-01",
    priority: "P2 (Medium)",
  },
  {
    id: "5",
    title: "FounderOS v2 Public Release",
    milestone: "Milestone 3",
    product: "FounderOS",
    status: "Not Started",
    description: "Public launch of the operating system.",
    dueDate: "2026-06-30",
    priority: "P1 (High)",
  },
  {
    id: "6",
    title: "BEARCO Ecosystem Integration",
    milestone: "Milestone 3",
    product: "BEARCO",
    status: "Not Started",
    description: "Unified brand experience across all apps.",
    dueDate: "2026-03-30",
    priority: "P2 (Medium)",
  },
];

