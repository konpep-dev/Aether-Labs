import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceDot,
  Label,
  Area,
  ComposedChart
} from 'recharts';
import { GraphPoint, QuadraticParams, QuadraticStats } from '../types';
import { translations, Language } from '../utils/translations';

interface ChartProps {
  data: GraphPoint[];
  stats: QuadraticStats;
  params: QuadraticParams;
  lang: Language;
}

export const QuadraticChart: React.FC<ChartProps> = ({ data, stats, params, lang }) => {
  const t = translations[lang].quadratic.chart;
  const [showFocus, setShowFocus] = useState(false);
  const [showArea, setShowArea] = useState(false);
  
  const yMin = Math.min(...data.map((d: GraphPoint) => d.y));
  const yMax = Math.max(...data.map((d: GraphPoint) => d.y));
  const rangeY = yMax - yMin;
  
  const domainMin = yMin - (rangeY * 0.1) - 1;
  const domainMax = yMax + (rangeY * 0.1) + 1;

  // Check if focus/directrix are within view
  const focusInView = stats.focusPoint && 
    stats.focusPoint.y >= domainMin && 
    stats.focusPoint.y <= domainMax;

  const directrixInView = stats.directrix !== null && 
    stats.directrix >= domainMin && 
    stats.directrix <= domainMax;

  return (
    <div className="w-full h-[500px] bg-[#0B1221]/90 backdrop-blur-sm p-2 rounded-2xl border border-white/10 relative overflow-hidden group shadow-2xl">
      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan-500/50 rounded-tl-xl"></div>
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyan-500/50 rounded-br-xl"></div>

      {/* Title */}
      <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full border border-white/10 bg-black/40 backdrop-blur">
        <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-2">
           <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
           {t.title}
        </h3>
      </div>

      {/* Chart Options */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <button
          onClick={() => setShowFocus(!showFocus)}
          className={`px-2 py-1 text-[10px] rounded border transition-all ${
            showFocus 
              ? 'bg-blue-500/20 border-blue-500/50 text-blue-400' 
              : 'bg-black/40 border-white/10 text-slate-500 hover:text-white'
          }`}
          title={lang === 'el' ? 'Εστία & Διευθετούσα' : 'Focus & Directrix'}
        >
          F/D
        </button>
        {stats.areaUnderCurve && (
          <button
            onClick={() => setShowArea(!showArea)}
            className={`px-2 py-1 text-[10px] rounded border transition-all ${
              showArea 
                ? 'bg-teal-500/20 border-teal-500/50 text-teal-400' 
                : 'bg-black/40 border-white/10 text-slate-500 hover:text-white'
            }`}
            title={lang === 'el' ? 'Εμβαδόν' : 'Area'}
          >
            Area
          </button>
        )}
      </div>
      
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 40, right: 30, bottom: 20, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" strokeOpacity={0.4} />
          
          <XAxis 
            dataKey="x" 
            type="number" 
            domain={['auto', 'auto']}
            stroke="#475569"
            tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'JetBrains Mono' }}
            tickLine={false}
            axisLine={{ stroke: '#334155' }}
          >
             <Label value="x" offset={0} position="insideRight" fill="#64748b" style={{fontFamily: 'JetBrains Mono'}} />
          </XAxis>

          <YAxis 
            domain={[domainMin, domainMax]}
            allowDataOverflow={false}
            stroke="#475569" 
            tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'JetBrains Mono' }}
            tickLine={false}
            width={50}
            axisLine={{ stroke: '#334155' }}
          >
            <Label value="y" offset={10} position="insideTop" fill="#64748b" style={{fontFamily: 'JetBrains Mono'}} />
          </YAxis>

          <Tooltip 
            animationDuration={150}
            contentStyle={{ 
              backgroundColor: 'rgba(5, 11, 20, 0.95)', 
              borderColor: 'rgba(255, 255, 255, 0.1)', 
              color: '#f1f5f9',
              borderRadius: '8px',
              fontFamily: 'JetBrains Mono',
              fontSize: '12px',
              boxShadow: '0 0 20px rgba(0,0,0,0.5)'
            }}
            itemStyle={{ color: '#00e5ff' }}
            formatter={(value: number) => [value.toFixed(4), 'y']}
            labelFormatter={(label) => `x: ${Number(label).toFixed(4)}`}
            cursor={{ stroke: '#fff', strokeWidth: 1, strokeDasharray: '4 4', opacity: 0.3 }}
          />

          {/* Axes */}
          <ReferenceLine y={0} stroke="#94a3b8" strokeWidth={1} strokeOpacity={0.5} />
          <ReferenceLine x={0} stroke="#94a3b8" strokeWidth={1} strokeOpacity={0.5} />
          
          {/* Axis of Symmetry */}
          {stats.axisOfSymmetry !== null && (
            <ReferenceLine 
              x={stats.axisOfSymmetry} 
              stroke="#f59e0b" 
              strokeDasharray="4 4" 
              opacity={0.4}
            />
          )}

          {/* Directrix */}
          {showFocus && directrixInView && stats.directrix !== null && (
            <ReferenceLine 
              y={stats.directrix} 
              stroke="#ec4899" 
              strokeDasharray="6 3" 
              opacity={0.6}
            />
          )}

          {/* Area under curve between roots */}
          {showArea && stats.areaUnderCurve && (
            <Area
              type="monotone"
              dataKey="y"
              stroke="none"
              fill="url(#areaGradient)"
              fillOpacity={0.3}
            />
          )}

          {/* Vertex */}
          {stats.vertex && (
            <ReferenceDot 
              x={stats.vertex.x} 
              y={stats.vertex.y} 
              r={5} 
              fill="#050b14" 
              stroke="#00e5ff"
              strokeWidth={2}
            />
          )}

          {/* Focus Point */}
          {showFocus && focusInView && stats.focusPoint && (
            <ReferenceDot 
              x={stats.focusPoint.x} 
              y={stats.focusPoint.y} 
              r={4} 
              fill="#ec4899" 
              stroke="#fff"
              strokeWidth={1}
            />
          )}

          {/* Y-Intercept */}
          <ReferenceDot
             x={0}
             y={stats.yIntercept}
             r={4}
             fill="#a855f7" 
             stroke="none"
             opacity={0.8}
          />

          {/* X-Intercepts (roots) */}
          {stats.discriminant >= 0 && stats.areaUnderCurve && (
            <>
              <ReferenceDot
                x={stats.areaUnderCurve.from}
                y={0}
                r={4}
                fill="#10b981"
                stroke="none"
                opacity={0.8}
              />
              {stats.discriminant > 0 && (
                <ReferenceDot
                  x={stats.areaUnderCurve.to}
                  y={0}
                  r={4}
                  fill="#10b981"
                  stroke="none"
                  opacity={0.8}
                />
              )}
            </>
          )}

          <defs>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#00e5ff" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#14b8a6" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#14b8a6" stopOpacity={0.1} />
            </linearGradient>
            <filter id="glow">
                <feGaussianBlur stdDeviation="3.5" result="coloredBlur"/>
                <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>
          </defs>

          <Line 
            type="monotone" 
            dataKey="y" 
            stroke="url(#lineGradient)" 
            strokeWidth={3} 
            dot={false} 
            activeDot={{ r: 6, strokeWidth: 0, fill: '#fff' }}
            filter="url(#glow)"
            isAnimationActive={false} 
          />
        </ComposedChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 flex flex-wrap gap-3 text-[10px]">
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
          <span className="text-slate-500">{lang === 'el' ? 'Κορυφή' : 'Vertex'}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-violet-500"></span>
          <span className="text-slate-500">{lang === 'el' ? 'Τομή Y' : 'Y-Int'}</span>
        </div>
        {stats.discriminant >= 0 && (
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-slate-500">{lang === 'el' ? 'Ρίζες' : 'Roots'}</span>
          </div>
        )}
        {showFocus && (
          <>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-pink-500"></span>
              <span className="text-slate-500">{lang === 'el' ? 'Εστία' : 'Focus'}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-0.5 bg-pink-500"></span>
              <span className="text-slate-500">{lang === 'el' ? 'Διευθ.' : 'Directrix'}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
