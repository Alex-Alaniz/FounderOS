import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    const title = titleRef.current;
    const subtitle = subtitleRef.current;
    const scrollIndicator = scrollIndicatorRef.current;

    if (!hero || !title || !subtitle || !scrollIndicator) return;

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
        duration: 1.2,
        ease: 'power3.out',
      }
    );

    // Animate subtitle
    gsap.fromTo(
      subtitle,
      {
        opacity: 0,
        y: 30,
      },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        delay: 0.3,
        ease: 'power3.out',
      }
    );

    // Animate scroll indicator
    gsap.fromTo(
      scrollIndicator,
      {
        opacity: 0,
        y: -10,
      },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        delay: 0.8,
        ease: 'power2.out',
      }
    );

    // Parallax effect
    gsap.to(hero, {
      y: -100,
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });
  }, []);

  return (
    <section
      ref={heroRef}
      className="scroll-section relative bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 overflow-hidden"
    >
      {/* Animated background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.3),transparent_50%)] animate-pulse" />
      </div>

      <div className="relative z-10 flex items-center justify-center w-full h-full">
        <div className="container mx-auto px-6 py-20 max-w-6xl text-center">
          <h1
            ref={titleRef}
            className="text-7xl md:text-9xl font-black text-white mb-6 leading-tight"
          >
            BearifiedCo
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Roadmap
            </span>
          </h1>
          <p
            ref={subtitleRef}
            className="text-2xl md:text-3xl text-gray-300 max-w-3xl mx-auto mb-12"
          >
            The path to $100M market cap and beyond — powered by AI, automation, and one founder's
            vision
          </p>

          <div
            ref={scrollIndicatorRef}
            className="flex flex-col items-center gap-2 text-gray-400"
          >
            <span className="text-sm font-medium">Scroll to explore</span>
            <svg
              className="w-6 h-6 animate-bounce"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}

