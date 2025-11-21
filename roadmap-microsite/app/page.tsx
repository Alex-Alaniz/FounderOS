'use client'

import { useEffect, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import HeroSection from '@/components/HeroSection'
import MilestoneSection from '@/components/MilestoneSection'
import VisionSection from '@/components/VisionSection'
import RoadmapSection from '@/components/RoadmapSection'
import TokenGate from '@/components/TokenGate'

gsap.registerPlugin(ScrollTrigger)

interface RoadmapItem {
  id: string
  initiative: string
  product: string
  milestone: string
  status: string
  priority: string
  project: string
  startDate: string | null
  dueDate: string | null
  description: string | null
}

export default function Home() {
  const [roadmapData, setRoadmapData] = useState<RoadmapItem[]>([])
  const [isTokenGated, setIsTokenGated] = useState(false)
  const [isUnlocked, setIsUnlocked] = useState(false)

  useEffect(() => {
    fetch('/api/roadmap')
      .then((res) => res.json())
      .then((data) => setRoadmapData(data.items || []))
      .catch((err) => console.error('Failed to fetch roadmap:', err))
  }, [])

  useEffect(() => {
    // Initialize GSAP ScrollTrigger animations
    const sections = document.querySelectorAll('.milestone-section')
    
    sections.forEach((section, index) => {
      gsap.fromTo(
        section,
        {
          opacity: 0,
          y: 100,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            end: 'top 20%',
            toggleActions: 'play none none reverse',
          },
        }
      )
    })

    // Parallax effect for hero
    gsap.to('.hero-bg', {
      yPercent: 50,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero-section',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    })

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [roadmapData])

  const milestones = [
    {
      id: '25m',
      title: '$25M Market Cap',
      subtitle: 'Product-Market Fit',
      description: 'Achieving validation across core products. BEARO payments live, AlphaBuilder MVP launched, Primape gaining traction.',
      color: 'blue',
      roadmapItems: roadmapData.filter((item) => 
        item.milestone === 'Milestone 1' || item.priority === 'P0 (Critical)'
      ),
    },
    {
      id: '50m',
      title: '$50M Market Cap',
      subtitle: 'Growth',
      description: 'Scaling user acquisition and network effects. Cross-product integrations, merchant partnerships, and community expansion.',
      color: 'purple',
      roadmapItems: roadmapData.filter((item) => 
        item.milestone === 'Milestone 2'
      ),
    },
    {
      id: '75m',
      title: '$75M Market Cap',
      subtitle: 'Network Effects',
      description: 'Ecosystem maturity. Autonomous shipping loops, AI agent orchestration, and self-sustaining growth cycles.',
      color: 'green',
      roadmapItems: roadmapData.filter((item) => 
        item.milestone === 'Milestone 3'
      ),
    },
    {
      id: '100m',
      title: '$100M Market Cap',
      subtitle: 'Governance Layer',
      description: 'Decentralized decision-making. Token governance, community-driven roadmap, and sustainable ecosystem operations.',
      color: 'yellow',
      roadmapItems: roadmapData.filter((item) => 
        item.product === 'BEARCO' || item.project?.includes('Governance')
      ),
    },
  ]

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Milestone Sections */}
      {milestones.map((milestone, index) => (
        <MilestoneSection
          key={milestone.id}
          milestone={milestone}
          index={index}
        />
      ))}

      {/* Vision Section - One-Person $1B Company */}
      <VisionSection />

      {/* Roadmap Section */}
      {isTokenGated && !isUnlocked ? (
        <TokenGate onUnlock={() => setIsUnlocked(true)} />
      ) : (
        <RoadmapSection roadmapData={roadmapData} />
      )}

      {/* Footer */}
      <footer className="py-12 px-6 text-center text-gray-400">
        <p className="mb-2">BearifiedCo Roadmap</p>
        <p className="text-sm">
          Built with Next.js, GSAP, and Notion API
        </p>
      </footer>
    </main>
  )
}

