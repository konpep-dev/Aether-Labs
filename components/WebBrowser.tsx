import React, { useState, useEffect } from 'react';
import { Language } from '../utils/translations';

interface WebBrowserProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

const QUICK_LINKS = [
  { name: 'Wikipedia Physics', nameEl: 'Βικιπαίδεια Φυσική', url: 'https://en.wikipedia.org/wiki/Physics', category: 'reference' },
  { name: 'Khan Academy', nameEl: 'Khan Academy', url: 'https://www.khanacademy.org/science/physics', category: 'learning' },
  { name: 'Wolfram Alpha', nameEl: 'Wolfram Alpha', url: 'https://www.wolframalpha.com/', category: 'tools' },
  { name: 'PhET Simulations', nameEl: 'PhET Προσομοιώσεις', url: 'https://phet.colorado.edu/', category: 'simulations' },
  { name: 'Desmos Calculator', nameEl: 'Desmos', url: 'https://www.desmos.com/calculator', category: 'tools' },
  { name: 'GeoGebra', nameEl: 'GeoGebra', url: 'https://www.geogebra.org/', category: 'tools' },
  { name: 'HyperPhysics', nameEl: 'HyperPhysics', url: 'http://hyperphysics.phy-astr.gsu.edu/', category: 'reference' },
  { name: 'Physics Forums', nameEl: 'Physics Forums', url: 'https://www.physicsforums.com/', category: 'community' },
  { name: 'MIT OpenCourseWare', nameEl: 'MIT Μαθήματα', url: 'https://ocw.mit.edu/courses/physics/', category: 'learning' },
  { name: 'Brilliant.org', nameEl: 'Brilliant', url: 'https://brilliant.org/', category: 'learning' },
  { name: 'Symbolab', nameEl: 'Symbolab', url: 'https://www.symbolab.com/', category: 'tools' },
  { name: 'Physics Classroom', nameEl: 'Physics Classroom', url: 'https://www.physicsclassroom.com/', category: 'learning' },
];

const SEARCH_ENGINES = [
  { name: 'Google', nameEl: 'Google', url: 'https://www.google.com/search?q=' },
  { name: 'DuckDuckGo', nameEl: 'DuckDuckGo', url: 'https://duckduckgo.com/?q=' },
  { name: 'Wikipedia', nameEl: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Special:Search?search=' },
  { name: 'Wolfram', nameEl: 'Wolfram', url: 'https://www.wolframalpha.com/input?i=' },
];

const RECENT_KEY = 'aether-recent-searches';

const getCategoryStyle = (cat: string) => {
  const styles: Record<string, {bg: string, text: string}> = {
    reference: { bg: 'from-blue-500/20 to-cyan-500/20', text: 'text-blue-400' },
    learning: { bg: 'from-emerald-500/20 to-teal-500/20', text: 'text-emerald-400' },
    tools: { bg: 'from-purple-500/20 to-pink-500/20', text: 'text-purple-400' },
    simulations: { bg: 'from-orange-500/20 to-amber-500/20', text: 'text-orange-400' },
    community: { bg: 'from-rose-500/20 to-red-500/20', text: 'text-rose-400' },
  };
  return styles[cat] || { bg: 'from-slate-500/20 to-slate-600/20', text: 'text-slate-400' };
};

export const WebBrowser: React.FC<WebBrowserProps> = ({ isOpen, onClose, lang }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchEngine, setSearchEngine] = useState(0);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(RECENT_KEY);
    if (saved) setRecentSearches(JSON.parse(saved));
  }, []);

  if (!isOpen) return null;

  const openExternal = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    const url = SEARCH_ENGINES[searchEngine].url + encodeURIComponent(searchQuery);
    openExternal(url);
    
    const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 8);
    setRecentSearches(updated);
    localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
    setSearchQuery('');
  };

  const clearRecent = () => {
    setRecentSearches([]);
    localStorage.removeItem(RECENT_KEY);
  };

  const categories = ['reference', 'learning', 'tools', 'simulations', 'community'];
  const filteredLinks = activeCategory 
    ? QUICK_LINKS.filter(l => l.category === activeCategory)
    : QUICK_LINKS;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-4xl max-h-[90vh] bg-gradient-to-b from-[#0B1221] to-[#050b14] rounded-3xl border border-white/10 shadow-2xl shadow-cyan-500/5 flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">{lang === 'el' ? 'Αναζήτηση Web' : 'Web Search'}</h2>
                <p className="text-xs text-slate-500">{lang === 'el' ? 'Ανοίγει στον browser σας' : 'Opens in your browser'}</p>
              </div>
            </div>
            <button onClick={onClose} className="w-10 h-10 rounded-xl bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/30 flex items-center justify-center text-slate-400 hover:text-red-400 transition-all">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Search Bar */}
          <div className="flex gap-3">
            <div className="flex bg-white/5 rounded-xl p-1 border border-white/5">
              {SEARCH_ENGINES.map((eng, idx) => (
                <button
                  key={eng.name}
                  onClick={() => setSearchEngine(idx)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    searchEngine === idx 
                      ? 'bg-cyan-500/20 text-cyan-400' 
                      : 'text-slate-500 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {eng.name}
                </button>
              ))}
            </div>
            <div className="flex-1 flex items-center gap-2 bg-white/5 rounded-xl px-4 border border-white/5 focus-within:border-cyan-500/30">
              <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder={lang === 'el' ? 'Αναζήτηση...' : 'Search...'}
                className="flex-1 bg-transparent py-3 text-sm text-white placeholder-slate-500 outline-none"
                autoFocus
              />
              <button 
                onClick={handleSearch}
                className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white text-xs font-bold rounded-lg transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {lang === 'el' ? 'Πρόσφατες Αναζητήσεις' : 'Recent Searches'}
                </h3>
                <button onClick={clearRecent} className="text-xs text-slate-500 hover:text-red-400 transition-colors flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  {lang === 'el' ? 'Καθαρισμός' : 'Clear'}
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((search, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSearchQuery(search);
                      handleSearch();
                    }}
                    className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg border border-white/5 text-xs text-slate-300 hover:text-white transition-all"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Category Filter */}
          <div className="mb-6">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
              {lang === 'el' ? 'Κατηγορίες' : 'Categories'}
            </h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveCategory(null)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  !activeCategory ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'bg-white/5 text-slate-400 border border-white/5 hover:bg-white/10'
                }`}
              >
                {lang === 'el' ? 'Όλα' : 'All'}
              </button>
              {categories.map(cat => {
                const style = getCategoryStyle(cat);
                const labels: Record<string, {en: string, el: string}> = {
                  reference: { en: 'Reference', el: 'Αναφορά' },
                  learning: { en: 'Learning', el: 'Μάθηση' },
                  tools: { en: 'Tools', el: 'Εργαλεία' },
                  simulations: { en: 'Simulations', el: 'Προσομοιώσεις' },
                  community: { en: 'Community', el: 'Κοινότητα' },
                };
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      activeCategory === cat 
                        ? `bg-gradient-to-r ${style.bg} ${style.text} border border-white/10` 
                        : 'bg-white/5 text-slate-400 border border-white/5 hover:bg-white/10'
                    }`}
                  >
                    {lang === 'el' ? labels[cat].el : labels[cat].en}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              {lang === 'el' ? 'Γρήγοροι Σύνδεσμοι' : 'Quick Links'}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {filteredLinks.map((link) => {
                const style = getCategoryStyle(link.category);
                return (
                  <button
                    key={link.name}
                    onClick={() => openExternal(link.url)}
                    className="group p-4 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 hover:border-white/10 transition-all text-left"
                  >
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${style.bg} flex items-center justify-center mb-3 ${style.text} group-hover:scale-110 transition-transform`}>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                      </svg>
                    </div>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-sm font-medium text-white group-hover:text-cyan-400 transition-colors block">
                          {lang === 'el' ? link.nameEl : link.name}
                        </span>
                        <span className="text-[10px] text-slate-500 mt-0.5 block truncate">
                          {link.url.replace('https://', '').replace('http://', '').split('/')[0]}
                        </span>
                      </div>
                      <svg className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 transition-colors shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/5 bg-black/20">
          <p className="text-[11px] text-slate-500 text-center flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {lang === 'el' 
              ? 'Οι σύνδεσμοι ανοίγουν στον προεπιλεγμένο browser σας' 
              : 'Links open in your default browser'}
          </p>
        </div>
      </div>
    </div>
  );
};
