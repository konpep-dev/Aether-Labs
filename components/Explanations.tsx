import React from 'react';
import { QuadraticParams } from '../types';
import { translations, Language } from '../utils/translations';

export const Explanations: React.FC<{ params: QuadraticParams, lang: Language }> = ({ params, lang }) => {
  const t = translations[lang].quadratic.explanations;
  
  return (
    <div className="bg-[#0B1221]/80 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-lg mt-6 lg:mt-0 h-fit">
      <h3 className="text-sm font-bold mb-4 text-slate-300 flex items-center gap-2 uppercase tracking-wider border-b border-white/5 pb-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {t.title}
      </h3>
      
      <div className="space-y-4 text-slate-400 text-sm">
        <div className="group">
          <div className="flex items-center gap-2 mb-1">
             <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
             <span className="font-mono text-cyan-400">a = {params.a}</span>
          </div>
          <p className="text-xs pl-4 border-l border-white/10">
            {t.shape_control} 
            {params.a > 0 && ` ${t.opens_up}`}
            {params.a < 0 && ` ${t.opens_down}`}
          </p>
        </div>

        <div className="group">
          <div className="flex items-center gap-2 mb-1">
             <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
             <span className="font-mono text-emerald-400">b = {params.b}</span>
          </div>
          <p className="text-xs pl-4 border-l border-white/10">
            {t.lateral_shift}
          </p>
        </div>

        <div className="group">
          <div className="flex items-center gap-2 mb-1">
             <span className="w-1.5 h-1.5 rounded-full bg-violet-400"></span>
             <span className="font-mono text-violet-400">c = {params.c}</span>
          </div>
          <p className="text-xs pl-4 border-l border-white/10">
            {t.vertical_intercept} {params.c}.
          </p>
        </div>
      </div>
    </div>
  );
};