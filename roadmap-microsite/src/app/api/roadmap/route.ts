import { NextResponse } from "next/server";
import { fetchRoadmapData } from "@/lib/notion";

export async function GET() {
  const data = await fetchRoadmapData();
  return NextResponse.json(data, {
    headers: {
      "cache-control": "no-store",
    },
  });
}
