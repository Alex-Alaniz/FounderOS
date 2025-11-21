"use client";

import React, { useRef } from "react";
import { useGSAP } from "@/lib/gsap";
import gsap from "gsap";

interface ScrollSectionProps {
  title: string;
  subtitle: string;
  description: string;
  marketCap: string;
  children?: React.ReactNode;
  theme?: "dark" | "light";
}

export const ScrollSection: React.FC<ScrollSectionProps> = ({
  title,
  subtitle,
  description,
  marketCap,
  children,
  theme = "dark",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const mcRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current || !contentRef.current) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top center",
          end: "bottom center",
          toggleActions: "play reverse play reverse",
          scrub: 1,
        },
      });

      tl.from(contentRef.current, {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });
      
      if(mcRef.current) {
        tl.from(mcRef.current, {
            scale: 0.8,
            opacity: 0,
            duration: 1, 
        }, "<")
      }
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      className={`min-h-screen flex flex-col md:flex-row items-center justify-center p-6 md:p-20 relative overflow-hidden ${
        theme === "dark" ? "bg-black text-white" : "bg-zinc-100 text-black"
      }`}
    >
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),transparent_50%)]"></div>
      </div>

      <div className="z-10 flex-1 max-w-2xl space-y-6" ref={contentRef}>
        <div className="flex items-center gap-4 mb-2">
             <div ref={mcRef} className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">
            {marketCap}
             </div>
        </div>
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight">{title}</h2>
        <h3 className="text-xl md:text-2xl text-zinc-400 font-medium">{subtitle}</h3>
        <p className="text-lg md:text-xl text-zinc-500 leading-relaxed">
          {description}
        </p>
      </div>

      <div className="flex-1 mt-10 md:mt-0 w-full flex flex-col items-center gap-4 perspective-1000">
        {children}
      </div>
    </section>
  );
};

