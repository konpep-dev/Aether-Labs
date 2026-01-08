import React, { useState, useEffect } from 'react';
import { translations, Language } from '../utils/translations';
import { DocsModal } from './DocsModal';

type SimulationType = 'quadratic' | 'reentry' | 'gravity' | 'optics';
type TabType = 'simulations' | 'docs' | 'settings' | 'about';

interface LauncherProps {
  onLaunch: (module: SimulationType) => void;
  onLaunchNewWindow: (module: SimulationType, title: string) => void;
  lang: Language;
  setLang: (lang: Language) => void;
}

interface AppSettings {
  theme: 'dark' | 'darker' | 'midnight';
  animationsEnabled: boolean;
  soundEnabled: boolean;
  autoSaveNotes: boolean;
  defaultAuthor: string;
  showFPS: boolean;
  highQualityGraphics: boolean;
}

const defaultSettings: AppSettings = {
  theme: 'dark',
  animationsEnabled: true,
  soundEnabled: false,
  autoSaveNotes: true,
  defaultAuthor: '',
  showFPS: false,
  highQualityGraphics: true,
};

const ToolCard: React.FC<{
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  onClick: () => void;
  onNewWindow: () => void;
  version: string;
  isElectron: boolean;
  status?: 'stable' | 'beta' | 'new';
}> = ({ title, description, icon, color, onClick, onNewWindow, version, isElectron, status = 'stable' }) => (
  <div className="group relative bg-[#0B1221]/60 backdrop-blur-md border border-white/5 rounded-2xl p-6 text-left transition-all duration-200 hover:bg-[#0B1221]/70 hover:border-white/10 flex flex-col h-56 w-full overflow-hidden">
    <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
    
    <div className="relative z-10 flex justify-between items-start mb-4">
      <div className={`p-3 rounded-xl bg-white/5 border border-white/10 ${color.replace('from-', 'text-').split(' ')[0]} group-hover:scale-105 transition-transform duration-200`}>
        {icon}
      </div>
      <div className="flex items-center gap-2">
        {status === 'new' && <span className="text-[9px] font-bold bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">NEW</span>}
        {status === 'beta' && <span className="text-[9px] font-bold bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full border border-orange-500/30">BETA</span>}
        <span className="text-[10px] font-mono text-slate-500 border border-white/5 px-2 py-1 rounded">{version}</span>
      </div>
    </div>

    <div className="relative z-10 flex-1">
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{description}</p>
    </div>

    <div className="relative z-10 flex gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
      <button onClick={onClick} className="flex-1 px-3 py-2 bg-white/10 hover:bg-white/15 text-white text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-2">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
        Open
      </button>
      {isElectron && (
        <button onClick={(e) => { e.stopPropagation(); onNewWindow(); }} className="px-3 py-2 bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-400 text-xs font-medium rounded-lg transition-colors flex items-center gap-1 border border-cyan-500/20" title="New Window">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
        </button>
      )}
    </div>
  </div>
);

const DocCard: React.FC<{ title: string; description: string; icon: React.ReactNode; color: string; onClick: () => void }> = ({ title, description, icon, color, onClick }) => (
  <div onClick={onClick} className={`p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer group`}>
    <div className="flex items-start gap-3">
      <div className={`p-2 rounded-lg bg-white/5 ${color}`}>{icon}</div>
      <div>
        <h4 className="text-sm font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors">{title}</h4>
        <p className="text-[11px] text-slate-500 leading-relaxed">{description}</p>
      </div>
    </div>
  </div>
);

const SettingToggle: React.FC<{ label: string; description: string; checked: boolean; onChange: (v: boolean) => void }> = ({ label, description, checked, onChange }) => (
  <div className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
    <div>
      <span className="text-sm text-white font-medium">{label}</span>
      <p className="text-[10px] text-slate-500 mt-0.5">{description}</p>
    </div>
    <button onClick={() => onChange(!checked)} className={`w-11 h-6 rounded-full relative transition-colors ${checked ? 'bg-cyan-500' : 'bg-slate-700'}`}>
      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform shadow-lg ${checked ? 'left-6' : 'left-1'}`}></div>
    </button>
  </div>
);

export const Launcher: React.FC<LauncherProps> = ({ onLaunch, onLaunchNewWindow, lang, setLang }) => {
  const [activeTab, setActiveTab] = useState<TabType>('simulations');
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [activeDoc, setActiveDoc] = useState<string | null>(null);
  const t = translations[lang].hub;
  const isElectron = !!window.electronAPI?.isElectron;

  useEffect(() => {
    const saved = localStorage.getItem('aether-settings');
    if (saved) {
      try { setSettings({ ...defaultSettings, ...JSON.parse(saved) }); } catch {}
    }
  }, []);

  const updateSetting = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem('aether-settings', JSON.stringify(newSettings));
  };

  return (
    <div className="flex flex-col min-h-screen w-full relative z-10 animate-in fade-in duration-500">
      
      {/* Header */}
      <header className="border-b border-white/5 bg-[#050b14]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 flex items-center justify-center relative">
              <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-full"></div>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-8 h-8 relative z-10">
                <path d="M50,10 L10,90 L20,90 L50,30 L80,90 L90,90 Z" fill="#00e5ff" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-black text-white tracking-wider uppercase">Aether Labs</h1>
              <p className="text-[10px] text-cyan-400/60 font-mono tracking-widest">{t.subtitle.toUpperCase()}</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 bg-white/5 p-1 rounded-xl">
            {[
              { id: 'simulations', label: t.tabs?.simulations || 'Simulations', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg> },
              { id: 'docs', label: t.tabs?.docs || 'Docs', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg> },
              { id: 'settings', label: t.tabs?.settings || 'Settings', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
              { id: 'about', label: t.tabs?.about || 'About', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeTab === tab.id 
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </nav>

          {isElectron && (
            <div className="flex items-center gap-3">
              <div className="px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-mono">
                Desktop App
              </div>
              <button 
                onClick={() => window.electronAPI?.closeWindow()}
                className="w-8 h-8 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 flex items-center justify-center transition-all"
                title={t.close}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
          {!isElectron && <div></div>}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-8">
        
        {/* Simulations Tab */}
        {activeTab === 'simulations' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">{t.simulations_title || 'Available Simulations'}</h2>
              <p className="text-sm text-slate-400">{t.simulations_desc || 'Choose a physics simulation to explore'}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ToolCard 
                title={t.tools.quadratic.title}
                description={t.tools.quadratic.desc}
                version="v2.1"
                status="stable"
                color="from-cyan-500 to-blue-600"
                isElectron={isElectron}
                icon={<svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}
                onClick={() => onLaunch('quadratic')}
                onNewWindow={() => onLaunchNewWindow('quadratic', t.tools.quadratic.title)}
              />
              <ToolCard 
                title={t.tools.reentry.title}
                description={t.tools.reentry.desc}
                version="v1.5"
                status="stable"
                color="from-orange-500 to-red-600"
                isElectron={isElectron}
                icon={<svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
                onClick={() => onLaunch('reentry')}
                onNewWindow={() => onLaunchNewWindow('reentry', t.tools.reentry.title)}
              />
              <ToolCard 
                title={t.tools.gravity.title}
                description={t.tools.gravity.desc}
                version="v3.0"
                status="new"
                color="from-violet-500 to-purple-600"
                isElectron={isElectron}
                icon={<svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                onClick={() => onLaunch('gravity')}
                onNewWindow={() => onLaunchNewWindow('gravity', t.tools.gravity.title)}
              />
              <ToolCard 
                title={t.tools.optics.title}
                description={t.tools.optics.desc}
                version="v2.0"
                status="beta"
                color="from-emerald-500 to-teal-600"
                isElectron={isElectron}
                icon={<svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>}
                onClick={() => onLaunch('optics')}
                onNewWindow={() => onLaunchNewWindow('optics', t.tools.optics.title)}
              />
            </div>
          </div>
        )}

        {/* Docs Tab */}
        {activeTab === 'docs' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Documentation</h2>
              <p className="text-sm text-slate-400">Learn how to use each simulation and understand the physics behind them</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Getting Started */}
              <div className="bg-[#0B1221]/60 rounded-2xl border border-white/10 p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full"></span>
                  Getting Started
                </h3>
                <div className="space-y-3">
                  <DocCard onClick={() => setActiveDoc('quick-start')} title="Quick Start Guide" description="Learn the basics of navigating and using Aether Labs simulations" icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>} color="text-cyan-400" />
                  <DocCard onClick={() => setActiveDoc('keyboard')} title="Keyboard Shortcuts" description="Master the keyboard controls for faster navigation" icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>} color="text-emerald-400" />
                  <DocCard onClick={() => setActiveDoc('notes')} title="Notes System" description="How to take and export notes during simulations" icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>} color="text-purple-400" />
                </div>
              </div>

              {/* Simulation Guides */}
              <div className="bg-[#0B1221]/60 rounded-2xl border border-white/10 p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
                  Simulation Guides
                </h3>
                <div className="space-y-3">
                  <DocCard onClick={() => setActiveDoc('quadratic')} title="Quadratic Equations" description="Understanding parabolas, roots, and vertex calculations" icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>} color="text-cyan-400" />
                  <DocCard onClick={() => setActiveDoc('reentry')} title="Atmospheric Reentry" description="Physics of spacecraft reentry and heat shields" icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>} color="text-orange-400" />
                  <DocCard onClick={() => setActiveDoc('gravity')} title="N-Body Gravity" description="Orbital mechanics and gravitational interactions" icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} color="text-purple-400" />
                  <DocCard onClick={() => setActiveDoc('optics')} title="Wave Optics" description="Interference, diffraction, and wave superposition" icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>} color="text-emerald-400" />
                </div>
              </div>

              {/* Physics Reference */}
              <div className="bg-[#0B1221]/60 rounded-2xl border border-white/10 p-6 lg:col-span-2">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                  Physics Reference
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                    <h4 className="text-sm font-bold text-cyan-400 mb-2">Quadratic Formula</h4>
                    <p className="text-lg font-mono text-white">x = (-b ± √(b²-4ac)) / 2a</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                    <h4 className="text-sm font-bold text-purple-400 mb-2">Gravitational Force</h4>
                    <p className="text-lg font-mono text-white">F = G(m₁m₂) / r²</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                    <h4 className="text-sm font-bold text-emerald-400 mb-2">Wave Equation</h4>
                    <p className="text-lg font-mono text-white">ψ = A·sin(kx - ωt)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Settings</h2>
              <p className="text-sm text-slate-400">Customize your Aether Labs experience</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* General Settings */}
              <div className="bg-[#0B1221]/60 rounded-2xl border border-white/10 p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  General
                </h3>
                <div className="space-y-1">
                  <SettingToggle label="Animations" description="Enable smooth UI animations" checked={settings.animationsEnabled} onChange={v => updateSetting('animationsEnabled', v)} />
                  <SettingToggle label="High Quality Graphics" description="Better visuals, may affect performance" checked={settings.highQualityGraphics} onChange={v => updateSetting('highQualityGraphics', v)} />
                  <SettingToggle label="Show FPS Counter" description="Display frames per second in simulations" checked={settings.showFPS} onChange={v => updateSetting('showFPS', v)} />
                </div>
              </div>

              {/* Notes Settings */}
              <div className="bg-[#0B1221]/60 rounded-2xl border border-white/10 p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  Notes
                </h3>
                <div className="space-y-1">
                  <SettingToggle label="Auto-save Notes" description="Automatically save notes while typing" checked={settings.autoSaveNotes} onChange={v => updateSetting('autoSaveNotes', v)} />
                  <div className="py-3 border-b border-white/5">
                    <label className="text-sm text-white font-medium block mb-2">Default Author Name</label>
                    <input 
                      type="text" 
                      value={settings.defaultAuthor} 
                      onChange={e => updateSetting('defaultAuthor', e.target.value)}
                      placeholder="Enter your name..."
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-slate-500 outline-none focus:border-cyan-500/50"
                    />
                  </div>
                </div>
              </div>

              {/* Language Settings */}
              <div className="bg-[#0B1221]/60 rounded-2xl border border-white/10 p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" /></svg>
                  Language
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => setLang('el')} className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${lang === 'el' ? 'bg-cyan-950/30 border-cyan-500/50 text-cyan-400' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'}`}>
                    <span className="text-2xl">🇬🇷</span>
                    <span className="text-sm font-bold">Ελληνικά</span>
                  </button>
                  <button onClick={() => setLang('en')} className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${lang === 'en' ? 'bg-cyan-950/30 border-cyan-500/50 text-cyan-400' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'}`}>
                    <span className="text-2xl">🇺🇸</span>
                    <span className="text-sm font-bold">English</span>
                  </button>
                </div>
              </div>

              {/* Data Management */}
              <div className="bg-[#0B1221]/60 rounded-2xl border border-white/10 p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" /></svg>
                  {t.data_management || 'Data Management'}
                </h3>
                <div className="space-y-3">
                  <button 
                    onClick={() => {
                      const allNotes: Record<string, unknown> = {};
                      ['quadratic', 'reentry', 'gravity', 'optics'].forEach(sim => {
                        const data = localStorage.getItem(`aether-notes-${sim}`);
                        if (data) allNotes[sim] = JSON.parse(data);
                      });
                      const blob = new Blob([JSON.stringify(allNotes, null, 2)], { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `aether-labs-notes-${Date.now()}.json`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="w-full px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-slate-300 hover:text-white transition-all flex items-center justify-between"
                  >
                    <span>{t.export_notes || 'Export All Notes'}</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                  </button>
                  <button onClick={() => { if(confirm(lang === 'el' ? 'Διαγραφή όλων των δεδομένων;' : 'Clear all saved data?')) { localStorage.clear(); location.reload(); }}} className="w-full px-4 py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg text-sm text-red-400 transition-all flex items-center justify-between">
                    <span>{t.clear_data || 'Clear All Data'}</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* About Tab */}
        {activeTab === 'about' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="max-w-2xl mx-auto text-center">
              {/* Logo */}
              <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center relative">
                <div className="absolute inset-0 bg-cyan-500/20 blur-[40px] rounded-full"></div>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-full h-full relative z-10 drop-shadow-[0_0_15px_rgba(0,229,255,0.5)]">
                  <path d="M50,10 L10,90 L20,90 L50,30 L80,90 L90,90 Z" fill="#00e5ff" />
                </svg>
              </div>

              <h1 className="text-4xl font-black text-white tracking-tight mb-2 uppercase">Aether Labs</h1>
              <p className="text-cyan-400 font-mono tracking-[0.2em] text-sm uppercase mb-8">{t.subtitle}</p>

              <div className="bg-[#0B1221]/60 rounded-2xl border border-white/10 p-8 mb-8 text-left">
                <p className="text-slate-300 leading-relaxed mb-6">
                  {t.about_desc || 'Aether Labs is an interactive physics simulation platform designed for students, educators, and enthusiasts.'}
                </p>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-4 bg-white/5 rounded-xl">
                    <div className="text-2xl font-bold text-cyan-400 mb-1">4</div>
                    <div className="text-xs text-slate-500">{t.tabs?.simulations || 'Simulations'}</div>
                  </div>
                  <div className="p-4 bg-white/5 rounded-xl">
                    <div className="text-2xl font-bold text-purple-400 mb-1">v1.0.0</div>
                    <div className="text-xs text-slate-500">Version</div>
                  </div>
                </div>

                <div className="border-t border-white/10 pt-6">
                  <p className="text-center text-lg font-bold text-white mb-4">{t.made_in_greece || 'Made in Greece'}</p>
                  <p className="text-center text-slate-400 text-sm mb-2">{t.developed_by || 'Developed with ❤️ by'}</p>
                  <p className="text-center text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">konpep</p>
                </div>
              </div>

              {/* Tech Stack */}
              <div className="bg-[#0B1221]/60 rounded-2xl border border-white/10 p-6 mb-8">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">{t.built_with || 'Built With'}</h3>
                <div className="flex flex-wrap justify-center gap-3">
                  {['React', 'TypeScript', 'Electron', 'Tailwind CSS', 'Vite', 'Recharts'].map(tech => (
                    <span key={tech} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs text-slate-300">{tech}</span>
                  ))}
                </div>
              </div>

              {/* GitHub Link */}
              <a 
                href="https://github.com/konpep-dev" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-6 py-3 bg-[#0B1221]/60 hover:bg-[#0B1221]/80 rounded-xl border border-white/10 hover:border-cyan-500/30 transition-all group"
              >
                <svg className="w-6 h-6 text-slate-400 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
                <div className="text-left">
                  <span className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">GitHub</span>
                  <span className="block text-[10px] text-slate-500">github.com/konpep-dev</span>
                </div>
                <svg className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-[#050b14]/80 backdrop-blur-xl py-4">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <p className="text-[11px] text-slate-600">{t.footer_rights || '© 2024 Aether Labs. All rights reserved.'}</p>
          <div className="flex items-center gap-4 text-[11px] text-slate-500">
            <span>{t.made_in_greece || 'Made in Greece'}</span>
            <span className="text-slate-700">•</span>
            <span>by <span className="text-cyan-400/80 font-medium">konpep</span></span>
          </div>
        </div>
      </footer>

      {/* Documentation Modal */}
      <DocsModal isOpen={!!activeDoc} onClose={() => setActiveDoc(null)} docId={activeDoc} />
    </div>
  );
};
