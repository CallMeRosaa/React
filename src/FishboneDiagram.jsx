import React, { useState } from 'react';

const FishboneDiagram = ({ effect = "Primary Effect", data = null }) => {
  const defaultCategories = [
    { id: 'people', label: 'PEOPLE', items: ['Training', 'Fatigue'] },
    { id: 'process', label: 'PROCESS', items: ['SOP Validity', 'Bottlenecks'] },
    { id: 'tech', label: 'TECHNOLOGY', items: ['Legacy Systems', 'Downtime'] },
    { id: 'materials', label: 'MATERIALS', items: ['Supply Chain', 'Waste'] },
    { id: 'env', label: 'ENVIRONMENT', items: ['Noise', 'Lighting'] },
    { id: 'measure', label: 'MEASUREMENT', items: ['Data Integrity', 'Calibration'] },
  ];
  const categories = data || defaultCategories;
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const width = 800; const height = 450; const spineY = height / 2; const spineStart = 50; const spineEnd = width - 150;
  
  const getRibCoords = (index, isTop) => {
    const spacing = (spineEnd - spineStart) / 4; 
    const xBase = spineEnd - ((index % 3) + 1) * spacing; 
    const xSpine = isTop ? xBase : xBase - 20; 
    const ribLength = 140; const angle = isTop ? -120 : 120; const rad = (angle * Math.PI) / 180;
    return { xSpine, xEnd: xSpine + Math.cos(rad) * ribLength, yEnd: spineY + Math.sin(rad) * ribLength };
  };

  return (
    <div className="w-full h-full flex items-center justify-center bg-[#0A1025] border border-slate-800 rounded-xl overflow-hidden relative">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full max-w-4xl select-none" style={{ fontFamily: 'Inter, sans-serif' }}>
        <defs><marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="#475569" /></marker></defs>
        <line x1={spineStart} y1={spineY} x2={spineEnd} y2={spineY} stroke="#475569" strokeWidth="3" markerEnd="url(#arrowhead)" />
        <g transform={`translate(${spineEnd + 20}, ${spineY - 30})`}>
          <rect x="0" y="0" width="120" height="60" rx="4" fill="#1e293b" stroke="#3B82F6" strokeWidth="2" />
          <text x="60" y="30" dominantBaseline="middle" textAnchor="middle" fill="#F8FAFC" fontSize="12" fontWeight="bold" className="uppercase tracking-wider">{effect}</text>
        </g>
        {categories.map((cat, index) => {
          const isTop = index < 3; const { xSpine, xEnd, yEnd } = getRibCoords(index, isTop); const isHovered = hoveredCategory === cat.id;
          return (
            <g key={cat.id} onMouseEnter={() => setHoveredCategory(cat.id)} onMouseLeave={() => setHoveredCategory(null)} className="cursor-pointer transition-opacity duration-300" style={{ opacity: hoveredCategory && !isHovered ? 0.4 : 1 }}>
              <line x1={xEnd} y1={yEnd} x2={xSpine} y2={spineY} stroke={isHovered ? "#3B82F6" : "#475569"} strokeWidth="2" />
              <g transform={`translate(${xEnd - 60}, ${isTop ? yEnd - 25 : yEnd + 5})`}>
                <rect width="120" height="24" rx="4" fill={isHovered ? "#3B82F6" : "#1e293b"} />
                <text x="60" y="12" textAnchor="middle" dominantBaseline="middle" fill={isHovered ? "#FFF" : "#94a3b8"} fontSize="10" fontWeight="bold" className="uppercase tracking-widest">{cat.label}</text>
              </g>
              {cat.items.map((item, i) => {
                const progress = (i + 1) / (cat.items.length + 1); const itemX = xEnd + (xSpine - xEnd) * progress; const itemY = yEnd + (spineY - yEnd) * progress;
                return (
                  <g key={i}>
                    <line x1={itemX} y1={itemY} x2={itemX + 20} y2={itemY} stroke="#475569" strokeWidth="1" opacity="0.6"/>
                    <text x={itemX + 25} y={itemY + 4} fontSize="9" fill="#94a3b8" className="opacity-80">{item}</text>
                    <circle cx={itemX} cy={itemY} r="2" fill="#475569" />
                  </g>
                );
              })}
            </g>
          );
        })}
      </svg>
    </div>
  );
};
export default FishboneDiagram;