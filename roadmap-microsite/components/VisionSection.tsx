'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default function VisionSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const quoteRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current || !quoteRef.current || !statsRef.current) return

    // Animate quote on scroll
    gsap.fromTo(
      quoteRef.current,
      {
        opacity: 0,
        y: 50,
      },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          toggleActions: 'play none none reverse',
        },
      }
    )

    // Animate stats
    const stats = statsRef.current.querySelectorAll('.stat-item')
    stats.forEach((stat, index) => {
      gsap.fromTo(
        stat,
        {
          opacity: 0,
          scale: 0.8,
        },
        {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          delay: index * 0.1,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 60%',
            toggleActions: 'play none none reverse',
          },
        }
      )
    })

    // Parallax background
    gsap.to(sectionRef.current.querySelector('.vision-bg'), {
      scale: 1.1,
      ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    })
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center py-20 px-6 overflow-hidden"
    >
      {/* Background */}
      <div className="vision-bg absolute inset-0 bg-gradient-to-br from-purple-900 via-pink-900 to-orange-900 opacity-30" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(168,85,247,0.2),transparent_50%)]" />

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Main Heading */}
        <div className="text-center mb-16">
          <h2 className="text-6xl md:text-8xl font-bold mb-6 font-display text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400">
            One-Person $1B Company
          </h2>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
            The future of entrepreneurship is here. AI-powered tools enable
            solo founders to build and scale companies that were once
            impossible.
          </p>
        </div>

        {/* Quote */}
        <div
          ref={quoteRef}
          className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 md:p-12 mb-16 border border-gray-700"
        >
          <blockquote className="text-2xl md:text-3xl font-medium text-center mb-6 text-gray-200">
            "Soon there will be billion-dollar companies run by teams of ~10
            people."
          </blockquote>
          <p className="text-center text-gray-400 text-lg">
            — Sam Altman, OpenAI CEO
          </p>
        </div>

        {/* Stats Grid */}
        <div
          ref={statsRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
        >
          <div className="stat-item text-center">
            <div className="text-5xl md:text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
              1
            </div>
            <h3 className="text-xl font-semibold mb-2">Founder</h3>
            <p className="text-gray-400">
              One person orchestrating AI agents, automation, and global
              operations
            </p>
          </div>
          <div className="stat-item text-center">
            <div className="text-5xl md:text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              $1B
            </div>
            <h3 className="text-xl font-semibold mb-2">Vision</h3>
            <p className="text-gray-400">
              Unicorn status achieved through AI, automation, and network
              effects
            </p>
          </div>
          <div className="stat-item text-center">
            <div className="text-5xl md:text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
              ∞
            </div>
            <h3 className="text-xl font-semibold mb-2">Scale</h3>
            <p className="text-gray-400">
              Autonomous systems that grow exponentially without linear
              resource scaling
            </p>
          </div>
        </div>

        {/* Vision Narrative */}
        <div className="prose prose-invert max-w-none">
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-8 border border-gray-700">
            <h3 className="text-2xl font-bold mb-4 text-gray-200">
              The Single-Handed Unicorn
            </h3>
            <p className="text-gray-300 leading-relaxed mb-4">
              Tim Cortinovis coined the term "Single-Handed Unicorn" to describe
              companies built by solo founders that reach billion-dollar
              valuations. This isn't science fiction—it's the reality of modern
              entrepreneurship.
            </p>
            <p className="text-gray-300 leading-relaxed mb-4">
              BearifiedCo represents this vision: one founder leveraging AI
              agents, no-code tools, and automation to build a multi-product
              ecosystem. Each product—BEARO, AlphaBuilder, Primape,
              Chimpanion—operates autonomously while contributing to a unified
              ecosystem.
            </p>
            <p className="text-gray-300 leading-relaxed">
              The path to $1B isn't about hiring more people—it's about
              building better systems. FounderOS orchestrates everything:
              product development, customer acquisition, operations, and
              growth—all automated, all scalable, all driven by one vision.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

