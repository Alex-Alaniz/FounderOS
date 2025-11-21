import { Client } from "@notionhq/client";
import { type PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import fallbackRoadmap from "@/data/fallbackRoadmap";
import type { MilestoneKey, RoadmapData, RoadmapEntry } from "@/lib/types";

const titleKeys = ["Initiative", "Title", "Name"];
const summaryKeys = ["Narrative", "Description", "Summary", "Context"];
const milestoneKeys = [
  "Milestone",
  "Market Cap Gate",
  "Stage",
  "Funding Gate",
];
const statusKeys = ["Status", "State"];
const productKeys = ["Product", "Product (via Project)", "Program"];
const priorityKeys = ["Priority", "Impact", "P-Level"];
const ownerKeys = ["Owner", "DRI", "Champion"];
const dateKeys = ["Target Date", "Launch Window", "Go-Live", "Date"];
const completionKeys = ["Completion %", "Progress"];
const tokenKeys = ["Token Utility", "Token Impact", "Token Story"];
const tagKeys = ["Tags", "Focus", "Capability", "Product"];
const resourceKeys = [
  "Linear Epic",
  "GitHub Milestone",
  "Spec Link",
  "Memo",
  "Brief",
  "Deck",
  "Doc",
  "Hub Post",
  "PR Link",
];

const milestoneMap = new Map<string, MilestoneKey>([
  ["milestone 1", "mc25"],
  ["product-market", "mc25"],
  ["$25", "mc25"],
  ["pmf", "mc25"],
  ["milestone 2", "mc50"],
  ["$50", "mc50"],
  ["growth", "mc50"],
  ["milestone 3", "mc75"],
  ["$75", "mc75"],
  ["network", "mc75"],
  ["milestone 4", "mc100"],
  ["$100", "mc100"],
  ["governance", "mc100"],
  ["post", "post100"],
  ["one-person", "post100"],
]);

let cachedClient: Client | null = null;

function ensureClient() {
  if (!process.env.NOTION_TOKEN) {
    throw new Error("NOTION_TOKEN is missing");
  }
  if (!cachedClient) {
    cachedClient = new Client({ auth: process.env.NOTION_TOKEN });
  }
  return cachedClient;
}

const emptyMilestones = (): Record<MilestoneKey, RoadmapEntry[]> => ({
  mc25: [],
  mc50: [],
  mc75: [],
  mc100: [],
  post100: [],
});

export async function fetchRoadmapData(): Promise<RoadmapData> {
  const databaseId = process.env.NOTION_ROADMAP_DATABASE_ID;

  if (!process.env.NOTION_TOKEN || !databaseId) {
    return fallbackRoadmap;
  }

  try {
    const client = ensureClient();
    const rows = await collectAllPages(client, databaseId);
    const entries: RoadmapEntry[] = rows
      .map((page) => transformPage(page))
      .filter((entry): entry is RoadmapEntry => Boolean(entry));

    const lastUpdated = rows
      .map((row) => row.last_edited_time)
      .sort()
      .pop() ?? new Date().toISOString();

    const milestones = groupByMilestone(entries);

    return {
      source: "notion",
      lastUpdated,
      milestones,
    };
  } catch (error) {
    console.error("Notion fetch failed, using fallback", error);
    return fallbackRoadmap;
  }
}

async function collectAllPages(client: Client, databaseId: string) {
  const pages: PageObjectResponse[] = [];
  let cursor: string | undefined;

  do {
    const response = (await (client as any).databases.query({
      database_id: databaseId,
      start_cursor: cursor,
      sorts: [
        {
          timestamp: "last_edited_time",
          direction: "descending",
        },
      ],
    })) as {
      results: PageObjectResponse[];
      next_cursor?: string | null;
    };

    response.results.forEach((result) => {
      if (result.object === "page") {
        pages.push(result);
      }
    });

    cursor = response.next_cursor ?? undefined;
  } while (cursor);

  return pages;
}

function transformPage(page: PageObjectResponse): RoadmapEntry | null {
  const titleProp = pickProperty(page, titleKeys);
  const title = titleProp ? getTitleText(titleProp) : undefined;
  if (!title) return null;

  const milestoneProp = pickProperty(page, milestoneKeys);
  const milestoneName = milestoneProp ? getSelectText(milestoneProp) : undefined;
  const milestone = resolveMilestone(milestoneName);
  if (!milestone) return null;

  const summaryProp = pickProperty(page, summaryKeys);
  const summary = summaryProp ? getRichText(summaryProp) : "";

  const entry: RoadmapEntry = {
    id: page.id,
    title,
    summary,
    milestone,
    status: getSelectText(pickProperty(page, statusKeys)),
    product: getSelectText(pickProperty(page, productKeys)),
    priority: getSelectText(pickProperty(page, priorityKeys)),
    owner: getPeopleText(pickProperty(page, ownerKeys)),
    targetDate: getDateValue(pickProperty(page, dateKeys)),
    completion: getNumberValue(pickProperty(page, completionKeys)),
    tokenImpact: getRichText(pickProperty(page, tokenKeys)),
    tags: getMultiSelectValues(pickProperty(page, tagKeys)),
    resources: getResourceLinks(page),
    notionUrl: page.url,
  };

  return entry;
}

function pickProperty(
  page: PageObjectResponse,
  keys: string[],
): PageObjectResponse["properties"][string] | undefined {
  for (const key of keys) {
    if (key in page.properties) {
      return page.properties[key];
    }
  }
  return undefined;
}

function getTitleText(property?: PageObjectResponse["properties"][string]) {
  if (!property || property.type !== "title") return "";
  return property.title.map((item) => item.plain_text).join(" ").trim();
}

function getRichText(property?: PageObjectResponse["properties"][string]) {
  if (!property) return "";
  if (property.type === "rich_text") {
    return property.rich_text.map((item) => item.plain_text).join(" ").trim();
  }
  if (property.type === "title") {
    return property.title.map((item) => item.plain_text).join(" ").trim();
  }
  return "";
}

function getSelectText(property?: PageObjectResponse["properties"][string]) {
  if (!property) return undefined;
  if (property.type === "select") {
    return property.select?.name ?? undefined;
  }
  if (property.type === "status") {
    return property.status?.name ?? undefined;
  }
  if (property.type === "multi_select") {
    return property.multi_select[0]?.name;
  }
  return undefined;
}

function getPeopleText(property?: PageObjectResponse["properties"][string]) {
  if (!property || property.type !== "people") return undefined;
  return property.people
    .map((person) => (person as any).name || (person as any).person?.email)
    .filter(Boolean)
    .join(", ")
    .trim() || undefined;
}

function getDateValue(property?: PageObjectResponse["properties"][string]) {
  if (!property || property.type !== "date") return undefined;
  return property.date?.start ?? undefined;
}

function getNumberValue(property?: PageObjectResponse["properties"][string]) {
  if (!property) return undefined;
  if (property.type === "number") {
    return property.number ?? undefined;
  }
  return undefined;
}

function getMultiSelectValues(property?: PageObjectResponse["properties"][string]) {
  if (!property) return [] as string[];
  if (property.type === "multi_select") {
    return property.multi_select.map((item) => item.name).filter(Boolean);
  }
  if (property.type === "select" && property.select?.name) {
    return [property.select.name];
  }
  return [] as string[];
}

function getResourceLinks(page: PageObjectResponse) {
  const links: RoadmapEntry["resources"] = [];
  for (const key of resourceKeys) {
    const prop = page.properties[key];
    if (!prop) continue;
    if (prop.type === "url" && prop.url) {
      links.push({
        label: key,
        url: prop.url,
        type: normalizeResourceType(key),
      });
    }
    if (prop.type === "rich_text") {
      const url = prop.rich_text.find((text) => text.href)?.href;
      if (url) {
        links.push({ label: key, url, type: normalizeResourceType(key) });
      }
    }
    if (prop.type === "files" && prop.files.length > 0) {
      const fileUrl = prop.files[0].type === "external" ? prop.files[0].external.url : prop.files[0].file.url;
      links.push({ label: key, url: fileUrl, type: normalizeResourceType(key) });
    }
  }
  return links;
}

function normalizeResourceType(key: string) {
  const normalized = key.toLowerCase();
  if (normalized.includes("linear")) return "linear";
  if (normalized.includes("github") || normalized.includes("pr")) return "github";
  if (normalized.includes("deck")) return "deck";
  if (normalized.includes("memo") || normalized.includes("brief") || normalized.includes("doc")) return "memo";
  return "other";
}

function resolveMilestone(value?: string | null): MilestoneKey | null {
  if (!value) return null;
  const normalized = value.toLowerCase();
  for (const [needle, key] of milestoneMap.entries()) {
    if (normalized.includes(needle)) {
      return key;
    }
  }
  return null;
}

function groupByMilestone(entries: RoadmapEntry[]) {
  const grouped = emptyMilestones();
  for (const entry of entries) {
    grouped[entry.milestone].push(entry);
  }
  return grouped;
}
