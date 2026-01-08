import React, { useRef, useEffect, useState, useCallback } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { translations, Language } from '../utils/translations';

type ColorMode = 'interference' | 'heatmap' | 'mono' | 'rainbow';
type SimMode = 'double-slit' | 'single-slit' | 'diffraction-grating' | 'circular';

interface GraphData { index: number; intensity: number; }
interface DiffractionData { angle: number; intensity: number; }
interface MeasurementPoint { x: number; y: number; intensity: number; phase: number; }

const ControlSlider: React.FC<{
  label: string; value: number; min: number; max: number; step: number;
  onChange: (val: number) => void; unit: string; color?: string;
}> = ({ label, value, min, max, step, onChange, unit, color = "cyan" }) => (
  <div className="mb-4">
    <div className="flex justify-between mb-1.5">
      <span className="text-[10px] uppercase text-slate-400 font-bold tracking-widest">{label}</span>
      <span className={`text-xs font-mono font-bold text-${color}-400`}>{value.toFixed(step < 1 ? 1 : 0)}{unit}</span>
    </div>
    <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(parseFloat(e.target.value))} className="w-full accent-cyan-500" />
  </div>
);

export const WaveOptics: React.FC<{ lang: Language }> = ({ lang }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Wave parameters
  const [freq, setFreq] = useState(20);
  const [separation, setSeparation] = useState(60);
  const [phase, setPhase] = useState(0);
  const [amplitude, setAmplitude] = useState(1.0);
  const [numSources, setNumSources] = useState(2);
  const [slitWidth, setSlitWidth] = useState(10);
  
  // Display options
  const [colorMode, setColorMode] = useState<ColorMode>('interference');
  const [simMode, setSimMode] = useState<SimMode>('double-slit');
  const [showWavefronts, setShowWavefronts] = useState(false);
  const [showIntensityOverlay, setShowIntensityOverlay] = useState(true);
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const [paused, setPaused] = useState(false);
  
  // Measurement tools
  const [measureMode, setMeasureMode] = useState(false);
  const [measurePoints, setMeasurePoints] = useState<MeasurementPoint[]>([]);
  const [showRuler, setShowRuler] = useState(false);
  
  // Data
  const [graphData, setGraphData] = useState<GraphData[]>([]);
  const [diffractionData, setDiffractionData] = useState<DiffractionData[]>([]);
  
  const safeLang = translations[lang] ? lang : 'en';
  const t = translations[safeLang].optics;

  // Derived calculations
  const wavelength = 1000 / freq;
  const pathDiff = separation * Math.sin(Math.PI / 6);

  // Calculate fringe spacing (for double slit)
  const fringeSpacing = simMode === 'double-slit' ? (wavelength * 200) / separation : 0;
  
  // Calculate theoretical maxima positions
  const getMaximaPositions = useCallback(() => {
    const positions: number[] = [];
    if (simMode === 'double-slit') {
      for (let m = -5; m <= 5; m++) {
        const angle = Math.asin((m * wavelength) / separation);
        if (!isNaN(angle)) positions.push(angle * 180 / Math.PI);
      }
    }
    return positions;
  }, [simMode, wavelength, separation]);

  // Calculate theoretical diffraction pattern
  useEffect(() => {
    const data: DiffractionData[] = [];
    for (let angle = -90; angle <= 90; angle += 1) {
      const theta = (angle * Math.PI) / 180;
      let intensity = 0;
      
      if (simMode === 'double-slit') {
        const delta = (Math.PI * separation * Math.sin(theta)) / wavelength;
        intensity = Math.pow(Math.cos(delta), 2);
      } else if (simMode === 'single-slit') {
        const beta = (Math.PI * slitWidth * Math.sin(theta)) / wavelength;
        intensity = beta === 0 ? 1 : Math.pow(Math.sin(beta) / beta, 2);
      } else if (simMode === 'diffraction-grating') {
        const delta = (Math.PI * separation * Math.sin(theta)) / wavelength;
        const N = numSources;
        const numerator = Math.sin(N * delta);
        const denominator = Math.sin(delta);
        intensity = denominator === 0 ? N * N : Math.pow(numerator / denominator, 2) / (N * N);
      }
      
      data.push({ angle, intensity: Math.min(1, intensity) });
    }
    setDiffractionData(data);
  }, [freq, separation, slitWidth, numSources, simMode, wavelength]);

  // Presets with real-world values
  const applyPreset = (type: string) => {
    setMeasurePoints([]);
    if (type === 'young') { setFreq(15); setSeparation(40); setPhase(0); setAmplitude(1.2); setSimMode('double-slit'); setNumSources(2); }
    if (type === 'wide') { setFreq(10); setSeparation(120); setPhase(180); setAmplitude(1.0); setSimMode('double-slit'); }
    if (type === 'high') { setFreq(45); setSeparation(80); setPhase(0); setAmplitude(0.8); setSimMode('double-slit'); }
    if (type === 'grating') { setFreq(25); setSeparation(30); setNumSources(5); setSimMode('diffraction-grating'); }
    if (type === 'single') { setFreq(20); setSlitWidth(20); setSimMode('single-slit'); }
    if (type === 'circular') { setFreq(15); setSimMode('circular'); setNumSources(1); }
    if (type === 'laser') { setFreq(50); setSeparation(50); setPhase(0); setAmplitude(1.5); setSimMode('double-slit'); }
  };

  // Handle canvas click for measurements
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!measureMode || !canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasRef.current.width / rect.width;
    const scaleY = canvasRef.current.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    
    // Calculate intensity at this point
    const cx = canvasRef.current.width / 2;
    const cy = canvasRef.current.height / 2;
    
    let val = 0;
    const sources: {x: number, y: number, phase: number}[] = [];
    
    if (simMode === 'double-slit') {
      sources.push({ x: cx - separation / 2, y: cy, phase: 0 });
      sources.push({ x: cx + separation / 2, y: cy, phase: (phase * Math.PI) / 180 });
    } else if (simMode === 'circular') {
      sources.push({ x: cx, y: cy, phase: 0 });
    }
    
    for (const src of sources) {
      const d = Math.sqrt((x - src.x) ** 2 + (y - src.y) ** 2);
      val += Math.sin(d * (freq / 150) + src.phase) * amplitude / sources.length;
    }
    
    const newPoint: MeasurementPoint = {
      x, y,
      intensity: val,
      phase: (val + 1) / 2 * 360
    };
    
    setMeasurePoints(prev => [...prev.slice(-4), newPoint]); // Keep last 5 points
  };

  // HSL to RGB helper
  function hslToRgb(h: number, s: number, l: number): [number, number, number] {
    let r, g, b;
    if (s === 0) { r = g = b = l; }
    else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1; if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  }

  // Main render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 400;
    const height = 400;
    canvas.width = width;
    canvas.height = height;

    const imgData = ctx.createImageData(width, height);
    const data = imgData.data;

    let time = 0;
    let animationId: number;
    let frameCount = 0;

    const render = () => {
      if (!paused) time += 0.15 * animationSpeed;
      frameCount++;
      
      const cy = height / 2;
      const cx = width / 2;
      
      const sources: {x: number, y: number, phase: number}[] = [];
      
      if (simMode === 'double-slit') {
        sources.push({ x: cx - separation / 2, y: cy, phase: 0 });
        sources.push({ x: cx + separation / 2, y: cy, phase: (phase * Math.PI) / 180 });
      } else if (simMode === 'single-slit') {
        for (let i = 0; i < 5; i++) {
          const offset = (i - 2) * (slitWidth / 4);
          sources.push({ x: cx + offset, y: cy, phase: 0 });
        }
      } else if (simMode === 'diffraction-grating') {
        for (let i = 0; i < numSources; i++) {
          const offset = (i - (numSources - 1) / 2) * separation;
          sources.push({ x: cx + offset, y: cy, phase: 0 });
        }
      } else if (simMode === 'circular') {
        sources.push({ x: cx, y: cy, phase: 0 });
      }

      const currentLineData: GraphData[] = [];
      const sampleRow = Math.floor(height * 0.8);

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const idx = (x + y * width) * 4;
          
          let val = 0;
          for (const src of sources) {
            const d = Math.sqrt((x - src.x) ** 2 + (y - src.y) ** 2);
            const wave = Math.sin(d * (freq / 150) - time + src.phase);
            val += wave * amplitude / sources.length;
          }

          if (y === sampleRow && frameCount % 3 === 0) {
            currentLineData.push({ index: x, intensity: val });
          }

          let r = 0, g = 0, b = 0;

          if (colorMode === 'interference') {
            const intensity = Math.abs(val);
            r = val > 0 ? 0 : Math.floor(intensity * 100);
            g = val > 0 ? Math.floor(intensity * 255) : Math.floor(intensity * 50);
            b = Math.floor(intensity * 255);
            if (Math.abs(val) < 0.05) { r = 8; g = 12; b = 24; }
          } else if (colorMode === 'heatmap') {
            const norm = (val + 1) / 2;
            r = Math.floor(norm * 255);
            g = Math.floor(Math.sin(norm * Math.PI) * 150);
            b = Math.floor((1 - norm) * 255);
          } else if (colorMode === 'rainbow') {
            const hue = ((val + 1) / 2) * 270;
            const [hr, hg, hb] = hslToRgb(hue / 360, 0.8, 0.5);
            r = hr; g = hg; b = hb;
          } else {
            const gray = Math.floor(((val + 1) / 2) * 255);
            r = g = b = gray;
          }

          data[idx] = r;
          data[idx + 1] = g;
          data[idx + 2] = b;
          data[idx + 3] = 255;
        }
      }

      ctx.putImageData(imgData, 0, 0);

      // Draw wavefronts
      if (showWavefronts) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 1;
        for (const src of sources) {
          for (let r = 0; r < 400; r += 30) {
            const phaseVal = (r * (freq / 150) - time) % (Math.PI * 2);
            if (Math.abs(phaseVal) < 0.3 || Math.abs(phaseVal - Math.PI * 2) < 0.3) {
              ctx.beginPath();
              ctx.arc(src.x, src.y, r, 0, Math.PI * 2);
              ctx.stroke();
            }
          }
        }
      }

      // Draw ruler
      if (showRuler) {
        ctx.strokeStyle = 'rgba(255, 255, 0, 0.5)';
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);
        // Horizontal ruler
        ctx.beginPath();
        ctx.moveTo(0, cy);
        ctx.lineTo(width, cy);
        ctx.stroke();
        // Vertical ruler
        ctx.beginPath();
        ctx.moveTo(cx, 0);
        ctx.lineTo(cx, height);
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Scale markers
        ctx.fillStyle = 'rgba(255, 255, 0, 0.7)';
        ctx.font = '10px monospace';
        for (let i = -4; i <= 4; i++) {
          if (i !== 0) {
            const xPos = cx + i * 50;
            ctx.fillText(`${i * 50}px`, xPos - 15, cy - 5);
          }
        }
      }

      // Draw source markers
      ctx.fillStyle = '#ffffff';
      for (const src of sources) {
        ctx.beginPath();
        ctx.arc(src.x, src.y, 4, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw measurement points
      if (measurePoints.length > 0) {
        measurePoints.forEach((pt, idx) => {
          ctx.strokeStyle = '#ff0';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 8, 0, Math.PI * 2);
          ctx.stroke();
          ctx.fillStyle = '#ff0';
          ctx.font = 'bold 10px monospace';
          ctx.fillText(`${idx + 1}`, pt.x - 3, pt.y + 3);
        });
      }

      // Intensity line overlay
      if (showIntensityOverlay) {
        ctx.strokeStyle = 'rgba(255, 255, 0, 0.5)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, sampleRow);
        ctx.lineTo(width, sampleRow);
        ctx.stroke();
      }

      if (frameCount % 3 === 0) {
        setGraphData(currentLineData);
      }

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [freq, separation, phase, amplitude, colorMode, simMode, numSources, slitWidth, showWavefronts, showIntensityOverlay, showRuler, animationSpeed, paused, measurePoints]);

  const maximaPositions = getMaximaPositions();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full pb-20">
      
      {/* LEFT: Controls */}
      <div className="lg:col-span-3 flex flex-col gap-4">
        <div className="bg-[#0B1221]/90 backdrop-blur-md p-5 rounded-2xl border border-white/10 shadow-xl">
           <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-widest border-b border-white/10 pb-2 flex items-center gap-2">
             <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
             {t.controls.title}
           </h3>

           {/* Simulation Mode */}
           <div className="mb-4">
             <label className="text-[10px] uppercase text-slate-400 font-bold tracking-widest mb-2 block">
               {lang === 'el' ? 'Τύπος Προσομοίωσης' : 'Simulation Mode'}
             </label>
             <div className="grid grid-cols-2 gap-1">
               {[
                 { id: 'double-slit', label: lang === 'el' ? 'Διπλή Σχισμή' : 'Double Slit' },
                 { id: 'single-slit', label: lang === 'el' ? 'Μονή Σχισμή' : 'Single Slit' },
                 { id: 'diffraction-grating', label: lang === 'el' ? 'Φράγμα' : 'Grating' },
                 { id: 'circular', label: lang === 'el' ? 'Κυκλικό' : 'Circular' }
               ].map(mode => (
                 <button key={mode.id} onClick={() => { setSimMode(mode.id as SimMode); setMeasurePoints([]); }} className={`px-2 py-1.5 text-[10px] rounded border transition-all ${simMode === mode.id ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'}`}>{mode.label}</button>
               ))}
             </div>
           </div>
           
           <ControlSlider label={t.controls.frequency} value={freq} min={5} max={100} step={1} onChange={setFreq} unit=" Hz" color="emerald" />
           <ControlSlider label={t.controls.separation} value={separation} min={10} max={200} step={1} onChange={setSeparation} unit=" px" color="cyan" />
           <ControlSlider label={t.controls.phase} value={phase} min={0} max={360} step={15} onChange={setPhase} unit="°" color="purple" />
           <ControlSlider label={t.controls.amplitude} value={amplitude} min={0.1} max={2.0} step={0.1} onChange={setAmplitude} unit="" color="orange" />
           
           {simMode === 'diffraction-grating' && (
             <ControlSlider label={lang === 'el' ? 'Αριθμός Σχισμών' : 'Number of Slits'} value={numSources} min={2} max={10} step={1} onChange={setNumSources} unit="" color="pink" />
           )}
           {simMode === 'single-slit' && (
             <ControlSlider label={lang === 'el' ? 'Πλάτος Σχισμής' : 'Slit Width'} value={slitWidth} min={5} max={50} step={1} onChange={setSlitWidth} unit=" px" color="yellow" />
           )}
           
           <ControlSlider label={lang === 'el' ? 'Ταχύτητα' : 'Speed'} value={animationSpeed} min={0} max={3} step={0.1} onChange={setAnimationSpeed} unit="x" color="slate" />

           {/* Playback */}
           <div className="flex gap-2 mt-2">
             <button onClick={() => setPaused(!paused)} className={`flex-1 px-3 py-2 rounded-lg text-xs font-bold transition-all ${paused ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/5 text-slate-400 border border-white/10'}`}>
               {paused ? '▶ Play' : '⏸ Pause'}
             </button>
           </div>
        </div>

        {/* Tools Panel */}
        <div className="bg-[#0B1221]/80 backdrop-blur-md p-4 rounded-xl border border-white/10">
          <h4 className="text-[10px] uppercase text-slate-400 font-bold tracking-widest mb-3">
            {lang === 'el' ? 'Εργαλεία Μέτρησης' : 'Measurement Tools'}
          </h4>
          
          <div className="space-y-2 mb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={measureMode} onChange={e => setMeasureMode(e.target.checked)} className="rounded bg-white/10 border-white/20 accent-yellow-500" />
              <span className="text-xs text-slate-300">{lang === 'el' ? 'Λειτουργία Μέτρησης' : 'Measure Mode'}</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={showRuler} onChange={e => setShowRuler(e.target.checked)} className="rounded bg-white/10 border-white/20 accent-yellow-500" />
              <span className="text-xs text-slate-300">{lang === 'el' ? 'Χάρακας' : 'Show Ruler'}</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={showWavefronts} onChange={e => setShowWavefronts(e.target.checked)} className="rounded bg-white/10 border-white/20" />
              <span className="text-xs text-slate-300">{lang === 'el' ? 'Μέτωπα Κύματος' : 'Wavefronts'}</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={showIntensityOverlay} onChange={e => setShowIntensityOverlay(e.target.checked)} className="rounded bg-white/10 border-white/20" />
              <span className="text-xs text-slate-300">{lang === 'el' ? 'Γραμμή Έντασης' : 'Intensity Line'}</span>
            </label>
          </div>

          {measurePoints.length > 0 && (
            <div className="mt-3 p-2 bg-black/30 rounded border border-yellow-500/20">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] text-yellow-400 font-bold">{lang === 'el' ? 'Σημεία Μέτρησης' : 'Measurements'}</span>
                <button onClick={() => setMeasurePoints([])} className="text-[10px] text-red-400 hover:text-red-300">Clear</button>
              </div>
              {measurePoints.map((pt, idx) => (
                <div key={idx} className="text-[10px] text-slate-400 font-mono">
                  #{idx + 1}: I={pt.intensity.toFixed(3)}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Display Options */}
        <div className="bg-[#0B1221]/80 backdrop-blur-md p-4 rounded-xl border border-white/10">
          <h4 className="text-[10px] uppercase text-slate-400 font-bold tracking-widest mb-3">{t.controls.color_mode}</h4>
          <div className="grid grid-cols-2 gap-1">
            {[
              { id: 'interference', label: 'Cyan', color: 'cyan' },
              { id: 'heatmap', label: 'Heat', color: 'red' },
              { id: 'rainbow', label: 'Rainbow', color: 'purple' },
              { id: 'mono', label: 'Mono', color: 'slate' }
            ].map(mode => (
              <button key={mode.id} onClick={() => setColorMode(mode.id as ColorMode)} className={`p-1.5 rounded border text-[10px] transition-all ${colorMode === mode.id ? `bg-${mode.color}-900/30 border-${mode.color}-500 text-${mode.color}-400` : 'bg-white/5 border-transparent text-slate-500 hover:bg-white/10'}`}>{mode.label}</button>
            ))}
          </div>
        </div>
        
        {/* Presets */}
        <div className="bg-[#0B1221]/80 backdrop-blur-md p-4 rounded-xl border border-white/10">
            <h4 className="text-[10px] uppercase text-slate-400 font-bold tracking-widest mb-3">{t.controls.presets}</h4>
            <div className="grid grid-cols-2 gap-2">
                <button onClick={() => applyPreset('young')} className="text-left px-3 py-2 rounded bg-white/5 hover:bg-white/10 border border-white/5 text-[10px] text-slate-300 hover:border-emerald-500/30 transition-all">{t.controls.preset_young}</button>
                <button onClick={() => applyPreset('laser')} className="text-left px-3 py-2 rounded bg-white/5 hover:bg-white/10 border border-white/5 text-[10px] text-slate-300 hover:border-emerald-500/30 transition-all">{lang === 'el' ? 'Laser' : 'Laser Beam'}</button>
                <button onClick={() => applyPreset('grating')} className="text-left px-3 py-2 rounded bg-white/5 hover:bg-white/10 border border-white/5 text-[10px] text-slate-300 hover:border-emerald-500/30 transition-all">{lang === 'el' ? 'Φράγμα' : 'Grating'}</button>
                <button onClick={() => applyPreset('single')} className="text-left px-3 py-2 rounded bg-white/5 hover:bg-white/10 border border-white/5 text-[10px] text-slate-300 hover:border-emerald-500/30 transition-all">{lang === 'el' ? 'Μονή' : 'Single'}</button>
            </div>
        </div>
      </div>

      {/* RIGHT: Visualizer & Stats */}
      <div className="lg:col-span-9 flex flex-col gap-4 h-full">
         
         {/* Main Viewport */}
         <div className="flex-1 bg-black rounded-2xl border border-white/10 relative overflow-hidden flex flex-col md:flex-row">
            {/* Canvas */}
            <div className="relative flex-1 h-[420px] md:h-auto flex items-center justify-center bg-[#020617]">
                 <canvas 
                   ref={canvasRef} 
                   className={`w-full h-full object-contain max-w-[500px] ${measureMode ? 'cursor-crosshair' : ''}`} 
                   style={{ imageRendering: 'auto' }} 
                   onClick={handleCanvasClick}
                 />
                 
                 {/* Mode Label */}
                 <div className="absolute top-4 left-4 bg-black/60 backdrop-blur px-3 py-1.5 rounded-lg border border-white/10">
                   <span className="text-[10px] text-emerald-400 font-mono uppercase">{simMode.replace('-', ' ')}</span>
                 </div>

                 {/* Measure Mode Indicator */}
                 {measureMode && (
                   <div className="absolute top-4 right-4 bg-yellow-500/20 backdrop-blur px-3 py-1.5 rounded-lg border border-yellow-500/30">
                     <span className="text-[10px] text-yellow-400 font-mono uppercase">{lang === 'el' ? 'ΜΕΤΡΗΣΗ' : 'MEASURE'}</span>
                   </div>
                 )}
            </div>

            {/* Analysis Panel */}
            <div className="w-full md:w-80 bg-[#0B1221]/95 border-t md:border-t-0 md:border-l border-white/10 p-5 flex flex-col justify-start gap-4 overflow-y-auto">
                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-widest border-b border-white/10 pb-2">{t.analysis.title}</h4>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-white/5 rounded-lg">
                    <h5 className="text-[10px] uppercase text-slate-500 font-bold mb-1">{t.analysis.wavelength}</h5>
                    <div className="text-xl font-mono text-emerald-400 font-bold">{wavelength.toFixed(1)}<span className="text-xs text-slate-600 ml-1">px</span></div>
                  </div>
                  <div className="p-3 bg-white/5 rounded-lg">
                    <h5 className="text-[10px] uppercase text-slate-500 font-bold mb-1">{lang === 'el' ? 'Διαφορά Διαδρομής' : 'Path Diff'}</h5>
                    <div className="text-xl font-mono text-cyan-400">{pathDiff.toFixed(1)}<span className="text-xs text-slate-600 ml-1">px</span></div>
                  </div>
                </div>

                {simMode === 'double-slit' && fringeSpacing > 0 && (
                  <div className="p-3 bg-white/5 rounded-lg">
                    <h5 className="text-[10px] uppercase text-slate-500 font-bold mb-1">{lang === 'el' ? 'Απόσταση Κροσσών' : 'Fringe Spacing'}</h5>
                    <div className="text-lg font-mono text-purple-400">{fringeSpacing.toFixed(1)}<span className="text-xs text-slate-600 ml-1">px</span></div>
                    <p className="text-[10px] text-slate-500 mt-1">Δy = λL/d</p>
                  </div>
                )}

                <div className="p-3 bg-white/5 rounded-lg">
                  <h5 className="text-[10px] uppercase text-slate-500 font-bold mb-1">{t.analysis.interference}</h5>
                  <div className="text-sm font-mono">
                    {phase % 360 === 0 ? <span className="text-emerald-400">{t.analysis.constructive}</span> : 
                     phase % 180 === 0 && phase !== 0 ? <span className="text-rose-400">{t.analysis.destructive}</span> : 
                     <span className="text-yellow-400">{lang === 'el' ? 'Μικτή Φάση' : 'Mixed Phase'}</span>}
                  </div>
                </div>

                {/* Maxima Positions */}
                {simMode === 'double-slit' && maximaPositions.length > 0 && (
                  <div className="p-3 bg-white/5 rounded-lg">
                    <h5 className="text-[10px] uppercase text-slate-500 font-bold mb-2">{lang === 'el' ? 'Θέσεις Μεγίστων' : 'Maxima Positions'}</h5>
                    <div className="flex flex-wrap gap-1">
                      {maximaPositions.slice(0, 7).map((pos, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded text-[10px] text-emerald-400 font-mono">
                          {pos.toFixed(1)}°
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Formula Reference */}
                <div className="p-3 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 rounded-lg border border-white/5">
                  <h5 className="text-[10px] uppercase text-slate-500 font-bold mb-2">{lang === 'el' ? 'Τύποι' : 'Formulas'}</h5>
                  <div className="space-y-1 text-[10px] font-mono text-slate-400">
                    <p><span className="text-cyan-400">ψ</span> = Σ Aᵢ·sin(kr - ωt + φᵢ)</p>
                    <p><span className="text-emerald-400">Δ</span> = d·sin(θ) = mλ</p>
                    <p><span className="text-purple-400">I</span> = I₀·cos²(πd·sinθ/λ)</p>
                  </div>
                </div>
            </div>
         </div>

         {/* Bottom Charts */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           {/* Intensity Profile */}
           <div className="h-40 bg-[#0B1221]/90 backdrop-blur-md rounded-xl border border-white/10 p-4 shadow-lg">
               <h4 className="text-xs font-bold text-cyan-400 mb-2 uppercase tracking-widest flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>
                  {t.analysis.profile}
               </h4>
               <ResponsiveContainer width="100%" height="80%">
                  <AreaChart data={graphData}>
                      <defs>
                          <linearGradient id="colorInt" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                          </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="index" hide />
                      <YAxis domain={[-1.2, 1.2]} hide />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', fontSize: 10 }} formatter={(v: number) => v.toFixed(3)} />
                      <Area type="monotone" dataKey="intensity" stroke="#22d3ee" strokeWidth={2} fill="url(#colorInt)" isAnimationActive={false} />
                  </AreaChart>
               </ResponsiveContainer>
           </div>

           {/* Theoretical Diffraction Pattern */}
           <div className="h-40 bg-[#0B1221]/90 backdrop-blur-md rounded-xl border border-white/10 p-4 shadow-lg">
               <h4 className="text-xs font-bold text-purple-400 mb-2 uppercase tracking-widest flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                  {lang === 'el' ? 'Θεωρητικό Μοτίβο' : 'Theoretical Pattern'}
               </h4>
               <ResponsiveContainer width="100%" height="80%">
                  <LineChart data={diffractionData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="angle" tick={{ fontSize: 8, fill: '#64748b' }} tickFormatter={v => `${v}°`} />
                      <YAxis domain={[0, 1]} hide />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', fontSize: 10 }} formatter={(v: number) => v.toFixed(3)} labelFormatter={l => `θ = ${l}°`} />
                      <Line type="monotone" dataKey="intensity" stroke="#a855f7" strokeWidth={2} dot={false} isAnimationActive={false} />
                  </LineChart>
               </ResponsiveContainer>
           </div>
         </div>
      </div>
    </div>
  );
};
