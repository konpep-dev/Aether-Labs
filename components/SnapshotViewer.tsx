import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, ReferenceLine } from 'recharts';
import { QuadraticParams } from '../types';
import { generateComparisonData } from '../utils/math';

interface SnapshotViewerProps {
  currentParams: QuadraticParams;
  snapshotParams: QuadraticParams;
  onClose: () => void;
}

export const SnapshotViewer: React.FC<SnapshotViewerProps> = ({ currentParams, snapshotParams, onClose }) => {
  const data = useMemo(() => {
    return generateComparisonData(currentParams, snapshotParams);
  }, [currentParams, snapshotParams]);

  // Determine a reasonable Y domain to keep the mini chart useful
  const allY = data.flatMap(d => [d.yCurrent, d.ySnapshot]);
  const minY = Math.min(...allY);
  const maxY = Math.max(...allY);
  const buffer = (maxY - minY) * 0.2;

  const formatEq = (p: QuadraticParams) => {
    const a = p.a !== 0 ? `${p.a}x²` : '';
    const b = p.b !== 0 ? `${p.b > 0 && p.a !== 0 ? '+' : ''}${p.b}x` : '';
    const c = p.c !== 0 ? `${p.c > 0 ? '+' : ''}${p.c}` : '';
    return `${a}${b}${c}=0` || '0=0';
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80 bg-slate-900/90 backdrop-blur-md border border-slate-600 rounded-lg shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-5 duration-300">
      <div className="flex justify-between items-center px-4 py-2 bg-slate-800 border-b border-slate-700">
        <span className="text-xs font-bold text-indigo-400 flex items-center gap-2">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
          Σύγκριση (Ghost Graph)
        </span>
        <button onClick={onClose} className="text-slate-400 hover:text-white">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      <div className="h-40 w-full bg-slate-900/50 relative">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, bottom: 5, left: 0 }}>
             <XAxis hide type="number" dataKey="x" domain={['auto', 'auto']} />
             <YAxis hide domain={[minY - buffer, maxY + buffer]} />
             <ReferenceLine y={0} stroke="#475569" />
             <ReferenceLine x={0} stroke="#475569" />
             
             {/* Snapshot Line (Ghost) */}
             <Line 
               type="monotone" 
               dataKey="ySnapshot" 
               stroke="#94a3b8" 
               strokeWidth={2} 
               strokeDasharray="4 4" 
               dot={false}
               isAnimationActive={false}
             />
             
             {/* Current Line */}
             <Line 
               type="monotone" 
               dataKey="yCurrent" 
               stroke="#6366f1" 
               strokeWidth={2} 
               dot={false} 
               isAnimationActive={false}
             />
          </LineChart>
        </ResponsiveContainer>
        
        {/* Legend Overlay */}
        <div className="absolute bottom-2 left-2 text-[10px] space-y-1">
          <div className="flex items-center gap-1 bg-slate-900/80 px-1.5 py-0.5 rounded border border-slate-700">
             <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
             <span className="text-indigo-200 truncate max-w-[100px]">{formatEq(currentParams)}</span>
          </div>
          <div className="flex items-center gap-1 bg-slate-900/80 px-1.5 py-0.5 rounded border border-slate-700 opacity-80">
             <div className="w-2 h-2 rounded-full bg-slate-400 border border-slate-600"></div>
             <span className="text-slate-400 truncate max-w-[100px]">{formatEq(snapshotParams)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};