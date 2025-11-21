import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { fetchRoadmapData, groupByMilestone, RoadmapItem } from '@/lib/notion';
import HeroSection from '@/components/HeroSection';
import MilestoneSection from '@/components/MilestoneSection';
import VisionSection from '@/components/VisionSection';

export default function Home() {
  const [roadmapData, setRoadmapData] = useState<RoadmapItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetch('/api/roadmap');
        const items = await data.json();
        setRoadmapData(items);
      } catch (error) {
        console.error('Error loading roadmap data:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const grouped = groupByMilestone(roadmapData);

  // Map milestones to market cap sections
  const milestoneSections = [
    {
      title: 'Product-Market Fit',
      subtitle: 'Core features, user validation, and initial traction',
      marketCap: '$25M Market Cap',
      items: grouped['Milestone 1'] || [],
    },
    {
      title: 'Growth',
      subtitle: 'Scaling infrastructure, expanding user base, and revenue optimization',
      marketCap: '$50M Market Cap',
      items: grouped['Milestone 2'] || [],
    },
    {
      title: 'Network Effects',
      subtitle: 'Cross-product integration, ecosystem expansion, and community building',
      marketCap: '$75M Market Cap',
      items: grouped['Milestone 3'] || [],
    },
    {
      title: 'Governance Layer',
      subtitle: 'Decentralized decision-making, token utility, and DAO structure',
      marketCap: '$100M Market Cap',
      items: [], // Can be populated from additional roadmap data
    },
  ];

  return (
    <>
      <Head>
        <title>BearifiedCo Roadmap — Path to $100M and Beyond</title>
        <meta
          name="description"
          content="The BearifiedCo roadmap: from product-market fit to $100M market cap and the vision of a one-person $1B company."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="relative">
        <HeroSection />

        {milestoneSections.map((section, index) => (
          <MilestoneSection
            key={section.marketCap}
            title={section.title}
            subtitle={section.subtitle}
            marketCap={section.marketCap}
            items={section.items}
            index={index + 1}
          />
        ))}

        <VisionSection />

        {/* Footer */}
        <footer className="bg-slate-900 text-gray-400 py-12 text-center">
          <div className="container mx-auto px-6">
            <p className="text-sm">
              © {new Date().getFullYear()} BearifiedCo. Built with Next.js, GSAP, and Notion.
            </p>
            <p className="text-xs mt-2">
              Roadmap data synced from{' '}
              <a
                href="https://www.notion.so/2b26468866ef8093a5bfe0775e96abda"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300"
              >
                Notion Command Center
              </a>
            </p>
          </div>
        </footer>
      </main>
    </>
  );
}

