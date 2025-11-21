"use client";

import React, { useRef } from "react";
import { useGSAP } from "@/lib/gsap";
import gsap from "gsap";

export const UnicornSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current) return;
      
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top center",
          end: "bottom center",
          scrub: true,
        },
      });

      tl.from(textRef.current, {
        opacity: 0,
        y: 100,
        duration: 1,
      });

      tl.from(quoteRef.current, {
        opacity: 0,
        scale: 0.9,
        duration: 1,
      }, "+=0.5");
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      className="min-h-screen flex flex-col items-center justify-center p-8 bg-zinc-950 text-white relative overflow-hidden border-t border-zinc-800"
    >
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20"></div>
      
      <div className="max-w-4xl mx-auto text-center z-10 space-y-12">
        <div ref={textRef} className="space-y-6">
          <h2 className="text-5xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-zinc-200 to-zinc-600">
            One Person.
            <br />
            One Billion.
          </h2>
          <p className="text-xl md:text-2xl text-zinc-400 leading-relaxed max-w-2xl mx-auto">
            The era of the "Single-Handed Unicorn" is here. Powered by AI, automation, and the FounderOS ecosystem, we are proving that one founder can scale beyond historical limits.
          </p>
        </div>

        <div ref={quoteRef} className="bg-zinc-900/50 p-8 rounded-2xl border border-zinc-800 backdrop-blur-md max-w-3xl mx-auto">
          <blockquote className="text-lg md:text-xl italic text-zinc-300 mb-4">
            "Soon there will be billion-dollar companies run by teams of ~10."
          </blockquote>
          <cite className="text-zinc-500 font-medium not-italic">
            — Sam Altman, OpenAI
          </cite>
          <div className="mt-6 text-sm text-zinc-500 border-t border-zinc-800 pt-4">
            The BearifiedCo mission is to push this boundary even further. One founder. Global impact.
          </div>
        </div>

        <div className="pt-20 opacity-50 hover:opacity-100 transition-opacity duration-500">
           <p className="text-xs text-zinc-600 uppercase tracking-widest">BearifiedCo • FounderOS • Step 6</p>
        </div>
      </div>
    </section>
  );
};

