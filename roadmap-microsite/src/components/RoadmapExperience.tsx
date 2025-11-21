"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import clsx from "clsx";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { loreHighlights } from "@/content/lore";
import { TokenGate } from "@/components/TokenGate";
import { milestoneDefinitions, milestoneOrder } from "@/lib/milestones";
import type { MilestoneKey, RoadmapData, RoadmapEntry } from "@/lib/types";

type MilestoneConfig = (typeof milestoneDefinitions)[MilestoneKey];

let scrollRegistered = false;

interface RoadmapExperienceProps {
  data: RoadmapData;
  gatingEnabled: boolean;
  notionUrl?: string | null;
}

gsap.defaults({ ease: "power2.out" });

export function RoadmapExperience({ data, gatingEnabled, notionUrl }: RoadmapExperienceProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scrollRegistered && typeof window !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);
      scrollRegistered = true;
    }

    if (!containerRef.current || !scrollRegistered) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".milestone-title").forEach((title) => {
        gsap.fromTo(
          title,
          { autoAlpha: 0, y: 40 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.9,
            scrollTrigger: {
              trigger: title,
              start: "top 80%",
            },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>(".roadmap-card").forEach((card) => {
        gsap.from(card, {
          opacity: 0,
          y: 80,
          duration: 1,
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        });
      });

      gsap.utils.toArray<HTMLElement>(".parallax-bubble").forEach((layer) => {
        const speed = Number(layer.dataset.speed || 0.4);
        gsap.to(layer, {
          yPercent: speed * 50,
          ease: "none",
          scrollTrigger: {
            trigger: layer,
            scrub: true,
          },
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const formattedDate = useMemo(() => formatDate(data.lastUpdated), [data.lastUpdated]);

  return (
    <div ref={containerRef} className="relative isolate bg-[#020109] text-white">
      <GradientOrbs />
      <ScrollProgressBar />
      <section className="relative mx-auto flex min-h-[60vh] max-w-5xl flex-col gap-8 px-6 pb-12 pt-20 sm:px-10 lg:px-0">
        <div className="w-fit rounded-full border border-white/15 bg-white/5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.4em] text-white/70">
          BearifiedCo Roadmap
        </div>
        <div className="max-w-4xl space-y-6">
          <h1 className="text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            The scroll-driven journey to a <span className="text-gradient">One-Person $1B Company</span>
          </h1>
          <p className="text-lg text-white/75 sm:text-xl">
            The BearifiedCo Command Center publishes every milestone in public. Scroll to see how token utility, AI orchestration, and shipping loops take us from $25M to $100M MC — and into lore territory.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <Metric label="Feed" value={data.source === "notion" ? "Live Notion" : "Fallback demo"} sublabel={formattedDate ? `Last updated ${formattedDate}` : undefined} />
          <Metric label="Notion" value="Command Center" sublabel={notionUrl ? "Synced automatically" : "Share the DB with the integration"} />
          <Metric label="Lore" value="One-Person $1B" sublabel="Final chapter pinned" />
        </div>
        <div className="flex flex-wrap gap-4">
          {notionUrl && (
            <a
              href={notionUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-white/90"
            >
              Open Notion Command Center
            </a>
          )}
          <a
            href="/docs/vision-narrative.pdf"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white/80 transition hover:border-white hover:text-white"
          >
            Read the Vision Narrative
          </a>
        </div>
      </section>

      {milestoneOrder.map((key) => (
        <MilestoneSection
          key={key}
          definition={milestoneDefinitions[key]}
          entries={data.milestones[key] ?? []}
          gatingEnabled={gatingEnabled}
        />
      ))}

      <LoreSection />
    </div>
  );
}

function MilestoneSection({
  definition,
  entries,
  gatingEnabled,
}: {
  definition: MilestoneConfig;
  entries: RoadmapEntry[];
  gatingEnabled: boolean;
}) {
  const publicEntries = gatingEnabled ? entries.slice(0, 1) : entries;
  const lockedEntries = gatingEnabled ? entries.slice(1) : [];

  return (
    <section
      className={clsx(
        "milestone-section relative mx-auto my-20 max-w-6xl overflow-hidden rounded-[32px] border border-white/10 p-8 sm:p-12 lg:p-16",
        definition.bg,
      )}
    >
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="parallax-bubble absolute -left-10 top-0 h-72 w-72 rounded-full bg-white/10 blur-3xl" data-speed="0.4" />
        <div className="parallax-bubble absolute bottom-0 right-6 h-52 w-52 rounded-full bg-white/5 blur-2xl" data-speed="0.8" />
      </div>
      <div className="relative">
        <p className="text-sm uppercase tracking-[0.4em] text-white/70">{definition.threshold}</p>
        <div className="milestone-title mt-4 flex flex-col gap-4">
          <div>
            <p className="text-lg font-semibold text-white/80">{definition.sublabel}</p>
            <h2
              className={clsx(
                "bg-gradient-to-r bg-clip-text text-3xl font-semibold text-transparent sm:text-4xl",
                definition.accent,
              )}
            >
              {definition.label}
            </h2>
          </div>
          <p className="max-w-3xl text-white/80">{definition.description}</p>
          <div className="flex flex-wrap gap-6 text-sm text-white/70">
            {definition.quote && (
              <blockquote className="max-w-xl border-l-2 border-white/30 pl-4 italic">
                “{definition.quote.text}” — {definition.quote.source}
                {definition.quote.role ? `, ${definition.quote.role}` : ""}
              </blockquote>
            )}
            {definition.stat && (
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-white/50">{definition.stat.label}</p>
                <p className="text-2xl font-semibold">{definition.stat.value}</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {publicEntries.map((entry) => (
            <RoadmapCard key={entry.id} entry={entry} />
          ))}
        </div>

        {publicEntries.length === 0 && lockedEntries.length === 0 && (
          <p className="mt-6 text-sm text-white/70">
            No public entries yet — connect the Product Roadmap database in Notion to populate this
            section automatically.
          </p>
        )}

        {gatingEnabled && lockedEntries.length > 0 && (
          <div className="mt-8">
            <TokenGate
              gatingEnabled
              preview={<LockedPreview entries={lockedEntries} milestone={definition.label} />}
            >
              <div className="grid gap-6 lg:grid-cols-2">
                {lockedEntries.map((entry) => (
                  <RoadmapCard key={entry.id} entry={entry} muted />
                ))}
              </div>
            </TokenGate>
          </div>
        )}
      </div>
    </section>
  );
}

function LockedPreview({ entries, milestone }: { entries: RoadmapEntry[]; milestone: string }) {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-white">{entries.length} token-holder initiatives</h3>
      <p className="text-white/70">Preview of what’s inside once you unlock the {milestone} view.</p>
      <ul className="space-y-2 text-white/70">
        {entries.slice(0, 3).map((entry) => (
          <li key={entry.id} className="flex items-center gap-3">
            <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
            <span className="truncate">{entry.title}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function RoadmapCard({ entry, muted }: { entry: RoadmapEntry; muted?: boolean }) {
  return (
    <article
      className={clsx(
        "roadmap-card relative flex h-full flex-col gap-4 rounded-3xl border border-white/10 bg-black/30 p-6 backdrop-blur",
        muted && "opacity-90",
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs uppercase tracking-[0.3em] text-white/60">
        <span>{entry.product || "Initiative"}</span>
        {entry.status && <span className="rounded-full border border-white/20 px-3 py-1 text-[0.65rem] tracking-[0.25em] text-white/80">{entry.status}</span>}
      </div>
      <div>
        <h3 className="text-2xl font-semibold text-white">{entry.title}</h3>
        <p className="mt-2 text-white/75">{entry.summary}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {entry.tags.map((tag) => (
          <span key={tag} className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/70">
            {tag}
          </span>
        ))}
      </div>
      <dl className="grid gap-2 text-sm text-white/75">
        {entry.owner && (
          <div className="flex justify-between border-t border-white/10 pt-2 text-xs uppercase tracking-[0.3em] text-white/60">
            <span>Owner</span>
            <span className="normal-case tracking-normal text-white">{entry.owner}</span>
          </div>
        )}
        {entry.targetDate && (
          <div className="flex justify-between border-t border-white/10 pt-2 text-xs uppercase tracking-[0.3em] text-white/60">
            <span>Target</span>
            <span className="normal-case tracking-normal text-white">{formatDate(entry.targetDate)}</span>
          </div>
        )}
        {typeof entry.completion === "number" && (
          <div>
            <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-[0.3em] text-white/60">
              <span>Progress</span>
              <span className="normal-case tracking-normal text-white">{Math.round(entry.completion)}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-gradient-to-r from-white/40 to-white" style={{ width: `${Math.min(100, entry.completion)}%` }} />
            </div>
          </div>
        )}
      </dl>
      {entry.resources.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          {entry.resources.map((resource) => (
            <a
              key={`${entry.id}-${resource.label}`}
              href={resource.url}
              target="_blank"
              rel="noreferrer"
              className="text-white/80 underline-offset-4 transition hover:text-white"
            >
              {resource.label}
            </a>
          ))}
        </div>
      )}
    </article>
  );
}

function LoreSection() {
  return (
    <section className="relative mx-auto mb-24 mt-32 max-w-6xl overflow-hidden rounded-[40px] border border-white/10 bg-gradient-to-r from-[#1C0536] via-[#100B3B] to-[#030109] p-10 text-white">
      <div className="absolute inset-0 opacity-70">
        <div className="parallax-bubble absolute -right-10 top-0 h-96 w-96 rounded-full bg-fuchsia-500/20 blur-3xl" data-speed="0.6" />
      </div>
      <div className="relative space-y-6">
        <p className="text-sm uppercase tracking-[0.4em] text-white/70">One-Person $1B Lore</p>
        <h2 className="text-4xl font-semibold">The founder becomes the operating system</h2>
        <p className="max-w-3xl text-lg text-white/80">
          When Sam Altman predicts billion-dollar companies run by ~10 people and Tim Cortinovis coins the “Single-Handed Unicorn,” we take that seriously. FounderOS stitches AI agents, token incentives, and live dashboards so one person can orchestrate everything.
        </p>
        <div className="grid gap-6 md:grid-cols-3">
          {loreHighlights.map((item) => (
            <div key={item.title} className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <p className="text-sm uppercase tracking-[0.3em] text-white/60">{item.caption}</p>
              <p className="text-3xl font-semibold text-white">{item.metric}</p>
              <h3 className="mt-2 text-xl font-semibold">{item.title}</h3>
              <p className="mt-2 text-white/80">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function GradientOrbs() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10">
      <div className="absolute left-10 top-10 h-80 w-80 rounded-full bg-purple-500/20 blur-[140px]" />
      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-blue-500/20 blur-[160px]" />
    </div>
  );
}

function ScrollProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - doc.clientHeight;
      setProgress(scrollable > 0 ? window.scrollY / scrollable : 0);
    };
    update();
    window.addEventListener("scroll", update);
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <div className="fixed right-6 top-32 hidden w-6 flex-col items-center gap-3 text-[10px] uppercase tracking-[0.4em] text-white/50 lg:flex">
      <span>Roadmap</span>
      <div className="h-48 w-px overflow-hidden rounded-full bg-white/10">
        <div
          className="w-full bg-gradient-to-b from-white via-white/80 to-transparent"
          style={{ height: `${Math.min(100, Math.max(0, progress * 100))}%` }}
        />
      </div>
    </div>
  );
}

function Metric({ label, value, sublabel }: { label: string; value: string; sublabel?: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <p className="text-xs uppercase tracking-[0.4em] text-white/60">{label}</p>
      <p className="text-2xl font-semibold">{value}</p>
      {sublabel && <p className="text-sm text-white/70">{sublabel}</p>}
    </div>
  );
}

function formatDate(value?: string) {
  if (!value) return "";
  try {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(value));
  } catch {
    return value;
  }
}
