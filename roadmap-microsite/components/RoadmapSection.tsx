'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

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

interface RoadmapSectionProps {
  roadmapData: RoadmapItem[]
}

export default function RoadmapSection({ roadmapData }: RoadmapSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    if (!sectionRef.current) return

    // Animate roadmap items on scroll
    const items = sectionRef.current.querySelectorAll('.roadmap-item')
    items.forEach((item, index) => {
      gsap.fromTo(
        item,
        {
          opacity: 0,
          x: -50,
        },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          delay: index * 0.05,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      )
    })
  }, [roadmapData, filter])

  const filteredData =
    filter === 'all'
      ? roadmapData
      : roadmapData.filter((item) => item.product === filter)

  const products = ['all', ...Array.from(new Set(roadmapData.map((item) => item.product)))]

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen py-20 px-6 bg-gray-900"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-5xl md:text-6xl font-bold mb-4 font-display">
            Full Roadmap
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Complete view of all initiatives across the BearifiedCo ecosystem
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {products.map((product) => (
            <button
              key={product}
              onClick={() => setFilter(product)}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                filter === product
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {product === 'all' ? 'All Products' : product}
            </button>
          ))}
        </div>

        {/* Roadmap Items */}
        <div className="space-y-4">
          {filteredData.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p>No roadmap items found.</p>
            </div>
          ) : (
            filteredData.map((item) => (
              <div
                key={item.id}
                className="roadmap-item bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-4 mb-2">
                      <h3 className="text-xl font-semibold">{item.initiative}</h3>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${
                          item.status === 'Complete'
                            ? 'bg-green-500/20 text-green-400'
                            : item.status === 'In Progress'
                            ? 'bg-blue-500/20 text-blue-400'
                            : item.status === 'Blocked'
                            ? 'bg-red-500/20 text-red-400'
                            : 'bg-gray-500/20 text-gray-400'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-3 mb-3 text-sm text-gray-400">
                      <span className="font-medium">{item.product}</span>
                      {item.milestone && (
                        <>
                          <span>•</span>
                          <span>{item.milestone}</span>
                        </>
                      )}
                      {item.priority && (
                        <>
                          <span>•</span>
                          <span>{item.priority}</span>
                        </>
                      )}
                    </div>
                    {item.description && (
                      <p className="text-gray-300 mb-3">{item.description}</p>
                    )}
                    {item.project && (
                      <p className="text-sm text-gray-500">Project: {item.project}</p>
                    )}
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    {item.dueDate && (
                      <div>
                        Due: {new Date(item.dueDate).toLocaleDateString()}
                      </div>
                    )}
                    {item.startDate && (
                      <div>
                        Start: {new Date(item.startDate).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  )
}

