import { RoadmapData } from "@/lib/types";

export const fallbackRoadmap: RoadmapData = {
  source: "fallback",
  lastUpdated: "2025-11-20T00:00:00.000Z",
  milestones: {
    mc25: [
      {
        id: "fallback-mc25-1",
        title: "BEARO Payments — Phase 1",
        summary:
          "Launch the unified merchant onboarding kit with automated KYC/KYB, smart routing, and instant settlement dashboards so that the first 500 merchants can go live without founders in the loop.",
        milestone: "mc25",
        product: "BEARO",
        status: "In Spec",
        priority: "P0-Critical",
        owner: "@ops-ai",
        targetDate: "2026-02-15",
        completion: 35,
        tokenImpact: "Drives initial $BEARCO payments burn + staking sinks",
        tags: ["checkout", "compliance", "merchant"],
        resources: [
          {
            label: "Onboarding spec",
            url: "https://www.notion.so/roadmap/bearo-phase-one",
            type: "memo",
          },
        ],
      },
      {
        id: "fallback-mc25-2",
        title: "Primape Core Game Loops",
        summary:
          "Ship the synchronous mobile-first contest engine plus revenue share model so that creators can spin up on-chain prediction games in <10 minutes.",
        milestone: "mc25",
        product: "PRIMAPE",
        status: "In Progress",
        priority: "P1-High",
        owner: "@creator-lab",
        targetDate: "2026-03-01",
        completion: 50,
        tokenImpact: "Rewards $APES staking with volume multipliers",
        tags: ["creator-economy", "gaming", "liquidity"],
        resources: [
          {
            label: "Game loop user flow",
            url: "https://www.notion.so/roadmap/primape-core-loop",
            type: "memo",
          },
        ],
      },
      {
        id: "fallback-mc25-3",
        title: "Chimpanion Intelligence Layer",
        summary:
          "Publish the first open inference agent that watches wallets in real-time, recommends actions, and translates insights into Slack + SMS alerts.",
        milestone: "mc25",
        product: "Chimpanion",
        status: "In Progress",
        priority: "P1-High",
        owner: "@agent-lab",
        targetDate: "2026-02-28",
        completion: 42,
        tags: ["agents", "alerts", "autonomy"],
        tokenImpact: "Expands $BEARCO data moat via opt-in signal sharing",
        resources: [
          {
            label: "Intelligence brief",
            url: "https://www.notion.so/roadmap/chimpanion-intel",
            type: "memo",
          },
        ],
      },
    ],
    mc50: [
      {
        id: "fallback-mc50-1",
        title: "Primape Creator Markets",
        summary:
          "Unlock permissionless creator markets with programmable royalties, enabling 1,000+ communities to spin up public contests backed by $APES LPs.",
        milestone: "mc50",
        product: "PRIMAPE",
        status: "Planned",
        priority: "P0-Critical",
        owner: "@ecosystem",
        targetDate: "2026-05-15",
        completion: 10,
        tags: ["creator", "liquidity", "token"],
        tokenImpact: "Direct token utility via bonding curve fees",
        resources: [
          {
            label: "Creator market RFC",
            url: "https://www.notion.so/roadmap/primape-markets",
            type: "memo",
          },
        ],
      },
      {
        id: "fallback-mc50-2",
        title: "BEARO Merchant Pods",
        summary:
          "Spin up automated go-to-market pods (ads, inbound, success) that can activate 100 merchants per week with AI-first playbooks.",
        milestone: "mc50",
        product: "BEARO",
        status: "Planned",
        priority: "P1-High",
        owner: "@growth-lab",
        targetDate: "2026-06-01",
        completion: 5,
        tags: ["growth", "ops", "automation"],
        tokenImpact: "Reward pods that hit volume unlocks with $BEARCO",
        resources: [
          {
            label: "Merchant pod architecture",
            url: "https://www.notion.so/roadmap/bearo-merchant-pods",
            type: "memo",
          },
        ],
      },
      {
        id: "fallback-mc50-3",
        title: "Partner Graph Integrations",
        summary:
          "Layer BearifiedCo APIs into core partners (banking, construction, creator tools) so tokens earn a revenue share on every integration.",
        milestone: "mc50",
        product: "BearifiedCo",
        status: "Planned",
        priority: "P2-Medium",
        owner: "@alliances",
        targetDate: "2026-05-30",
        completion: 3,
        tags: ["partnerships", "api", "token"],
        tokenImpact: "Drives $BEARCO sink + governance weight",
        resources: [
          {
            label: "Integration partner list",
            url: "https://www.notion.so/roadmap/partner-graph",
            type: "memo",
          },
        ],
      },
    ],
    mc75: [
      {
        id: "fallback-mc75-1",
        title: "FounderOS v2 Public",
        summary:
          "General availability of the self-driving FounderOS workspace with automated OKR reviews, PR syncs, and agent-to-agent escalations.",
        milestone: "mc75",
        product: "FounderOS",
        status: "In Spec",
        priority: "P0-Critical",
        owner: "@founder-core",
        targetDate: "2026-07-15",
        completion: 20,
        tags: ["automation", "ops", "founder"],
        tokenImpact: "Tokens unlock premium automations + seats",
        resources: [
          {
            label: "FounderOS v2 map",
            url: "https://www.notion.so/roadmap/founderos-v2",
            type: "memo",
          },
        ],
      },
      {
        id: "fallback-mc75-2",
        title: "Auto-Dev Pipelines",
        summary:
          "Ship GSAP + AI-driven deploy pipelines that chain issue triage → spec → PR → preview deployments with minimal human touches.",
        milestone: "mc75",
        product: "Automation",
        status: "In Spec",
        priority: "P1-High",
        owner: "@auto-dev",
        targetDate: "2026-08-01",
        completion: 18,
        tags: ["devex", "ci/cd", "ai"],
        tokenImpact: "Delegates code reviews to staked validators",
        resources: [
          {
            label: "Pipeline blueprint",
            url: "https://www.notion.so/roadmap/auto-dev",
            type: "memo",
          },
        ],
      },
      {
        id: "fallback-mc75-3",
        title: "Autonomous Shipping Loops",
        summary:
          "Close the loop between customer signals → backlog → launch notes so the company can ship meaningful value every 72 hours.",
        milestone: "mc75",
        product: "BearifiedCo",
        status: "Planned",
        priority: "P2-Medium",
        owner: "@shiproom",
        targetDate: "2026-08-15",
        completion: 12,
        tags: ["ops", "automation", "feedback"],
        resources: [
          {
            label: "Loop dashboard mock",
            url: "https://www.notion.so/roadmap/shipping-loops",
            type: "memo",
          },
        ],
      },
    ],
    mc100: [
      {
        id: "fallback-mc100-1",
        title: "Governance Layer MVP",
        summary:
          "Launch the liquid governance module with quorum incentives, streaming rewards, and AI-facilitated proposal drafting.",
        milestone: "mc100",
        product: "Bearified DAO",
        status: "In Spec",
        priority: "P0-Critical",
        owner: "@civics",
        targetDate: "2026-09-15",
        completion: 5,
        tags: ["dao", "governance", "token"],
        tokenImpact: "$BEARCO governance sinks + rewards",
        resources: [
          {
            label: "Governance architecture",
            url: "https://www.notion.so/roadmap/governance-layer",
            type: "memo",
          },
        ],
      },
      {
        id: "fallback-mc100-2",
        title: "Network State Treasury",
        summary:
          "Automate treasury diversification, liquidity provisioning, and grants with an agent that enforces guardrails approved by token holders.",
        milestone: "mc100",
        product: "Bearified DAO",
        status: "Planned",
        priority: "P1-High",
        owner: "@treasury",
        targetDate: "2026-10-01",
        completion: 0,
        tags: ["treasury", "defi", "automation"],
        resources: [
          {
            label: "Treasury console",
            url: "https://www.notion.so/roadmap/treasury-console",
            type: "memo",
          },
        ],
      },
      {
        id: "fallback-mc100-3",
        title: "Shared Governance Graph",
        summary:
          "Connect wallets, pods, and products into a real-time accountability graph so every roadmap artifact has an owner, vote path, and SLA.",
        milestone: "mc100",
        product: "FounderOS",
        status: "Planned",
        priority: "P2-Medium",
        owner: "@graph-lab",
        targetDate: "2026-10-10",
        completion: 0,
        tags: ["graph", "ops", "dao"],
        resources: [
          {
            label: "Governance graph spec",
            url: "https://www.notion.so/roadmap/governance-graph",
            type: "memo",
          },
        ],
      },
    ],
    post100: [
      {
        id: "fallback-post100-1",
        title: "One-Person $1B Company",
        summary:
          "Document the operating system that lets a solo founder orchestrate global revenue teams, treasury, and R&D through autonomous agents.",
        milestone: "post100",
        status: "Narrative",
        tags: ["vision", "lore", "culture"],
        owner: "@founder",
        resources: [
          {
            label: "Vision & Narrative",
            url: "https://www.notion.so/roadmap/one-person-unicorn",
            type: "memo",
          },
        ],
      },
    ],
  },
};

export default fallbackRoadmap;
