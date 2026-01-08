import React, { useState, useMemo, useEffect } from 'react';
import { QuadraticParams } from './types';
import { calculateStats, generateDataPoints } from './utils/math';
import { Controls } from './components/Controls';
import { QuadraticChart } from './components/QuadraticChart';
import { Stats } from './components/Stats';
import { Explanations } from './components/Explanations';
import { SolutionSteps } from './components/SolutionSteps';
import { SnapshotViewer } from './components/SnapshotViewer';
import { ReentrySimulator } from './components/ReentrySimulator';
import { GravitySandbox } from './components/GravitySandbox';
import { WaveOptics } from './components/WaveOptics';
import { Launcher } from './components/Launcher';
import { NotesPanel } from './components/NotesPanel';
import { WebBrowser } from './components/WebBrowser';
import { FPSCounter } from './components/FPSCounter';
import { Language, translations } from './utils/translations';

type ViewState = 'launcher' | 'quadratic' | 'reentry' | 'gravity' | 'optics';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('launcher');
  const [lang, setLang] = useState<Language>('en');
  const [isStandaloneWindow, setIsStandaloneWindow] = useState(false);

  // Check if running in Electron standalone window
  useEffect(() => {
    const checkWindowType = async () => {
      // Check hash for simulation type
      const hash = window.location.hash;
      if (hash.startsWith('#/simulation/')) {
        const simType = hash.replace('#/simulation/', '') as ViewState;
        if (['quadratic', 'reentry', 'gravity', 'optics'].includes(simType)) {
          setCurrentView(simType);
          setIsStandaloneWindow(true);
        }
      }
    };
    checkWindowType();
  }, []);

  // Quadratic State
  const [params, setParams] = useState<QuadraticParams>({ a: 1, b: 0, c: 0 });
  const [snapshotParams, setSnapshotParams] = useState<QuadraticParams | null>(null);
  const [showNotes, setShowNotes] = useState(false);
  const [showBrowser, setShowBrowser] = useState(false);
  const [showFPS, setShowFPS] = useState(false);

  // Load settings from localStorage
  useEffect(() => {
    const loadSettings = () => {
      try {
        const saved = localStorage.getItem('aether-settings');
        if (saved) {
          const settings = JSON.parse(saved);
          setShowFPS(settings.showFPS || false);
        }
      } catch {}
    };
    loadSettings();

    // Listen for storage changes (when settings are updated in Launcher)
    const handleStorage = () => loadSettings();
    window.addEventListener('storage', handleStorage);
    
    // Also check periodically for same-tab updates
    const interval = setInterval(loadSettings, 1000);
    
    return () => {
      window.removeEventListener('storage', handleStorage);
      clearInterval(interval);
    };
  }, []);

  const handleParamChange = (key: keyof QuadraticParams, value: number) => {
    setParams((prev) => ({ ...prev, [key]: value }));
  };

  const { stats, graphData } = useMemo(() => {
    return {
      stats: calculateStats(params, lang),
      graphData: generateDataPoints(params, 15), 
    };
  }, [params, lang]);

  const handleRandomize = () => {
     const newA = Math.random() > 0.5 ? 1 : -1;
     setParams({ a: newA, b: Math.floor(Math.random() * 10) - 5, c: Math.floor(Math.random() * 10) - 5 });
  };

  // Open simulation in new window (Electron only)
  const openInNewWindow = async (type: ViewState, title: string) => {
    if (window.electronAPI?.isElectron) {
      await window.electronAPI.openSimulation(type, title);
    } else {
      // Fallback: open in same window
      setCurrentView(type);
    }
  };

  const getTitle = () => {
    if (currentView === 'quadratic') return translations[lang].hub.tools.quadratic.title;
    if (currentView === 'reentry') return translations[lang].hub.tools.reentry.title;
    if (currentView === 'gravity') return translations[lang].hub.tools.gravity.title;
    if (currentView === 'optics') return translations[lang].hub.tools.optics.title;
    return '';
  }

  const getColor = () => {
      if (currentView === 'quadratic') return 'bg-cyan-400';
      if (currentView === 'reentry') return 'bg-orange-500';
      if (currentView === 'gravity') return 'bg-purple-500';
      if (currentView === 'optics') return 'bg-emerald-500';
      return 'bg-white';
  }

  const handleCloseWindow = () => {
    if (window.electronAPI?.isElectron && isStandaloneWindow) {
      window.electronAPI.closeWindow();
    } else {
      setCurrentView('launcher');
    }
  };

  return (
    <div className="min-h-screen font-sans text-slate-200 bg-[#050b14] flex flex-col selection:bg-cyan-500/30 overflow-hidden relative">
      
      {/* Global Background Mesh */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-cyan-900/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-violet-900/10 rounded-full blur-[150px]" />
        <div className={`absolute top-[20%] right-[10%] w-[40%] h-[40%] bg-orange-900/10 rounded-full blur-[120px] transition-opacity duration-1000 ${currentView === 'reentry' ? 'opacity-100' : 'opacity-0'}`} />
        <div className={`absolute top-[40%] left-[30%] w-[40%] h-[40%] bg-blue-900/5 rounded-full blur-[120px] transition-opacity duration-1000 ${currentView === 'quadratic' ? 'opacity-100' : 'opacity-0'}`} />
        <div className={`absolute bottom-[10%] left-[20%] w-[40%] h-[40%] bg-purple-900/10 rounded-full blur-[120px] transition-opacity duration-1000 ${currentView === 'gravity' ? 'opacity-100' : 'opacity-0'}`} />
      </div>

      {/* VIEW: LAUNCHER */}
      {currentView === 'launcher' && !isStandaloneWindow && (
        <Launcher 
          onLaunch={setCurrentView} 
          onLaunchNewWindow={openInNewWindow}
          lang={lang} 
          setLang={setLang} 
        />
      )}

      {/* VIEW: TOOLS */}
      {currentView !== 'launcher' && (
        <div className="flex flex-col h-screen animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Navbar */}
            <nav className="relative z-50 bg-[#050b14]/90 backdrop-blur-xl border-b border-white/5 shrink-0">
                <div className="max-w-[1920px] mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
                
                <div className="flex items-center gap-6">
                    <button 
                        onClick={handleCloseWindow}
                        className="group flex items-center gap-2 px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all border border-transparent hover:border-white/10"
                    >
                        <svg className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          {isStandaloneWindow ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                          )}
                        </svg>
                        <span className="text-xs font-bold uppercase tracking-wider">
                          {isStandaloneWindow ? 'Close' : 'Hub'}
                        </span>
                    </button>

                    <div className="h-6 w-px bg-white/10"></div>

                    <div className="flex items-center gap-3">
                        <div className="w-6 h-6 flex items-center justify-center">
                             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-full h-full">
                                <path d="M50,10 L10,90 L20,90 L50,30 L80,90 L90,90 Z" fill="#00e5ff" />
                             </svg>
                        </div>
                        <span className="text-sm font-bold text-white tracking-widest uppercase opacity-80">Aether Labs</span>
                    </div>
                </div>

                <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="flex items-center gap-3 bg-black/40 px-6 py-1.5 rounded-full border border-white/5">
                        <span className={`w-2 h-2 rounded-full animate-pulse ${getColor()}`}></span>
                        <span className="text-xs font-mono text-slate-300 uppercase tracking-widest">
                            {getTitle()}
                        </span>
                    </div>
                </div>
                
                <div className="flex items-center gap-2 justify-end">
                  {/* Web Browser Button */}
                  <button 
                    onClick={() => setShowBrowser(true)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all border border-transparent hover:border-white/10"
                    title={lang === 'el' ? 'Αναζήτηση Web' : 'Web Search'}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                    <span className="text-xs font-bold uppercase tracking-wider hidden sm:block">Web</span>
                  </button>

                  {/* Notes Button in Navbar */}
                  <button 
                    onClick={() => setShowNotes(true)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all border border-transparent hover:border-white/10"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <span className="text-xs font-bold uppercase tracking-wider hidden sm:block">Notes</span>
                  </button>
                </div>
                </div>
            </nav>

            {/* Workspace */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden relative z-10 custom-scrollbar">
                <div className="max-w-[1920px] mx-auto px-4 md:px-6 py-6">
                    {currentView === 'quadratic' && (
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                                <div className="lg:col-span-3 flex flex-col gap-6 sticky top-6">
                                    <Controls 
                                    params={params} 
                                    onChange={handleParamChange} 
                                    onReset={() => setParams({ a: 1, b: 0, c: 0 })} 
                                    onRandomize={handleRandomize}
                                    onSnapshot={() => setSnapshotParams({...params})}
                                    lang={lang}
                                    />
                                    <div className="hidden lg:block">
                                    <Explanations params={params} lang={lang} />
                                    </div>
                                </div>

                                <div className="lg:col-span-9 flex flex-col gap-6 pb-20">
                                    <QuadraticChart data={graphData} stats={stats} params={params} lang={lang} />
                                    <Stats stats={stats} lang={lang} />
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <SolutionSteps params={params} stats={stats} lang={lang} />
                                    <div className="block lg:hidden">
                                        <Explanations params={params} lang={lang} />
                                    </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {currentView === 'reentry' && (
                         <div className="h-full animate-in fade-in slide-in-from-bottom-2 duration-500 pb-20">
                            <ReentrySimulator />
                        </div>
                    )}

                    {currentView === 'gravity' && (
                         <div className="h-full animate-in fade-in slide-in-from-bottom-2 duration-500 pb-20">
                            <GravitySandbox lang={lang} />
                        </div>
                    )}

                    {currentView === 'optics' && (
                         <div className="h-full animate-in fade-in slide-in-from-bottom-2 duration-500 pb-20">
                            <WaveOptics lang={lang} />
                        </div>
                    )}
                </div>
            </div>
        </div>
      )}

      {/* Snapshot Overlay */}
      {snapshotParams && currentView === 'quadratic' && (
        <SnapshotViewer 
          currentParams={params} 
          snapshotParams={snapshotParams} 
          onClose={() => setSnapshotParams(null)} 
        />
      )}

      {/* Notes Panel - Available in all simulations */}
      <NotesPanel 
        simulationType={currentView} 
        isOpen={showNotes} 
        onClose={() => setShowNotes(false)} 
      />

      {/* Web Browser Panel */}
      <WebBrowser 
        isOpen={showBrowser} 
        onClose={() => setShowBrowser(false)} 
        lang={lang}
      />

      {/* FPS Counter */}
      <FPSCounter show={showFPS && currentView !== 'launcher'} />
    </div>
  );
};

export default App;
