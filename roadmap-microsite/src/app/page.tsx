import { RoadmapExperience } from "@/components/RoadmapExperience";
import { fetchRoadmapData } from "@/lib/notion";

export default async function Home() {
  const data = await fetchRoadmapData();
  const gatingEnabled = process.env.NEXT_PUBLIC_UNLOCK_ENABLED === "true";
  const notionUrl = process.env.NOTION_ROADMAP_PAGE_URL ?? undefined;

  return (
    <RoadmapExperience data={data} gatingEnabled={gatingEnabled} notionUrl={notionUrl} />
  );
}
