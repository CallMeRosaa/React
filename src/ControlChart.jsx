import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

const ControlChart = () => {
  const data = [
    { id: 1, val: 42 }, { id: 2, val: 45 }, { id: 3, val: 41 }, { id: 4, val: 48 },
    { id: 5, val: 43 }, { id: 6, val: 46 }, { id: 7, val: 44 }, { id: 8, val: 42 },
    { id: 9, val: 35 }, { id: 10, val: 32 }, { id: 11, val: 34 }, { id: 12, val: 31 },
    { id: 13, val: 33 }, { id: 14, val: 30 }, { id: 15, val: 32 }, { id: 16, val: 33 }
  ];
  const mean = 38; const ucl = 52; const lcl = 24;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-700 p-2 rounded shadow-xl">
          <p className="text-slate-400 text-xs mb-1">Obs #{label}</p>
          <p className="text-white text-sm font-bold">Val: <span className="text-blue-400">{payload[0].value}</span></p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-64 bg-[#0A1025] border border-slate-800 rounded-xl p-4 flex flex-col">
      <div className="flex justify-between items-center mb-2 px-2">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Process Control (I-MR)</h4>
        <div className="flex gap-3 text-[10px] font-mono">
          <span className="text-red-400">-- Limits</span>
          <span className="text-emerald-500">-- Mean</span>
        </div>
      </div>
      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis dataKey="id" stroke="#64748b" tick={{fontSize: 10}} tickLine={false} axisLine={false} />
            <YAxis stroke="#64748b" tick={{fontSize: 10}} tickLine={false} axisLine={false} domain={[20, 60]} />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#334155', strokeWidth: 1 }} />
            <ReferenceLine y={ucl} stroke="#EF4444" strokeDasharray="4 4" />
            <ReferenceLine y={lcl} stroke="#EF4444" strokeDasharray="4 4" />
            <ReferenceLine y={mean} stroke="#10B981" strokeWidth={1} />
            <Line type="monotone" dataKey="val" stroke="#3B82F6" strokeWidth={2} dot={{ r: 3, fill: '#1e293b', stroke: '#3B82F6' }} activeDot={{ r: 5, fill: '#3B82F6' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
export default ControlChart;