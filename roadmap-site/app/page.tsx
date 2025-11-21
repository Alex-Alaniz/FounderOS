import { getRoadmapItems } from "@/lib/notion";
import { ScrollSection } from "./components/ScrollSection";
import { RoadmapCard } from "./components/RoadmapCard";
import { UnicornSection } from "./components/UnicornSection";

export const revalidate = 3600; // Revalidate every hour

export default async function Home() {
  const items = await getRoadmapItems();

  // Filter items by milestone
  const milestone1 = items.filter((i) => i.milestone === "Milestone 1");
  const milestone2 = items.filter((i) => i.milestone === "Milestone 2");
  const milestone3 = items.filter((i) => i.milestone === "Milestone 3");
  const postMilestone = items.filter((i) => !["Milestone 1", "Milestone 2", "Milestone 3"].includes(i.milestone));

  return (
    <main className="flex min-h-screen flex-col bg-black text-white">
      {/* Hero Section */}
      <section className="h-screen flex flex-col items-center justify-center text-center p-4 bg-grid-white/[0.02] relative overflow-hidden">
        <div className="absolute inset-0 bg-black/50 z-0" />
        <div className="z-10 max-w-4xl mx-auto space-y-8 animate-fade-in-up">
           <h1 className="text-6xl md:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-500">
            FounderOS
          </h1>
          <p className="text-xl md:text-3xl text-zinc-400 font-light max-w-2xl mx-auto">
            The One-Person $1B Company Roadmap
          </p>
          <div className="text-sm text-zinc-600 uppercase tracking-widest mt-12">
            Scroll to Explore
          </div>
          <div className="w-[1px] h-24 bg-gradient-to-b from-zinc-500 to-transparent mx-auto mt-4"></div>
        </div>
      </section>

      {/* $25M MC Section */}
      <ScrollSection
        title="Product-Market Fit"
        subtitle="Finding the Signal"
        marketCap="$25M"
        description="The initial phase focuses on launching core products (BEARO, AlphaBuilder) and validating the 'Market of One' hypothesis. We leverage AI to ship at the speed of a 50-person team."
      >
        {milestone1.map((item) => (
          <RoadmapCard key={item.id} {...item} />
        ))}
        {milestone1.length === 0 && <div className="text-zinc-500 italic">No active items in this milestone.</div>}
      </ScrollSection>

      {/* $50M MC Section */}
      <ScrollSection
        title="Growth"
        subtitle="Scaling the Machine"
        marketCap="$50M"
        description="Automating the flywheel. Primape gaming ecosystem comes online, driving user engagement. Chimpanion intelligence layer begins predictive modeling."
      >
         {milestone2.map((item) => (
          <RoadmapCard key={item.id} {...item} />
        ))}
      </ScrollSection>

      {/* $75M MC Section */}
      <ScrollSection
        title="Network Effects"
        subtitle="The Bearified Ecosystem"
        marketCap="$75M"
        description="Connecting the dots. Every product feeds the others. Shared identity, unified rewards, and cross-platform utility create a moat around the ecosystem."
      >
         {milestone3.map((item) => (
          <RoadmapCard key={item.id} {...item} />
        ))}
      </ScrollSection>

      {/* $100M MC Section */}
      <ScrollSection
        title="Governance Layer"
        subtitle="Decentralized Autonomy"
        marketCap="$100M"
        description="The transition to community ownership. Token utility expands to governance. The founder becomes the architect, the community becomes the builder."
      >
         {postMilestone.map((item) => (
          <RoadmapCard key={item.id} {...item} />
        ))}
      </ScrollSection>

      {/* Final Lore Section */}
      <UnicornSection />
    </main>
  );
}
