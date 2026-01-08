import React, { useState, useEffect } from 'react';

interface Note {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: number;
  updatedAt: number;
  color: string;
}

interface NotesPanelProps {
  simulationType: string;
  isOpen: boolean;
  onClose: () => void;
}

const COLORS = [
  { id: 'cyan', value: '#06b6d4' },
  { id: 'purple', value: '#8b5cf6' },
  { id: 'orange', value: '#f59e0b' },
  { id: 'emerald', value: '#10b981' },
  { id: 'rose', value: '#f43f5e' },
  { id: 'blue', value: '#3b82f6' },
];

const getSimulationLabel = (type: string) => {
  const labels: Record<string, { name: string; color: string }> = {
    'quadratic': { name: 'Quadratic Explorer', color: 'text-cyan-400' },
    'reentry': { name: 'Reentry Simulator', color: 'text-orange-400' },
    'gravity': { name: 'Gravity Sandbox', color: 'text-purple-400' },
    'optics': { name: 'Wave Optics', color: 'text-emerald-400' },
  };
  return labels[type] || { name: type, color: 'text-slate-400' };
};

const formatDate = (timestamp: number) => {
  const date = new Date(timestamp);
  return date.toLocaleDateString('el-GR', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric' 
  });
};

const formatDateTime = (timestamp: number) => {
  const date = new Date(timestamp);
  return date.toLocaleString('el-GR', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const NotesPanel: React.FC<NotesPanelProps> = ({ simulationType, isOpen, onClose }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editAuthor, setEditAuthor] = useState('');
  const [defaultAuthor, setDefaultAuthor] = useState('');

  const storageKey = `aether-notes-${simulationType}`;
  const authorKey = 'aether-default-author';
  const simInfo = getSimulationLabel(simulationType);

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try { setNotes(JSON.parse(saved)); } catch { setNotes([]); }
    }
    const savedAuthor = localStorage.getItem(authorKey);
    if (savedAuthor) setDefaultAuthor(savedAuthor);
  }, [storageKey]);

  const saveNotes = (newNotes: Note[]) => {
    setNotes(newNotes);
    localStorage.setItem(storageKey, JSON.stringify(newNotes));
  };

  const saveDefaultAuthor = (author: string) => {
    setDefaultAuthor(author);
    localStorage.setItem(authorKey, author);
  };

  const createNote = () => {
    const colorObj = COLORS[Math.floor(Math.random() * COLORS.length)];
    const now = Date.now();
    const newNote: Note = {
      id: now.toString(),
      title: 'New Note',
      content: '',
      author: defaultAuthor || 'Anonymous',
      createdAt: now,
      updatedAt: now,
      color: colorObj.value
    };
    saveNotes([newNote, ...notes]);
    setActiveNote(newNote);
    setEditTitle(newNote.title);
    setEditContent(newNote.content);
    setEditAuthor(newNote.author);
  };

  const updateNote = () => {
    if (!activeNote) return;
    const updated = notes.map(n => 
      n.id === activeNote.id 
        ? { ...n, title: editTitle, content: editContent, author: editAuthor, updatedAt: Date.now() }
        : n
    );
    saveNotes(updated);
    if (editAuthor && editAuthor !== defaultAuthor) {
      saveDefaultAuthor(editAuthor);
    }
  };

  const deleteNote = (id: string) => {
    saveNotes(notes.filter(n => n.id !== id));
    if (activeNote?.id === id) {
      setActiveNote(null);
      setEditTitle('');
      setEditContent('');
      setEditAuthor('');
    }
  };

  const selectNote = (note: Note) => {
    if (activeNote) updateNote();
    setActiveNote(note);
    setEditTitle(note.title);
    setEditContent(note.content);
    setEditAuthor(note.author);
  };

  const exportNotes = () => {
    const data = JSON.stringify(notes, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aether-notes-${simulationType}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportAsText = () => {
    const text = notes.map(n => 
      `# ${n.title}\nAuthor: ${n.author}\nCreated: ${formatDateTime(n.createdAt)}\nUpdated: ${formatDateTime(n.updatedAt)}\n\n${n.content}\n\n---\n`
    ).join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aether-notes-${simulationType}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-[#0a0f1a] border border-white/10 rounded-2xl shadow-2xl w-[950px] max-w-[95vw] h-[650px] max-h-[90vh] flex overflow-hidden relative">
        
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-orange-500 opacity-60"></div>
        
        {/* Sidebar */}
        <div className="w-72 bg-[#060a12] border-r border-white/5 flex flex-col">
          <div className="p-5 border-b border-white/5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <div>
                <h2 className="text-sm font-bold text-white uppercase tracking-widest">Notes</h2>
                <p className={`text-[10px] ${simInfo.color} font-mono`}>{simInfo.name}</p>
              </div>
            </div>
            
            <button 
              onClick={createNote}
              className="w-full px-4 py-2.5 bg-gradient-to-r from-cyan-500/20 to-cyan-500/10 hover:from-cyan-500/30 hover:to-cyan-500/20 text-cyan-400 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 border border-cyan-500/30 hover:border-cyan-500/50"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              New Note
            </button>
          </div>
          
          {/* Notes List */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
            {notes.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-xs text-slate-600">No notes yet</p>
              </div>
            ) : (
              notes.map(note => (
                <button
                  key={note.id}
                  onClick={() => selectNote(note)}
                  className={`w-full text-left p-3 rounded-xl transition-all group relative overflow-hidden ${
                    activeNote?.id === note.id 
                      ? 'bg-white/10 border border-white/20 shadow-lg' 
                      : 'bg-white/5 border border-transparent hover:bg-white/10 hover:border-white/10'
                  }`}
                >
                  <div className="absolute top-0 left-0 w-1 h-full rounded-l-xl" style={{ backgroundColor: note.color }}></div>
                  <div className="pl-2">
                    <p className="text-sm text-white font-medium truncate mb-0.5">{note.title}</p>
                    <p className="text-[10px] text-cyan-400/70 truncate mb-1">by {note.author}</p>
                    <div className="flex items-center gap-2 text-[9px] text-slate-600 font-mono">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {formatDate(note.createdAt)}
                    </div>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); deleteNote(note.id); }}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 w-6 h-6 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 flex items-center justify-center transition-all"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </button>
              ))
            )}
          </div>

          {/* Export Buttons */}
          <div className="p-3 border-t border-white/5 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <button onClick={exportNotes} className="px-3 py-2 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white text-[10px] font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 border border-white/5">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                JSON
              </button>
              <button onClick={exportAsText} className="px-3 py-2 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white text-[10px] font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 border border-white/5">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                TXT
              </button>
            </div>
          </div>
        </div>

        {/* Main Editor */}
        <div className="flex-1 flex flex-col bg-[#0B1221]/50">
          <div className="h-14 px-6 flex items-center justify-between border-b border-white/5">
            <div className="flex items-center gap-3">
              {activeNote && (
                <>
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: activeNote.color }}></span>
                  <span className="text-xs text-slate-500 font-mono">{notes.length} notes</span>
                </>
              )}
            </div>
            <button 
              onClick={() => { if (activeNote) updateNote(); onClose(); }}
              className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-all border border-white/10"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {activeNote ? (
            <div className="flex-1 flex flex-col p-6 overflow-hidden">
              {/* Title */}
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onBlur={updateNote}
                placeholder="Note title..."
                className="text-2xl font-bold text-white bg-transparent border-none outline-none mb-3 placeholder-slate-600"
              />
              
              {/* Author & Date Info */}
              <div className="flex items-center gap-4 mb-4 pb-4 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <input
                    type="text"
                    value={editAuthor}
                    onChange={(e) => setEditAuthor(e.target.value)}
                    onBlur={updateNote}
                    placeholder="Author name..."
                    className="text-sm text-cyan-400 bg-transparent border-none outline-none placeholder-slate-600 w-32"
                  />
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Created: {formatDateTime(activeNote.createdAt)}</span>
                </div>
              </div>

              {/* Content */}
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                onBlur={updateNote}
                placeholder="Write your observations, calculations, or ideas here..."
                className="flex-1 text-sm text-slate-300 bg-[#060a12] border border-white/5 rounded-xl p-5 outline-none resize-none placeholder-slate-600 focus:border-cyan-500/30 transition-colors custom-scrollbar leading-relaxed"
              />
              
              {/* Footer */}
              <div className="mt-4 flex items-center justify-between text-[10px] text-slate-600">
                <span className="flex items-center gap-2">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Updated: {formatDateTime(activeNote.updatedAt)}
                </span>
                <span className="font-mono">{editContent.length} chars</span>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 flex items-center justify-center">
                  <svg className="w-10 h-10 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <p className="text-slate-500 text-sm mb-1">Select a note or create a new one</p>
                <p className="text-slate-600 text-xs">Your notes are saved locally</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
