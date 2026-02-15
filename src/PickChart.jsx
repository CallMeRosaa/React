import React, { useState } from 'react';

const PickChart = ({ items = [{ id: 1, label: 'Digital Form', effort: 20, payoff: 90 }, { id: 2, label: 'New Forklift', effort: 80, payoff: 85 }, { id: 3, label: 'Email Reminders', effort: 10, payoff: 30 }, { id: 4, label: 'Full Re-org', effort: 95, payoff: 10 }] }) => {
  const [hovered, setHovered] = useState(null);
  const size = 400; const padding = 40; const graphSize = size - padding * 2;
  const getX = (val) => padding + (val / 100) * graphSize; const getY = (val) => padding + (graphSize - (val / 100) * graphSize);
  const quadrants = [{ l: 'IMPLEMENT', c: '#10B981', bg: 'rgba(16, 185, 129, 0.1)', x: 0, y: 50 }, { l: 'CHALLENGE', c: '#3B82F6', bg: 'rgba(59, 130, 246, 0.1)', x: 50, y: 50 }, { l: 'POSSIBLE', c: '#F59E0B', bg: 'rgba(245, 158, 11, 0.1)', x: 0, y: 0 }, { l: 'KILL', c: '#EF4444', bg: 'rgba(239, 68, 68, 0.1)', x: 50, y: 0 }];

  return (
    <div className="w-full flex flex-col items-center justify-center bg-[#0A1025] border border-slate-800 rounded-xl p-4">
      <svg width="100%" viewBox={`0 0 ${size} ${size}`} className="font-sans">
        {quadrants.map((q, i) => (
          <g key={i}>
            <rect x={padding + (q.x/100)*graphSize} y={padding + (graphSize - ((q.y+50)/100)*graphSize)} width={graphSize/2} height={graphSize/2} fill={q.bg} />
            <text x={padding + (q.x/100)*graphSize + graphSize/4} y={padding + (graphSize - ((q.y+50)/100)*graphSize) + graphSize/4} fill={q.c} opacity="0.2" fontSize="24" fontWeight="900" textAnchor="middle" dominantBaseline="middle" className="uppercase tracking-widest">{q.l}</text>
          </g>
        ))}
        <text x={size/2} y={size - 5} fill="#94a3b8" textAnchor="middle" fontSize="10" fontWeight="bold">EFFORT (Easy → Hard)</text>
        <text x={10} y={size/2} fill="#94a3b8" textAnchor="middle" transform={`rotate(-90, 10, ${size/2})`} fontSize="10" fontWeight="bold">PAYOFF (Low → High)</text>
        <rect x={padding} y={padding} width={graphSize} height={graphSize} fill="none" stroke="#334155" strokeWidth="2" />
        {items.map((item) => (
          <g key={item.id} onMouseEnter={() => setHovered(item.id)} onMouseLeave={() => setHovered(null)} className="cursor-pointer" style={{ opacity: hovered && hovered !== item.id ? 0.3 : 1 }}>
            <circle cx={getX(item.effort)} cy={getY(item.payoff)} r={hovered === item.id ? 8 : 5} fill="#fff" stroke="#0f172a" strokeWidth="2"/>
            <text x={getX(item.effort)} y={getY(item.payoff) - 12} textAnchor="middle" fill="#f8fafc" fontSize="10" fontWeight="bold" className={`transition-opacity duration-200 ${hovered === item.id ? 'opacity-100' : 'opacity-0'}`}>{item.label}</text>
          </g>
        ))}
      </svg>
    </div>
  );
};
export default PickChart;