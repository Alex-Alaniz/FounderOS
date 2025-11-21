import type { MilestoneDefinition, MilestoneKey } from "@/lib/types";

export const milestoneOrder: MilestoneKey[] = [
  "mc25",
  "mc50",
  "mc75",
  "mc100",
  "post100",
];

export const milestoneDefinitions: Record<MilestoneKey, MilestoneDefinition> = {
  mc25: {
    key: "mc25",
    label: "$25M MC — Product-Market Fit",
    sublabel: "Proving products that pay for themselves",
    threshold: "Ship loops that acquire, activate, and monetize without founder intervention.",
    description:
      "Launch the multi-product flywheel (BEARO, Primape, Chimpanion) and show repeatable demand. Every feature should feel like a founder superpower in public.",
    accent: "from-rose-500 to-orange-400",
    bg: "bg-gradient-to-b from-[#12050F] via-[#1C0E31] to-[#02010C]",
    quote: {
      text: "AI lets individuals punch way above their weight — we can run a company that feels 50 people strong with a single operator.",
      source: "FounderOS Vision Memo",
    },
    stat: {
      label: "Target ARR",
      value: "$3.5M",
    },
  },
  mc50: {
    key: "mc50",
    label: "$50M MC — Growth",
    sublabel: "Scaling distribution via pods + token utility",
    threshold: "Automated go-to-market pods turn software launches into predictable revenue unlocks.",
    description:
      "Stand up AI-led merchant pods, creator markets, and partner graph integrations so liquidity and user acquisition scale without human bottlenecks.",
    accent: "from-orange-400 to-amber-300",
    bg: "bg-gradient-to-b from-[#0F1205] via-[#132312] to-[#020C04]",
    quote: {
      text: "Single-handed unicorns thrive when distribution is automated. Build systems that market themselves.",
      source: "Tim Cortinovis, Single-Handed Unicorn",
    },
    stat: {
      label: "Weekly Active Customers",
      value: "5,000",
    },
  },
  mc75: {
    key: "mc75",
    label: "$75M MC — Network Effects",
    sublabel: "Autonomous product loops",
    threshold: "FounderOS runs itself — agents watch metrics, ship, and talk to customers.",
    description:
      "Public release of FounderOS v2, autonomous shipping loops, and auto-dev pipelines that keep the company shipping every 72 hours.",
    accent: "from-teal-400 to-cyan-300",
    bg: "bg-gradient-to-b from-[#041213] via-[#072126] to-[#010C0C]",
    quote: {
      text: "Indie hackers already generate 6–7 figures solo. The next step is giving them an operating system to hit 9.",
      source: "Solopreneur Benchmark, 2023",
    },
    stat: {
      label: "Release cadence",
      value: "72h",
    },
  },
  mc100: {
    key: "mc100",
    label: "$100M MC — Governance Layer",
    sublabel: "Network-state level trust",
    threshold: "Token holders steer treasury, roadmap, and automation guardrails in real time.",
    description:
      "Activate the governance layer — liquid voting, treasury automations, and accountability graph connecting wallets, pods, and metrics.",
    accent: "from-sky-400 to-indigo-400",
    bg: "bg-gradient-to-b from-[#050B15] via-[#0F1534] to-[#020311]",
    quote: {
      text: "The roadmap has to feel inevitable — governance should accelerate launches, not slow them down.",
      source: "Governance Layer Playbook",
    },
    stat: {
      label: "Treasury AUM",
      value: "$25M",
    },
  },
  post100: {
    key: "post100",
    label: "Post-$100M — One-Person $1B Company Vision",
    sublabel: "Lore + operating system",
    threshold: "Document how a solo founder orchestrates a billion-dollar network with AI copilots.",
    description:
      "Final chapter that cites Sam Altman’s prediction (billion-dollar companies run by ~10 people) and Tim Cortinovis’ ‘Single-Handed Unicorn’. We prove the thesis with transparent metrics, lore drops, and live dashboards.",
    accent: "from-purple-500 via-fuchsia-500 to-rose-500",
    bg: "bg-gradient-to-b from-[#15040F] via-[#2B0D3A] to-[#000103]",
    quote: {
      text: "Sam Altman has said billion-dollar companies will soon be run by teams of ~10. FounderOS shows how one builder can go even further.",
      source: "Sam Altman, AI and the future of work",
      role: "OpenAI CEO",
    },
    stat: {
      label: "Ops headcount",
      value: "1 human",
    },
  },
};
