import React from 'react';
import { QuadraticParams, QuadraticStats } from '../types';
import { translations, Language } from '../utils/translations';

interface SolutionStepsProps {
  params: QuadraticParams;
  stats: QuadraticStats;
  lang: Language;
}

export const SolutionSteps: React.FC<SolutionStepsProps> = ({ params, stats, lang }) => {
  const { a, b, c } = params;
  const { discriminant } = stats;
  const t = translations[lang].quadratic.solution;

  if (Math.abs(a) < 0.0001) {
    return (
      <div className="bg-[#0B1221]/80 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-lg">
        <h3 className="text-sm font-bold text-slate-300 mb-4 border-b border-white/5 pb-2 uppercase tracking-wider">
          {t.log_title}
        </h3>
        <p className="text-slate-400">
          {t.linear_msg} <span className="font-mono text-cyan-400">a = 0</span>.
        </p>
        <div className="font-mono text-lg mt-4 text-center bg-black/40 p-4 rounded-lg border border-white/5 text-slate-200">
          {b}x + {c} = 0 <br />
          {Math.abs(b) > 0.0001 ? (
            <>
              x = {-c} / {b} <br />
              <span className="text-emerald-400 font-bold glow-text">x = {(-c / b).toFixed(2)}</span>
            </>
          ) : (
             c === 0 ? t.identity : t.impossible
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0B1221]/80 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-lg h-full">
      <h3 className="text-sm font-bold text-slate-300 mb-6 border-b border-white/5 pb-2 flex items-center gap-2 uppercase tracking-wider">
        <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
        {t.title}
      </h3>
      
      <div className="space-y-6 font-mono text-sm">
        {/* Step 1: Discriminant */}
        <div>
          <p className="text-slate-500 font-sans text-[10px] uppercase font-bold mb-1 tracking-widest">{t.step_disc}</p>
          <div className="bg-black/30 p-3 rounded border-l border-cyan-500 text-slate-300">
            <p>Δ = b² - 4ac</p>
            <p className="text-slate-500">Δ = ({b})² - 4({a})({c})</p>
            <p className={`font-bold mt-1 ${discriminant >= 0 ? 'text-cyan-400' : 'text-rose-400'}`}>
              Δ = {discriminant.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Step 2: Formula */}
        <div>
          <p className="text-slate-500 font-sans text-[10px] uppercase font-bold mb-1 tracking-widest">{t.step_formula}</p>
          <div className="bg-black/30 p-3 rounded border-l border-emerald-500 overflow-x-auto text-slate-300">
            <p className="mb-2">x = <span className="inline-block border-t border-slate-600 px-1 mx-1 align-middle text-center"><span className="block">-b ± √Δ</span><span className="block border-t border-transparent">2a</span></span></p>
            
            {discriminant >= 0 ? (
              <>
                <p>x = <span className="inline-block border-t border-slate-600 px-1 mx-1 align-middle text-center"><span className="block">{-b} ± {Math.sqrt(discriminant).toFixed(2)}</span><span className="block border-t border-transparent">{2 * a}</span></span></p>
              </>
            ) : (
              <p className="text-rose-400 text-xs font-sans mt-2 italic">
                {t.complex_warn}
              </p>
            )}
          </div>
        </div>

        {/* Step 3: Final Roots */}
        {discriminant >= 0 && (
          <div>
            <p className="text-slate-500 font-sans text-[10px] uppercase font-bold mb-1 tracking-widest">{t.step_result}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
               <div className="bg-emerald-950/20 border border-emerald-500/20 p-2 rounded">
                 <span className="text-slate-500">x₁ =</span> <span className="text-emerald-400 font-bold">{stats.roots[0].split('=')[1]}</span>
               </div>
               {discriminant > 0 && (
                 <div className="bg-emerald-950/20 border border-emerald-500/20 p-2 rounded">
                   <span className="text-slate-500">x₂ =</span> <span className="text-emerald-400 font-bold">{stats.roots[1].split('=')[1]}</span>
                 </div>
               )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};