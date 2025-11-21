"use client";

import React from "react";

interface RoadmapCardProps {
  title: string;
  product: string;
  description: string;
  status: string;
  priority: string;
}

const productColors: Record<string, string> = {
  BEARO: "bg-blue-500",
  PRIMAPE: "bg-orange-500",
  CHIMPANION: "bg-green-500",
  FounderOS: "bg-purple-600",
  BEARCO: "bg-yellow-500",
  General: "bg-gray-500",
};

export const RoadmapCard: React.FC<RoadmapCardProps> = ({
  title,
  product,
  description,
  status,
  priority,
}) => {
  const colorClass = productColors[product] || productColors.General;

  return (
    <div className="roadmap-card bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 p-6 rounded-xl shadow-xl hover:border-zinc-600 transition-colors duration-300 max-w-md w-full mb-4">
      <div className="flex justify-between items-start mb-3">
        <span className={`text-xs font-bold px-2 py-1 rounded-full text-white ${colorClass}`}>
          {product}
        </span>
        <span className="text-xs text-zinc-400 border border-zinc-700 px-2 py-1 rounded-full">
          {status}
        </span>
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-zinc-400 text-sm mb-4">{description}</p>
      <div className="flex items-center justify-between">
        <span className="text-xs text-zinc-500">{priority}</span>
      </div>
    </div>
  );
};

