import React, { useState } from 'react';
import { QuadraticStats } from '../types';
import { translations, Language } from '../utils/translations';

interface StatsProps {
  stats: QuadraticStats;
  lang: Language;
}

const StatCard: React.FC<{
  title: string;
  value: React.ReactNode;
  subtext?: string;
  colorBorder: string;
}> = ({ title, value, subtext, colorBorder }) => (
  <div className={`relative bg-white/5 p-5 rounded-lg border-l-2 ${colorBorder} overflow-hidden group hover:bg-white/10 transition-colors`}>
    <div className="absolute inset-0 bg-grid-slate-700/[0.1] pointer-events-none"></div>
    <h4 className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-2 font-mono">{title}</h4>
    <div className="font-mono text-lg md:text-xl font-bold text-slate-100 truncate relative z-10">
      {value}
    </div>
    {subtext && <p className="text-xs text-slate-500 mt-2 font-medium relative z-10">{subtext}</p>}
  </div>
);

export const Stats: React.FC<StatsProps> = ({ stats, lang }) => {
  const t = translations[lang].quadratic.stats;
  const [showAdvanced, setShowAdvanced] = useState(false);

  const formatNum = (n: number) => {
    if (Math.abs(n) < 1e-10) return '0';
    if (Math.abs(n) >= 1e4) return n.toExponential(2);
    return n.toFixed(4).replace(/\.?0+$/, '');
  };

  return (
    <div className="space-y-4">
      {/* Basic Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title={t.discriminant}
          value={
            <span className={stats.discriminant >= 0 ? 'text-cyan-400 glow-text' : 'text-rose-400 glow-text'}>
              {formatNum(stats.discriminant)}
            </span>
          }
          subtext={
            stats.discriminant > 0 ? t.two_roots : 
            stats.discriminant === 0 ? t.one_root : 
            t.complex_roots
          }
          colorBorder="border-cyan-500"
        />

        <StatCard
          title={t.roots}
          value={
            <div className="flex flex-col text-sm md:text-base">
              {stats.roots.map((root: string, idx: number) => (
                <span key={idx} className="block">{root}</span>
              ))}
            </div>
          }
          colorBorder="border-emerald-500"
        />

        <StatCard
          title={t.vertex}
          value={
            stats.vertex 
              ? `V(${formatNum(stats.vertex.x)}, ${formatNum(stats.vertex.y)})` 
              : 'N/A'
          }
          subtext={stats.vertex ? t.vertex_desc : ''}
          colorBorder="border-amber-500"
        />

        <StatCard
          title={t.y_intercept}
          value={`(0, ${formatNum(stats.yIntercept)})`}
          subtext={t.intercept_desc}
          colorBorder="border-violet-500"
        />
      </div>

      {/* Toggle Advanced Stats */}
      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 text-sm text-slate-400 hover:text-white transition-all"
      >
        <svg 
          className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
        {showAdvanced ? (lang === 'el' ? 'Απόκρυψη Προχωρημένων' : 'Hide Advanced') : (lang === 'el' ? 'Προχωρημένα Στοιχεία' : 'Advanced Stats')}
      </button>

      {/* Advanced Stats */}
      {showAdvanced && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <StatCard
            title={t.derivative}
            value={
              <span className="text-pink-400">
                f'(x) = {stats.derivative.a !== 0 ? `${formatNum(stats.derivative.a)}x` : ''}
                {stats.derivative.b !== 0 ? ` ${stats.derivative.b >= 0 && stats.derivative.a !== 0 ? '+' : ''} ${formatNum(stats.derivative.b)}` : ''}
                {stats.derivative.a === 0 && stats.derivative.b === 0 ? '0' : ''}
              </span>
            }
            subtext={t.derivative_desc}
            colorBorder="border-pink-500"
          />

          <StatCard
            title={t.concavity}
            value={
              <span className={stats.concavity === 'up' ? 'text-green-400' : stats.concavity === 'down' ? 'text-red-400' : 'text-slate-400'}>
                {stats.concavity === 'up' ? t.concave_up : stats.concavity === 'down' ? t.concave_down : t.linear_eq}
              </span>
            }
            subtext={`f''(x) = ${formatNum(stats.secondDerivative)}`}
            colorBorder="border-orange-500"
          />

          <StatCard
            title={t.focus}
            value={
              stats.focusPoint 
                ? `F(${formatNum(stats.focusPoint.x)}, ${formatNum(stats.focusPoint.y)})` 
                : 'N/A'
            }
            subtext={stats.directrix !== null ? `${t.directrix}: y = ${formatNum(stats.directrix)}` : ''}
            colorBorder="border-blue-500"
          />

          <StatCard
            title={t.area}
            value={
              stats.areaUnderCurve 
                ? <span className="text-teal-400">{formatNum(stats.areaUnderCurve.value)}</span>
                : <span className="text-slate-500 text-sm">{t.no_real_area}</span>
            }
            subtext={stats.areaUnderCurve ? `${t.area_desc}: [${formatNum(stats.areaUnderCurve.from)}, ${formatNum(stats.areaUnderCurve.to)}]` : ''}
            colorBorder="border-teal-500"
          />
        </div>
      )}
    </div>
  );
};
