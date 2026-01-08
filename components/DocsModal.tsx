import React from 'react';

interface DocsModalProps {
  isOpen: boolean;
  onClose: () => void;
  docId: string | null;
}

const docs: Record<string, { title: string; content: React.ReactNode }> = {
  'quick-start': {
    title: 'Quick Start Guide',
    content: (
      <div className="space-y-4">
        <p>Welcome to Aether Labs! Here's how to get started:</p>
        <div className="space-y-3">
          <div className="p-4 bg-white/5 rounded-xl border border-white/10">
            <h4 className="text-cyan-400 font-bold mb-2">1. Choose a Simulation</h4>
            <p className="text-sm text-slate-400">From the main menu, click on any simulation card to open it. You can also open simulations in new windows (Desktop App only).</p>
          </div>
          <div className="p-4 bg-white/5 rounded-xl border border-white/10">
            <h4 className="text-cyan-400 font-bold mb-2">2. Adjust Parameters</h4>
            <p className="text-sm text-slate-400">Use the sliders and controls on the left panel to modify simulation parameters in real-time.</p>
          </div>
          <div className="p-4 bg-white/5 rounded-xl border border-white/10">
            <h4 className="text-cyan-400 font-bold mb-2">3. Take Notes</h4>
            <p className="text-sm text-slate-400">Click the Notes button in the top-right to record your observations. Notes are saved automatically.</p>
          </div>
          <div className="p-4 bg-white/5 rounded-xl border border-white/10">
            <h4 className="text-cyan-400 font-bold mb-2">4. Return to Hub</h4>
            <p className="text-sm text-slate-400">Click the "Hub" button in the top-left to return to the main menu.</p>
          </div>
        </div>
      </div>
    )
  },
  'keyboard': {
    title: 'Keyboard Shortcuts',
    content: (
      <div className="space-y-4">
        <p className="text-slate-400">Master these shortcuts for faster navigation:</p>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-white/5 rounded-lg border border-white/10">
            <kbd className="px-2 py-1 bg-black/30 rounded text-cyan-400 text-xs">W A S D</kbd>
            <p className="text-xs text-slate-400 mt-2">Move camera (Gravity Sandbox)</p>
          </div>
          <div className="p-3 bg-white/5 rounded-lg border border-white/10">
            <kbd className="px-2 py-1 bg-black/30 rounded text-cyan-400 text-xs">Space</kbd>
            <p className="text-xs text-slate-400 mt-2">Move camera up</p>
          </div>
          <div className="p-3 bg-white/5 rounded-lg border border-white/10">
            <kbd className="px-2 py-1 bg-black/30 rounded text-cyan-400 text-xs">Shift</kbd>
            <p className="text-xs text-slate-400 mt-2">Move camera down</p>
          </div>
          <div className="p-3 bg-white/5 rounded-lg border border-white/10">
            <kbd className="px-2 py-1 bg-black/30 rounded text-cyan-400 text-xs">Right Click</kbd>
            <p className="text-xs text-slate-400 mt-2">Shoot new body</p>
          </div>
          <div className="p-3 bg-white/5 rounded-lg border border-white/10">
            <kbd className="px-2 py-1 bg-black/30 rounded text-cyan-400 text-xs">Scroll</kbd>
            <p className="text-xs text-slate-400 mt-2">Zoom in/out</p>
          </div>
          <div className="p-3 bg-white/5 rounded-lg border border-white/10">
            <kbd className="px-2 py-1 bg-black/30 rounded text-cyan-400 text-xs">Left Click + Drag</kbd>
            <p className="text-xs text-slate-400 mt-2">Rotate camera view</p>
          </div>
        </div>
      </div>
    )
  },
  'notes': {
    title: 'Notes System',
    content: (
      <div className="space-y-4">
        <p className="text-slate-400">The Notes system helps you document your experiments:</p>
        <div className="space-y-3">
          <div className="p-4 bg-white/5 rounded-xl border border-white/10">
            <h4 className="text-purple-400 font-bold mb-2">Creating Notes</h4>
            <p className="text-sm text-slate-400">Click "New Note" to create a note. Each note has a title, author, and content area.</p>
          </div>
          <div className="p-4 bg-white/5 rounded-xl border border-white/10">
            <h4 className="text-purple-400 font-bold mb-2">Auto-Save</h4>
            <p className="text-sm text-slate-400">Notes are automatically saved to your browser's local storage. They persist between sessions.</p>
          </div>
          <div className="p-4 bg-white/5 rounded-xl border border-white/10">
            <h4 className="text-purple-400 font-bold mb-2">Exporting</h4>
            <p className="text-sm text-slate-400">Export your notes as JSON (for backup) or TXT (for reading). Use the buttons at the bottom of the notes panel.</p>
          </div>
          <div className="p-4 bg-white/5 rounded-xl border border-white/10">
            <h4 className="text-purple-400 font-bold mb-2">Per-Simulation Notes</h4>
            <p className="text-sm text-slate-400">Notes are organized by simulation. Each simulation has its own separate notes collection.</p>
          </div>
        </div>
      </div>
    )
  },
  'quadratic': {
    title: 'Quadratic Equations',
    content: (
      <div className="space-y-4">
        <p className="text-slate-400">Explore the mathematics of parabolas:</p>
        <div className="p-4 bg-cyan-500/10 rounded-xl border border-cyan-500/20 mb-4">
          <p className="text-lg font-mono text-cyan-400 text-center">ax² + bx + c = 0</p>
        </div>
        <div className="space-y-3">
          <div className="p-4 bg-white/5 rounded-xl border border-white/10">
            <h4 className="text-cyan-400 font-bold mb-2">Coefficient a (Curvature)</h4>
            <p className="text-sm text-slate-400">Controls the "width" and direction of the parabola. Positive = opens up, Negative = opens down.</p>
          </div>
          <div className="p-4 bg-white/5 rounded-xl border border-white/10">
            <h4 className="text-emerald-400 font-bold mb-2">Coefficient b (Slope)</h4>
            <p className="text-sm text-slate-400">Affects the horizontal position of the vertex and the axis of symmetry.</p>
          </div>
          <div className="p-4 bg-white/5 rounded-xl border border-white/10">
            <h4 className="text-purple-400 font-bold mb-2">Coefficient c (Y-Intercept)</h4>
            <p className="text-sm text-slate-400">The point where the parabola crosses the y-axis (when x=0).</p>
          </div>
          <div className="p-4 bg-white/5 rounded-xl border border-white/10">
            <h4 className="text-orange-400 font-bold mb-2">Discriminant (Δ = b² - 4ac)</h4>
            <p className="text-sm text-slate-400">Δ &gt; 0: Two real roots | Δ = 0: One root | Δ &lt; 0: No real roots</p>
          </div>
        </div>
      </div>
    )
  },
  'reentry': {
    title: 'Atmospheric Reentry',
    content: (
      <div className="space-y-4">
        <p className="text-slate-400">Simulate spacecraft reentry into Earth's atmosphere:</p>
        <div className="space-y-3">
          <div className="p-4 bg-white/5 rounded-xl border border-white/10">
            <h4 className="text-orange-400 font-bold mb-2">Entry Angle</h4>
            <p className="text-sm text-slate-400">The angle at which the spacecraft enters the atmosphere. Too steep = high G-forces and heat. Too shallow = skip off atmosphere.</p>
          </div>
          <div className="p-4 bg-white/5 rounded-xl border border-white/10">
            <h4 className="text-cyan-400 font-bold mb-2">Initial Velocity</h4>
            <p className="text-sm text-slate-400">Orbital velocity is ~7,500 m/s. Higher velocities (like returning from the Moon) create more heat.</p>
          </div>
          <div className="p-4 bg-white/5 rounded-xl border border-white/10">
            <h4 className="text-emerald-400 font-bold mb-2">Drag Coefficient</h4>
            <p className="text-sm text-slate-400">Blunt bodies (high Cd) create more drag, slowing down faster but generating more heat initially.</p>
          </div>
          <div className="p-4 bg-red-500/10 rounded-xl border border-red-500/20">
            <h4 className="text-red-400 font-bold mb-2">Critical Temperatures</h4>
            <p className="text-sm text-slate-400">Above ~1400°C plasma forms around the spacecraft. Heat shields must withstand up to 3000°C.</p>
          </div>
        </div>
      </div>
    )
  },
  'gravity': {
    title: 'N-Body Gravity Simulation',
    content: (
      <div className="space-y-4">
        <p className="text-slate-400">Explore gravitational interactions between celestial bodies:</p>
        <div className="p-4 bg-purple-500/10 rounded-xl border border-purple-500/20 mb-4">
          <p className="text-lg font-mono text-purple-400 text-center">F = G(m₁m₂) / r²</p>
        </div>
        <div className="space-y-3">
          <div className="p-4 bg-white/5 rounded-xl border border-white/10">
            <h4 className="text-purple-400 font-bold mb-2">Controls</h4>
            <p className="text-sm text-slate-400">WASD to move, Space/Shift for up/down, mouse drag to look around, scroll to zoom.</p>
          </div>
          <div className="p-4 bg-white/5 rounded-xl border border-white/10">
            <h4 className="text-cyan-400 font-bold mb-2">Creating Bodies</h4>
            <p className="text-sm text-slate-400">Right-click to shoot a new body. Adjust mass, radius, and velocity in the launch settings.</p>
          </div>
          <div className="p-4 bg-white/5 rounded-xl border border-white/10">
            <h4 className="text-orange-400 font-bold mb-2">Presets</h4>
            <p className="text-sm text-slate-400">Try Solar System, Binary Stars, or Chaos mode to see different gravitational scenarios.</p>
          </div>
          <div className="p-4 bg-white/5 rounded-xl border border-white/10">
            <h4 className="text-emerald-400 font-bold mb-2">Collisions</h4>
            <p className="text-sm text-slate-400">Bodies can merge (combining mass) or bounce depending on the collision mode setting.</p>
          </div>
        </div>
      </div>
    )
  },
  'optics': {
    title: 'Wave Optics',
    content: (
      <div className="space-y-4">
        <p className="text-slate-400">Visualize wave interference and diffraction:</p>
        <div className="p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20 mb-4">
          <p className="text-lg font-mono text-emerald-400 text-center">ψ = A·sin(kx - ωt + φ)</p>
        </div>
        <div className="space-y-3">
          <div className="p-4 bg-white/5 rounded-xl border border-white/10">
            <h4 className="text-emerald-400 font-bold mb-2">Simulation Modes</h4>
            <p className="text-sm text-slate-400">Double Slit (Young's experiment), Single Slit diffraction, Diffraction Grating, and Circular waves.</p>
          </div>
          <div className="p-4 bg-white/5 rounded-xl border border-white/10">
            <h4 className="text-cyan-400 font-bold mb-2">Frequency</h4>
            <p className="text-sm text-slate-400">Higher frequency = shorter wavelength = more interference fringes.</p>
          </div>
          <div className="p-4 bg-white/5 rounded-xl border border-white/10">
            <h4 className="text-purple-400 font-bold mb-2">Phase Difference</h4>
            <p className="text-sm text-slate-400">0° = constructive interference (bright). 180° = destructive interference (dark).</p>
          </div>
          <div className="p-4 bg-white/5 rounded-xl border border-white/10">
            <h4 className="text-orange-400 font-bold mb-2">Separation</h4>
            <p className="text-sm text-slate-400">Distance between wave sources. Affects the spacing of interference patterns.</p>
          </div>
        </div>
      </div>
    )
  }
};

export const DocsModal: React.FC<DocsModalProps> = ({ isOpen, onClose, docId }) => {
  if (!isOpen || !docId) return null;
  
  const doc = docs[docId];
  if (!doc) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0a0f1a] border border-white/10 rounded-2xl shadow-2xl w-[600px] max-w-[95vw] max-h-[80vh] flex flex-col overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-emerald-500 opacity-60"></div>
        
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
              <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white">{doc.title}</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-all">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar text-slate-300">
          {doc.content}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/5 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white text-sm font-medium rounded-lg transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
