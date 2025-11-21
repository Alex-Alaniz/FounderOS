'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

interface Milestone {
  id: string
  title: string
  subtitle: string
  description: string
  color: string
  roadmapItems: any[]
}

interface MilestoneSectionProps {
  milestone: Milestone
  index: number
}

const colorClasses = {
  blue: 'from-blue-500 to-cyan-500',
  purple: 'from-purple-500 to-pink-500',
  green: 'from-green-500 to-emerald-500',
  yellow: 'from-yellow-500 to-orange-500',
}

export default function MilestoneSection({
  milestone,
  index,
}: MilestoneSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const numberRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current || !contentRef.current || !numberRef.current) return

    // Animate number counter
    const numberEl = numberRef.current
    const targetValue = parseInt(milestone.title.match(/\$(\d+)M/)?.[1] || '0')
    
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top 80%',
      onEnter: () => {
        gsap.to(numberEl, {
          innerHTML: targetValue,
          duration: 1.5,
          ease: 'power2.out',
          snap: { innerHTML: 1 },
          onUpdate: function () {
            numberEl.innerHTML = `$${Math.ceil(this.targets()[0].innerHTML)}M`
          },
        })
      },
    })

    // Parallax effect for background
    gsap.to(sectionRef.current.querySelector('.milestone-bg'), {
      yPercent: -30,
      ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    })
  }, [milestone])

  return (
    <section
      ref={sectionRef}
      className="milestone-section relative min-h-screen flex items-center justify-center py-20 px-6 overflow-hidden"
    >
      {/* Background */}
      <div
        className={`milestone-bg absolute inset-0 bg-gradient-to-br ${colorClasses[milestone.color as keyof typeof colorClasses]} opacity-10`}
      />

      {/* Content */}
      <div
        ref={contentRef}
        className="relative z-10 max-w-5xl mx-auto text-center"
      >
        {/* Milestone Number */}
        <div className="mb-8">
          <div
            ref={numberRef}
            className={`text-9xl md:text-[12rem] font-bold text-transparent bg-clip-text bg-gradient-to-r ${colorClasses[milestone.color as keyof typeof colorClasses]} opacity-20`}
          >
            ${milestone.title.match(/\$(\d+)M/)?.[1]}M
          </div>
        </div>

        {/* Title */}
        <h2 className="text-5xl md:text-7xl font-bold mb-4 font-display">
          {milestone.title}
        </h2>

        {/* Subtitle */}
        <h3 className="text-2xl md:text-3xl text-gray-400 mb-8 font-semibold">
          {milestone.subtitle}
        </h3>

        {/* Description */}
        <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
          {milestone.description}
        </p>

        {/* Roadmap Items Preview */}
        {milestone.roadmapItems.length > 0 && (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {milestone.roadmapItems.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-lg">{item.initiative}</h4>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      item.status === 'Complete'
                        ? 'bg-green-500/20 text-green-400'
                        : item.status === 'In Progress'
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'bg-gray-500/20 text-gray-400'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
                <p className="text-sm text-gray-400 mb-2">{item.product}</p>
                {item.description && (
                  <p className="text-sm text-gray-500 line-clamp-2">
                    {item.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

