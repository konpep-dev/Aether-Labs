import React, { useState } from 'react';
import { QuadraticParams } from '../types';
import { translations, Language } from '../utils/translations';

interface ControlsProps {
  params: QuadraticParams;
  onChange: (key: keyof QuadraticParams, value: number) => void;
  onReset: () => void;
  onRandomize: () => void;
  onSnapshot: () => void;
  lang: Language;
}

interface Preset {
  name: string;
  nameEl: string;
  a: number;
  b: number;
  c: number;
  category: 'basic' | 'roots' | 'shape' | 'special';
}

const PRESETS: Preset[] = [
  // Basic
  { name: 'Standard', nameEl: 'Βασική', a: 1, b: 0, c: 0, category: 'basic' },
  { name: 'Unit Parabola', nameEl: 'Μοναδιαία', a: 1, b: 0, c: -1, category: 'basic' },
  // Roots
  { name: 'Two Roots', nameEl: 'Δύο Ρίζες', a: 1, b: 0, c: -4, category: 'roots' },
  { name: 'Double Root', nameEl: 'Διπλή Ρίζα', a: 1, b: -2, c: 1, category: 'roots' },
  { name: 'Complex Roots', nameEl: 'Μιγαδικές', a: 1, b: 0, c: 4, category: 'roots' },
  { name: 'Symmetric Roots', nameEl: 'Συμμετρικές', a: 1, b: 0, c: -9, category: 'roots' },
  // Shape
  { name: 'Wide', nameEl: 'Πλατιά', a: 0.25, b: 0, c: -2, category: 'shape' },
  { name: 'Narrow', nameEl: 'Στενή', a: 4, b: 0, c: -4, category: 'shape' },
  { name: 'Inverted', nameEl: 'Ανεστραμμένη', a: -1, b: 0, c: 4, category: 'shape' },
  { name: 'Shifted', nameEl: 'Μετατοπισμένη', a: 1, b: -4, c: 3, category: 'shape' },
  // Special
  { name: 'Golden Ratio', nameEl: 'Χρυσή Τομή', a: 1, b: -1, c: -1, category: 'special' },
  { name: 'Perfect Square', nameEl: 'Τέλειο Τετράγωνο', a: 1, b: 6, c: 9, category: 'special' },
  { name: 'Fibonacci', nameEl: 'Fibonacci', a: 1, b: -1, c: -1, category: 'special' },
  { name: 'Physics (g/2)', nameEl: 'Φυσική (g/2)', a: -4.9, b: 10, c: 0, category: 'special' },
];

const ControlRow: React.FC<{
  label: string;
  symbol: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (val: number) => void;
  colorClass: string;
  description?: string;
}> = ({ label, symbol, value, min, max, step, onChange, colorClass, description }) => (
  <div className="mb-6 group">
    <div className="flex justify-between items-end mb-2">
      <label className="font-bold text-slate-100 flex items-center gap-2 text-sm uppercase tracking-wider">
        <span className={`flex items-center justify-center w-5 h-5 rounded bg-white/5 text-xs font-mono border border-white/10 ${colorClass}`}>
          {symbol}
        </span>
        {label}
      </label>
      <input
        type="number"
        value={value}
        step={step}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        className="w-24 bg-white/5 border border-white/10 rounded px-2 py-1 text-right text-sm font-mono focus:outline-none focus:border-cyan-400 text-white"
      />
    </div>
    {description && (
      <p className="text-[10px] text-slate-500 mb-2">{description}</p>
    )}
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className="w-full accent-cyan-500"
    />
    <div className="flex justify-between text-[10px] text-slate-600 font-mono mt-1">
      <span>{min}</span>
      <span>{max}</span>
    </div>
  </div>
);

export const Controls: React.FC<ControlsProps> = ({ 
  params, 
  onChange, 
  onReset, 
  onRandomize, 
  onSnapshot,
  lang 
}) => {
  const t = translations[lang].quadratic.controls;
  const [showPresets, setShowPresets] = useState(false);
  const [presetCategory, setPresetCategory] = useState<'all' | 'basic' | 'roots' | 'shape' | 'special'>('all');

  const filteredPresets = presetCategory === 'all' 
    ? PRESETS 
    : PRESETS.filter(p => p.category === presetCategory);

  const applyPreset = (preset: Preset) => {
    onChange('a', preset.a);
    setTimeout(() => onChange('b', preset.b), 0);
    setTimeout(() => onChange('c', preset.c), 0);
    setShowPresets(false);
  };

  const categoryLabels = {
    all: lang === 'el' ? 'Όλα' : 'All',
    basic: lang === 'el' ? 'Βασικά' : 'Basic',
    roots: lang === 'el' ? 'Ρίζες' : 'Roots',
    shape: lang === 'el' ? 'Σχήμα' : 'Shape',
    special: lang === 'el' ? 'Ειδικά' : 'Special'
  };

  return (
    <div className="bg-[#0B1221]/80 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-lg relative overflow-hidden">
      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-cyan-500/30 rounded-tl-xl"></div>
      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-cyan-500/30 rounded-br-xl"></div>

      <h3 className="text-sm font-bold mb-6 text-slate-300 flex items-center gap-2 uppercase tracking-wider border-b border-white/5 pb-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
        {t.title}
      </h3>

      {/* Equation Display */}
      <div className="bg-black/40 rounded-lg p-3 mb-6 border border-white/5">
        <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">
          {lang === 'el' ? 'Εξίσωση' : 'Equation'}
        </p>
        <p className="font-mono text-lg text-white">
          f(x) = <span className="text-cyan-400">{params.a}</span>x² 
          {params.b >= 0 ? ' + ' : ' - '}<span className="text-emerald-400">{Math.abs(params.b)}</span>x 
          {params.c >= 0 ? ' + ' : ' - '}<span className="text-violet-400">{Math.abs(params.c)}</span>
        </p>
      </div>

      <ControlRow
        label={t.curvature}
        symbol="a"
        value={params.a}
        min={-10}
        max={10}
        step={0.1}
        onChange={(val) => onChange('a', val)}
        colorClass="text-cyan-400"
        description={t.curvature_desc}
      />

      <ControlRow
        label={t.slope}
        symbol="b"
        value={params.b}
        min={-20}
        max={20}
        step={0.5}
        onChange={(val) => onChange('b', val)}
        colorClass="text-emerald-400"
        description={t.slope_desc}
      />

      <ControlRow
        label={t.offset}
        symbol="c"
        value={params.c}
        min={-20}
        max={20}
        step={0.5}
        onChange={(val) => onChange('c', val)}
        colorClass="text-violet-400"
        description={t.offset_desc}
      />

      {/* Presets Button */}
      <button
        onClick={() => setShowPresets(!showPresets)}
        className="w-full mb-4 py-2 px-4 bg-gradient-to-r from-purple-600/20 to-pink-600/20 hover:from-purple-600/30 hover:to-pink-600/30 border border-purple-500/30 rounded-lg text-sm text-purple-300 hover:text-white transition-all flex items-center justify-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        {lang === 'el' ? 'Προεπιλογές' : 'Presets'}
        <svg className={`w-4 h-4 transition-transform ${showPresets ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Presets Panel */}
      {showPresets && (
        <div className="mb-4 p-3 bg-black/30 rounded-lg border border-white/5 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-1 mb-3">
            {(['all', 'basic', 'roots', 'shape', 'special'] as const).map(cat => (
              <button
                key={cat}
                onClick={() => setPresetCategory(cat)}
                className={`px-2 py-1 text-[10px] rounded uppercase tracking-wider transition-all ${
                  presetCategory === cat 
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' 
                    : 'bg-white/5 text-slate-500 hover:text-white border border-transparent'
                }`}
              >
                {categoryLabels[cat]}
              </button>
            ))}
          </div>
          
          {/* Preset Grid */}
          <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto custom-scrollbar">
            {filteredPresets.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => applyPreset(preset)}
                className="p-2 bg-white/5 hover:bg-white/10 rounded border border-white/5 hover:border-cyan-500/30 text-left transition-all group"
              >
                <p className="text-xs text-white group-hover:text-cyan-400 transition-colors">
                  {lang === 'el' ? preset.nameEl : preset.name}
                </p>
                <p className="text-[10px] text-slate-500 font-mono">
                  a={preset.a} b={preset.b} c={preset.c}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={onReset}
          className="py-2 px-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs text-slate-400 hover:text-white transition-all flex items-center justify-center gap-1"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Reset
        </button>
        <button
          onClick={onRandomize}
          className="py-2 px-3 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 hover:from-cyan-600/30 hover:to-blue-600/30 border border-cyan-500/30 rounded-lg text-xs text-cyan-400 hover:text-white transition-all flex items-center justify-center gap-1"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Random
        </button>
        <button
          onClick={onSnapshot}
          className="py-2 px-3 bg-gradient-to-r from-amber-600/20 to-orange-600/20 hover:from-amber-600/30 hover:to-orange-600/30 border border-amber-500/30 rounded-lg text-xs text-amber-400 hover:text-white transition-all flex items-center justify-center gap-1"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Snap
        </button>
      </div>
    </div>
  );
};
