import React, { useState, useMemo, useEffect, useRef } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { calculateReentryProfile, ReentryParams, ReentryStep } from '../utils/reentry';

const ControlKnob: React.FC<{
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (val: number) => void;
  color: string;
}> = ({ label, value, min, max, step, unit, onChange, color }) => (
  <div className="bg-[#0B1221]/60 p-4 rounded-xl border border-white/10 relative overflow-hidden group">
    <div className={`absolute top-0 left-0 w-1 h-full bg-${color}-500 opacity-50`}></div>
    <div className="flex justify-between items-start mb-2">
      <span className="text-xs uppercase tracking-widest text-slate-400 font-bold">{label}</span>
      <span className={`text-lg font-mono font-bold text-${color}-400`}>
        {value}<span className="text-xs text-slate-500 ml-1">{unit}</span>
      </span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className="w-full relative z-10"
    />
    <div className="flex justify-between text-[10px] text-slate-600 font-mono mt-1">
      <span>{min}</span>
      <span>{max}</span>
    </div>
  </div>
);

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  let color = 'bg-slate-600';
  let text = 'text-white';
  
  if (status === 'Space') { color = 'bg-slate-800'; text='text-slate-300'; }
  if (status === 'Reentry') { color = 'bg-orange-900/50'; text='text-orange-400'; }
  if (status === 'Plasma') { color = 'bg-red-900/50'; text='text-red-500 animate-pulse'; }
  if (status === 'Subsonic') { color = 'bg-blue-900/50'; text='text-blue-400'; }
  if (status === 'Landed') { color = 'bg-emerald-900/50'; text='text-emerald-400'; }
  if (status === 'Crashed') { color = 'bg-red-600'; text='text-white font-bold'; }
  if (status === 'Burned') { color = 'bg-orange-600'; text='text-white font-bold'; }

  return (
    <span className={`px-3 py-1 rounded text-xs font-mono uppercase tracking-wider border border-white/5 ${color} ${text}`}>
      {status}
    </span>
  );
};

export const ReentrySimulator: React.FC = () => {
  const [params, setParams] = useState<ReentryParams>({
    entryAngle: 2, // Shallow
    initialVelocity: 7500, // Orbital speed
    dragCoefficient: 1.2, // Blunt body
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const data = useMemo(() => calculateReentryProfile(params), [params]);
  const finalState = data[data.length - 1];

  // Canvas Animation for Visualizer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Atmosphere Layers
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#020617'); // Space
    gradient.addColorStop(0.3, '#172554'); // Mesosphere
    gradient.addColorStop(0.6, '#1e3a8a'); // Stratosphere
    gradient.addColorStop(1, '#38bdf8'); // Troposphere (Sky blue)
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Trajectory Path
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 2;
    
    data.forEach((point, index) => {
      // Map Altitude (100km -> 0km) to Y (0 -> height)
      // Map Time/Distance to X
      const x = (index / data.length) * canvas.width;
      const y = canvas.height - (point.altitude / 100000) * canvas.height;
      
      if (index === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Draw Plasma/Heat points
    data.forEach((point, index) => {
        if (point.temperature > 1000) {
             const x = (index / data.length) * canvas.width;
             const y = canvas.height - (point.altitude / 100000) * canvas.height;
             const intensity = Math.min(1, (point.temperature - 1000) / 2000);
             
             ctx.beginPath();
             ctx.fillStyle = `rgba(255, 69, 0, ${intensity})`;
             ctx.arc(x, y, 2 + intensity * 4, 0, Math.PI * 2);
             ctx.fill();
        }
    });

  }, [data]);

  const maxTemp = Math.max(...data.map(d => d.temperature));
  const maxG = Math.max(...data.map(d => d.gForce));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
      {/* Sidebar Controls */}
      <div className="lg:col-span-3 flex flex-col gap-4">
        <div className="bg-[#0B1221]/80 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-xl">
           <h3 className="text-sm font-bold text-white mb-6 uppercase tracking-widest border-b border-white/10 pb-2 flex items-center gap-2">
             <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
             Flight Controls
           </h3>
           
           <div className="space-y-6">
             <ControlKnob 
               label="Entry Angle"
               value={params.entryAngle}
               min={0.5} max={10} step={0.1} unit="°"
               onChange={(v) => setParams(p => ({...p, entryAngle: v}))}
               color="blue"
             />
             <ControlKnob 
               label="Initial Velocity"
               value={params.initialVelocity}
               min={1000} max={11000} step={100} unit="m/s"
               onChange={(v) => setParams(p => ({...p, initialVelocity: v}))}
               color="cyan"
             />
             <ControlKnob 
               label="Shield Drag Coeff"
               value={params.dragCoefficient}
               min={0.1} max={3.0} step={0.1} unit="Cd"
               onChange={(v) => setParams(p => ({...p, dragCoefficient: v}))}
               color="emerald"
             />
           </div>
        </div>

        {/* Mission Report Card */}
        <div className="bg-[#0B1221]/80 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-xl flex-1">
            <h3 className="text-sm font-bold text-slate-400 mb-4 uppercase tracking-widest">Post-Flight Analysis</h3>
            <div className="space-y-4 font-mono text-sm">
                <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-slate-500">Outcome</span>
                    <StatusBadge status={finalState.status} />
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-slate-500">Max Temp</span>
                    <span className={maxTemp > 2500 ? "text-red-500 font-bold" : "text-orange-400"}>
                        {maxTemp}°C
                    </span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-slate-500">Peak G-Force</span>
                    <span className={maxG > 10 ? "text-red-500 font-bold" : "text-white"}>
                        {maxG}g
                    </span>
                </div>
                <div className="flex justify-between">
                    <span className="text-slate-500">Impact Vel</span>
                    <span className={finalState.velocity > 100 ? "text-red-500" : "text-emerald-400"}>
                        {finalState.velocity} m/s
                    </span>
                </div>
            </div>
        </div>
      </div>

      {/* Main Display Area */}
      <div className="lg:col-span-9 flex flex-col gap-6">
        {/* Visualizer Canvas */}
        <div className="h-64 bg-black rounded-2xl border border-white/10 relative overflow-hidden">
            <canvas ref={canvasRef} width={800} height={256} className="w-full h-full object-cover" />
            <div className="absolute top-4 right-4 text-right">
                <div className="text-[10px] uppercase text-slate-500 tracking-widest">Real-time Telemetry</div>
                <div className="text-2xl font-mono text-white font-bold">{data.length > 0 ? data[Math.floor(data.length/2)].velocity : 0} <span className="text-xs text-cyan-500">MACH</span></div>
            </div>
            {/* Atmosphere Labels */}
            <div className="absolute left-4 top-4 text-[10px] text-slate-600 uppercase">Space (100km)</div>
            <div className="absolute left-4 bottom-4 text-[10px] text-cyan-800 uppercase">Surface (0km)</div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-80">
            {/* Altitude & Velocity Chart */}
            <div className="bg-[#0B1221]/90 backdrop-blur rounded-2xl border border-white/10 p-4 shadow-lg">
                <h4 className="text-xs font-bold text-cyan-400 mb-2 uppercase tracking-widest">Trajectory Profile</h4>
                <ResponsiveContainer width="100%" height="90%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorAlt" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                        <XAxis dataKey="time" hide />
                        <YAxis stroke="#475569" tick={{fontSize: 10}} width={30} />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }}
                            itemStyle={{ fontSize: 12 }}
                            labelStyle={{ display: 'none' }}
                        />
                        <Area type="monotone" dataKey="altitude" stroke="#06b6d4" fillOpacity={1} fill="url(#colorAlt)" name="Alt (m)" />
                        <Area type="monotone" dataKey="velocity" stroke="#3b82f6" fill="transparent" strokeDasharray="3 3" name="Vel (m/s)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* Thermal & G-Force Chart */}
            <div className="bg-[#0B1221]/90 backdrop-blur rounded-2xl border border-white/10 p-4 shadow-lg">
                <h4 className="text-xs font-bold text-orange-400 mb-2 uppercase tracking-widest">Thermal & Stress Load</h4>
                <ResponsiveContainer width="100%" height="90%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                        <XAxis dataKey="time" hide />
                        <YAxis yAxisId="left" stroke="#475569" tick={{fontSize: 10}} width={30} />
                        <YAxis yAxisId="right" orientation="right" stroke="#475569" tick={{fontSize: 10}} width={30} />
                        <Tooltip 
                             contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }}
                             itemStyle={{ fontSize: 12 }}
                             labelStyle={{ display: 'none' }}
                        />
                        <ReferenceLine yAxisId="left" y={1400} label={{ position: 'insideTopLeft', value: 'Plasma', fill: '#ef4444', fontSize: 10 }} stroke="#ef4444" strokeDasharray="3 3" />
                        <Area yAxisId="left" type="monotone" dataKey="temperature" stroke="#f97316" fillOpacity={1} fill="url(#colorTemp)" name="Temp (°C)" />
                        <Area yAxisId="right" type="monotone" dataKey="gForce" stroke="#a855f7" strokeWidth={2} fill="transparent" name="G-Force" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
      </div>
    </div>
  );
};