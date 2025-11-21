export type MilestoneKey =
  | "mc25"
  | "mc50"
  | "mc75"
  | "mc100"
  | "post100";

export interface RoadmapResourceLink {
  label: string;
  url: string;
  type?: "linear" | "github" | "memo" | "deck" | "other";
}

export interface RoadmapEntry {
  id: string;
  title: string;
  summary: string;
  milestone: MilestoneKey;
  status?: string;
  product?: string;
  priority?: string;
  owner?: string;
  targetDate?: string;
  completion?: number;
  tokenImpact?: string;
  tags: string[];
  resources: RoadmapResourceLink[];
  notionUrl?: string;
}

export interface RoadmapData {
  source: "notion" | "fallback";
  lastUpdated: string;
  milestones: Record<MilestoneKey, RoadmapEntry[]>;
}

export interface MilestoneDefinition {
  key: MilestoneKey;
  label: string;
  sublabel: string;
  threshold: string;
  description: string;
  accent: string;
  bg: string;
  quote?: {
    text: string;
    source: string;
    role?: string;
  };
  stat?: {
    label: string;
    value: string;
  };
}
