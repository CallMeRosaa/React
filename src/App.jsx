import React, { useState, useEffect, useRef } from 'react';
import { Target, BarChart2, Search, Zap, Rocket, CheckCircle, Lock, Send, X, FileText, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line, ComposedChart } from 'recharts';
import FishboneDiagram from './FishboneDiagram';
import PickChart from './PickChart';
import ControlChart from './ControlChart';

const STEPS = [
  { id: 1, label: "Clarify & Validate", description: "Define the pain, scope, and impact", color: "text-blue-500", icon: <Target className="w-5 h-5" />, opener: "Let's start at the beginning. **What process is causing pain right now?** Don't give me a polished answer — tell me what's actually happening on the floor.", criteria: ["1.1: Problem Statement describes pain", "1.2: Addresses who, what, where, when", "1.3: Free of opinions/solutions", "1.4: Identifies current standard", "1.5: Visual depiction included"], pitfalls: ["Mixing units of measure", "Setting a 'target' line in Step 1", "Vague language without units"] },
  { id: 2, label: "Break Down Problem", description: "Identify performance gaps", color: "text-emerald-500", icon: <BarChart2 className="w-5 h-5" />, opener: "Step 2 is about breaking the problem open. **Walk me through the process, step by step.** Where do things slow down?", criteria: ["2.1: CI² methods used", "2.2: Voice of Customer (VoC)", "2.3: Lagging metrics supplied", "2.4: Visual representation (Pareto)"], pitfalls: ["Process flow without drill-downs", "No Pareto chart", "VoC not tied to measurable CTQs"] },
  { id: 3, label: "Set Targets", description: "SMART targets tied to Steps 1 & 2", color: "text-amber-500", icon: <Target className="w-5 h-5" />, opener: "Step 3 — surgical precision required. **What metric did you establish, and what realistic target are you aiming for?**", criteria: ["3.1: Metric matches Step 2", "3.2: Targets are SMART", "3.3: No new targets introduced"], pitfalls: ["Target language not time-bound", "Switching units of measure", "Introducing new metrics"] },
  { id: 4, label: "Cause Analysis", description: "Identify and validate root causes", color: "text-violet-500", icon: <Search className="w-5 h-5" />, opener: "Step 4. **Based on Step 2, what do you think is driving the performance gap?** Give me your best theory, then we'll prove it with data.", criteria: ["4.1: Root cause shows relationship to gap", "4.2: RCA tools used (Fishbone)", "4.3: Data validates root causes"], pitfalls: ["Good logic but no data", "Root causes not tied back to VoP", "Confusing symptoms with causes"] },
  { id: 5, label: "Develop Countermeasures", description: "Design solutions", color: "text-pink-500", icon: <Zap className="w-5 h-5" />, opener: "Step 5. **What solutions have you been considering?** Tip: list MORE potential countermeasures than you plan to implement.", criteria: ["5.1: Address root causes", "5.2: Recognized methods used", "5.3: Pilot results validate impact", "5.4: Prioritization tools used (PICK)"], pitfalls: ["Only listing 3-4 potential CMs", "PICK chart not matching table", "No pilot data"] },
  { id: 6, label: "See Through", description: "Execute action plan", color: "text-red-500", icon: <Rocket className="w-5 h-5" />, opener: "Step 6 — execution. **Walk me through your implementation plan.** Who is doing what, by when?", criteria: ["6.1: Actionable steps with POC", "6.2: Tasks detailed", "6.3: 100% of tasks completed"], pitfalls: ["Missing CMs from Step 5", "Including CMs not selected", "Tasks too vague"] },
  { id: 7, label: "Confirm Results", description: "Validate results", color: "text-cyan-500", icon: <CheckCircle className="w-5 h-5" />, opener: "Step 7. **Show me your results data.** What changed after implementation?", criteria: ["7.1: Results address problem", "7.2: Meet target", "7.3: Visual representation", "7.4: Recent measurement"], pitfalls: ["Using different KPIs/units", "Data older than 6 months", "Missing target"] },
  { id: 8, label: "Standardize & Scale", description: "Sustain gains", color: "text-lime-500", icon: <Lock className="w-5 h-5" />, opener: "Step 8. **Who owns monitoring this? What policy codifies the change?**", criteria: ["8.1: New standard work", "8.2: Codified in policy", "8.3: Actions taken to share"], pitfalls: ["Assigning ownership to org not position", "Email as sole codification", "No recurring measurement"] }
];

const BaselineChart = () => (
  <div className="h-64 w-full"><ResponsiveContainer><BarChart data={[{name:'Jan',val:45},{name:'Feb',val:52},{name:'Mar',val:48},{name:'Apr',val:61}]}><CartesianGrid strokeDasharray="3 3" stroke="#334155"/><XAxis dataKey="name" stroke="#94a3b8"/><YAxis stroke="#94a3b8"/><RechartsTooltip contentStyle={{backgroundColor:'#0f172a',borderColor:'#334155'}}/><Bar dataKey="val" fill="#3B82F6" name="Performance"/></BarChart></ResponsiveContainer></div>
);
const ParetoChart = () => (
  <div className="h-64 w-full"><ResponsiveContainer><ComposedChart data={[{name:'Forms',count:45,cum:45},{name:'Sigs',count:28,cum:73},{name:'NSN',count:18,cum:91},{name:'Late',count:14,cum:105}]}><CartesianGrid strokeDasharray="3 3" stroke="#334155"/><XAxis dataKey="name" stroke="#94a3b8"/><YAxis yAxisId="left" stroke="#94a3b8"/><YAxis yAxisId="right" orientation="right" stroke="#10B981"/><RechartsTooltip contentStyle={{backgroundColor:'#0f172a',borderColor:'#334155'}}/><Bar yAxisId="left" dataKey="count" fill="#3B82F6" barSize={20}/><Line yAxisId="right" type="monotone" dataKey="cum" stroke="#10B981"/></ComposedChart></ResponsiveContainer></div>
);

export default function CPIMentor() {
  const [activeStepId, setActiveStepId] = useState(1);
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [panelMode, setPanelMode] = useState('rubric'); 
  const [input, setInput] = useState('');
  const [chatHistory, setChatHistory] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);
  const activeStep = STEPS.find(s => s.id === activeStepId);

  useEffect(() => {
    if (!chatHistory[activeStepId]) {
      setChatHistory(prev => ({ ...prev, [activeStepId]: [{ role: 'assistant', content: activeStep.opener }] }));
    }
  }, [activeStepId]);

  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [chatHistory, activeStepId]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user', content: input };
    setChatHistory(prev => ({ ...prev, [activeStepId]: [...(prev[activeStepId] || []), userMsg] }));
    setInput('');
    setIsLoading(true);
    setTimeout(() => {
      setChatHistory(prev => ({ ...prev, [activeStepId]: [...prev[activeStepId], { role: 'assistant', content: "That's a good start. Can you quantify the specific impact?" }] }));
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="flex h-screen w-full bg-[#070D1B] text-slate-200 overflow-hidden font-sans">
      <div className="w-64 flex flex-col border-r border-slate-800 bg-[#070D1B] flex-shrink-0">
        <div className="p-5 border-b border-slate-800"><div className="flex items-center gap-2 mb-1"><span className="text-xl">🎖️</span><h1 className="font-bold text-white tracking-tight">CPI Mentor</h1></div><p className="text-xs text-slate-500 font-mono">DAF 8-STEP A3 FRAMEWORK</p></div>
        <div className="flex-1 overflow-y-auto py-4 space-y-1">
          {STEPS.map((step) => (
            <button key={step.id} onClick={() => setActiveStepId(step.id)} className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors border-l-2 ${activeStepId === step.id ? `bg-slate-800/50 border-${step.color.split('-')[1]}-500 text-white` : 'border-transparent text-slate-500 hover:text-slate-300 hover:bg-slate-900'}`}><span className={`font-mono text-xs opacity-70 ${activeStepId === step.id ? step.color : ''}`}>0{step.id}</span><span className="text-sm font-medium truncate">{step.label}</span></button>
          ))}
        </div>
        <div className="p-4 border-t border-slate-800 text-[10px] text-slate-600 uppercase tracking-wider text-center">Emerald Spark Cell • 96 TW</div>
      </div>

      <div className="flex-1 flex flex-col min-w-0 bg-[#070D1B] relative">
        <div className="h-16 border-b border-slate-800 flex items-center justify-between px-6 bg-[#070D1B]/95 backdrop-blur z-10">
          <div className="flex items-center gap-3"><div className={`p-2 rounded-lg bg-slate-900 ${activeStep.color}`}>{activeStep.icon}</div><div><h2 className="text-sm font-bold text-white flex items-center gap-2">STEP {activeStep.id}: {activeStep.label.toUpperCase()}</h2><p className="text-xs text-slate-400">{activeStep.description}</p></div></div>
          <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-800">
            <button onClick={() => { setPanelMode('rubric'); setIsPanelOpen(true); }} className={`px-3 py-1.5 rounded text-xs font-medium flex items-center gap-2 transition-all ${isPanelOpen && panelMode === 'rubric' ? 'bg-slate-700 text-white' : 'text-slate-400'}`}><FileText className="w-3 h-3" /> Rubric</button>
            <button onClick={() => { setPanelMode('charts'); setIsPanelOpen(true); }} className={`px-3 py-1.5 rounded text-xs font-medium flex items-center gap-2 transition-all ${isPanelOpen && panelMode === 'charts' ? 'bg-slate-700 text-white' : 'text-slate-400'}`}><BarChart2 className="w-3 h-3" /> Charts</button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-6" ref={scrollRef}>
          {chatHistory[activeStepId]?.map((msg, idx) => (
            <div key={idx} className={`flex gap-4 max-w-3xl ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'assistant' ? 'bg-slate-800 text-blue-400' : 'bg-slate-700 text-slate-300'}`}>{msg.role === 'assistant' ? '🎖️' : '👤'}</div>
              <div className={`max-w-[80%] rounded-2xl px-5 py-4 text-sm leading-relaxed ${msg.role === 'assistant' ? 'bg-slate-900/50 border border-slate-800 text-slate-200' : 'bg-blue-600 text-white'}`}>{msg.content.split('\n').map((line, i) => <p key={i} className="mb-2">{line.replace(/\*\*/g, '')}</p>)}</div>
            </div>
          ))}
          {isLoading && <div className="flex gap-4 max-w-3xl"><div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-blue-400">🎖️</div><div className="flex gap-1 items-center h-12 px-4"><div className="w-2 h-2 bg-slate-600 rounded-full animate-bounce"/><div className="w-2 h-2 bg-slate-600 rounded-full animate-bounce delay-75"/><div className="w-2 h-2 bg-slate-600 rounded-full animate-bounce delay-150"/></div></div>}
        </div>
        <div className="p-6 pt-2"><div className="relative max-w-4xl mx-auto"><textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Enter to send..." className="w-full bg-[#0F1629] border border-slate-700 rounded-xl pl-4 pr-14 py-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none h-24 shadow-lg"/><button onClick={handleSend} className="absolute right-3 bottom-3 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"><Send className="w-4 h-4" /></button></div></div>
      </div>

      {isPanelOpen && (
        <div className="w-80 border-l border-slate-800 bg-[#0A1025] flex flex-col flex-shrink-0">
          <div className="h-16 border-b border-slate-800 flex items-center justify-between px-4"><span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{panelMode === 'rubric' ? 'Grading Criteria' : 'Visualizations'}</span><button onClick={() => setIsPanelOpen(false)} className="text-slate-500 hover:text-white"><X className="w-4 h-4" /></button></div>
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {panelMode === 'rubric' ? (
              <>
                <div className="space-y-3"><h3 className="text-sm font-semibold text-white flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Success Criteria</h3><div className="space-y-2">{activeStep.criteria.map((crit, i) => <div key={i} className="text-xs text-slate-400 bg-slate-900/50 p-2 rounded border border-slate-800/50">{crit}</div>)}</div></div>
                <div className="space-y-3 pt-4 border-t border-slate-800/50"><h3 className="text-sm font-semibold text-white flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-amber-500" /> Common Pitfalls</h3><div className="space-y-2">{activeStep.pitfalls.map((pit, i) => <div key={i} className="text-xs text-amber-500/80 bg-amber-950/20 p-2 rounded border border-amber-900/30">⚠️ {pit}</div>)}</div></div>
              </>
            ) : (
              <div className="space-y-6">
                 <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-1">
                    {(activeStepId === 1 || activeStepId === 3) && <BaselineChart />}
                    {activeStepId === 2 && <ParetoChart />}
                    {activeStepId === 4 && <div className="h-64 w-full flex items-center justify-center bg-[#0A1025] rounded border border-slate-800"><FishboneDiagram theme="dark" /></div>}
                    {activeStepId === 5 && <PickChart />}
                    {(activeStepId === 7 || activeStepId === 8) && <ControlChart />}
                    {activeStepId === 6 && <div className="h-32 flex flex-col items-center justify-center text-slate-500 text-xs italic border border-dashed border-slate-800 rounded"><Rocket className="w-6 h-6 mb-2 opacity-50" />Action Plan Placeholder</div>}
                 </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}