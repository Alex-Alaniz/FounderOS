import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { RoadmapItem } from '@/lib/notion';

gsap.registerPlugin(ScrollTrigger);

interface MilestoneSectionProps {
  title: string;
  subtitle: string;
  marketCap: string;
  items: RoadmapItem[];
  index: number;
}

export default function MilestoneSection({
  title,
  subtitle,
  marketCap,
  items,
  index,
}: MilestoneSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const itemsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    const title = titleRef.current;
    const items = itemsRef.current;

    if (!section || !content || !title || !items) return;

    // Pin the section
    ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: '+=200%',
      pin: true,
      pinSpacing: true,
    });

    // Animate title
    gsap.fromTo(
      title,
      {
        opacity: 0,
        y: 50,
      },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          end: 'top 20%',
          scrub: true,
        },
      }
    );

    // Animate items
    gsap.fromTo(
      items.children,
      {
        opacity: 0,
        x: -50,
      },
      {
        opacity: 1,
        x: 0,
        duration: 0.8,
        stagger: 0.1,
        scrollTrigger: {
          trigger: section,
          start: 'top 60%',
          end: 'top 20%',
          scrub: true,
        },
      }
    );

    // Parallax effect on background
    gsap.to(content, {
      y: -100,
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      className="scroll-section relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900"
      style={{ zIndex: index }}
    >
      <div ref={contentRef} className="parallax-layer flex items-center justify-center w-full h-full">
        <div className="container mx-auto px-6 py-20 max-w-6xl">
          <div className="text-center mb-16">
            <div className="inline-block px-6 py-2 bg-blue-500/20 rounded-full border border-blue-400/30 mb-6">
              <span className="text-blue-300 text-sm font-semibold">{marketCap}</span>
            </div>
            <h2 ref={titleRef} className="text-6xl md:text-8xl font-bold text-white mb-4">
              {title}
            </h2>
            <p className="text-xl md:text-2xl text-blue-200 max-w-3xl mx-auto">{subtitle}</p>
          </div>

          <div ref={itemsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item, i) => (
              <div
                key={item.id}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/20 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-xs font-semibold text-blue-300 uppercase tracking-wide">
                    {item.product}
                  </span>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      item.status === 'Complete'
                        ? 'bg-green-500/20 text-green-300'
                        : item.status === 'In Progress'
                        ? 'bg-blue-500/20 text-blue-300'
                        : 'bg-gray-500/20 text-gray-300'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{item.initiative}</h3>
                {item.description && (
                  <p className="text-sm text-gray-300 line-clamp-3">{item.description}</p>
                )}
                {item.dueDate && (
                  <p className="text-xs text-gray-400 mt-3">
                    Due: {new Date(item.dueDate).toLocaleDateString()}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

