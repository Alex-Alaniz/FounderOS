import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function VisionSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    const quote = quoteRef.current;
    const stats = statsRef.current;

    if (!section || !content || !quote || !stats) return;

    // Pin the section
    ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: '+=300%',
      pin: true,
      pinSpacing: true,
    });

    // Animate quote
    gsap.fromTo(
      quote,
      {
        opacity: 0,
        scale: 0.9,
      },
      {
        opacity: 1,
        scale: 1,
        duration: 1.5,
        scrollTrigger: {
          trigger: section,
          start: 'top 70%',
          end: 'top 30%',
          scrub: true,
        },
      }
    );

    // Animate stats
    gsap.fromTo(
      stats.children,
      {
        opacity: 0,
        y: 30,
      },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.2,
        scrollTrigger: {
          trigger: section,
          start: 'top 50%',
          end: 'top 20%',
          scrub: true,
        },
      }
    );
  }, []);

  return (
    <section
      ref={sectionRef}
      className="scroll-section relative bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-900"
    >
      <div ref={contentRef} className="parallax-layer flex items-center justify-center w-full h-full">
        <div className="container mx-auto px-6 py-20 max-w-5xl">
          <div className="text-center mb-16">
            <div className="inline-block px-6 py-2 bg-purple-500/20 rounded-full border border-purple-400/30 mb-6">
              <span className="text-purple-300 text-sm font-semibold">THE VISION</span>
            </div>
            <h2 className="text-6xl md:text-8xl font-bold text-white mb-8">
              One-Person $1B Company
            </h2>
          </div>

          <div ref={quoteRef} className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 md:p-12 mb-16 border border-white/20">
            <blockquote className="text-2xl md:text-3xl text-white font-light leading-relaxed mb-6">
              "Soon there will be billion-dollar companies run by teams of ~10 — implying that even
              a single founder could one day reach unicorn status."
            </blockquote>
            <cite className="text-lg text-purple-300 font-medium">— Sam Altman, OpenAI CEO</cite>
          </div>

          <div ref={statsRef} className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold text-white mb-2">1</div>
              <div className="text-xl text-purple-300 font-semibold mb-2">Person</div>
              <div className="text-sm text-gray-400">Global Impact</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-white mb-2">$1B</div>
              <div className="text-xl text-purple-300 font-semibold mb-2">Valuation</div>
              <div className="text-sm text-gray-400">AI-Powered Scale</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-white mb-2">∞</div>
              <div className="text-xl text-purple-300 font-semibold mb-2">Possibility</div>
              <div className="text-sm text-gray-400">Exponential Growth</div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <p className="text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Modern tools — especially AI and automation — let a solo founder scale far beyond
              historical limits. The "Single-Handed Unicorn" (Tim Cortinovis) is no longer a
              fantasy. With AI agents, no-code platforms, and autonomous workflows, one person can
              orchestrate what once required entire teams.
            </p>
            <p className="text-lg text-purple-300 font-semibold mt-6">
              BearifiedCo is building that future. Today.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

