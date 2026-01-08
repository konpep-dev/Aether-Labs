import React, { useRef, useEffect, useState, useCallback } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { translations, Language } from '../utils/translations';

// --- 3D TYPES ---
interface Vector3 { x: number; y: number; z: number; }

interface Body3D {
  id: number;
  pos: Vector3;
  vel: Vector3;
  mass: number;
  radius: number;
  color: string;
  trail: Vector3[];
  type: 'star' | 'planet' | 'moon' | 'asteroid';
  temperature?: number;
  rotationSpeed?: number;
}

interface Camera {
  pos: Vector3;
  yaw: number;
  pitch: number;
  fov: number;
}

interface SystemHistory {
  time: number;
  kinetic: number;
  potential: number;
  totalEnergy: number;
}

interface LaunchConfig {
  mass: number;
  radius: number;
  speed: number;
  color: string;
  type: Body3D['type'];
}

// Star textures/colors based on temperature
const STAR_COLORS = {
  hot: ['#aaccff', '#ffffff', '#ffffcc'],
  medium: ['#ffcc66', '#ffaa33', '#ff8800'],
  cool: ['#ff6644', '#ff4422', '#cc2200']
};

// --- UI COMPONENTS ---
const ControlButton: React.FC<{
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  danger?: boolean;
}> = ({ onClick, icon, label, active = false, danger = false }) => (
  <button 
    onClick={onClick}
    className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg border transition-all uppercase text-xs font-bold tracking-wider w-full
    ${danger 
        ? 'bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20' 
        : active 
            ? 'bg-purple-500/20 border-purple-500 text-purple-400' 
            : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white'
    }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

const ControlSwitch: React.FC<{
  label: string;
  checked: boolean;
  onChange: (val: boolean) => void;
}> = ({ label, checked, onChange }) => (
  <div className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
    <span className="text-xs uppercase text-slate-400 font-bold tracking-wider">{label}</span>
    <button 
      onClick={() => onChange(!checked)}
      className={`w-10 h-5 rounded-full relative transition-colors ${checked ? 'bg-cyan-500' : 'bg-slate-700'}`}
    >
      <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-transform ${checked ? 'left-6' : 'left-1'}`}></div>
    </button>
  </div>
);

const RangeSlider: React.FC<{
  label: string;
  value: number;
  min: number; max: number; step: number;
  onChange: (val: number) => void;
  unit?: string;
}> = ({ label, value, min, max, step, onChange, unit }) => (
  <div className="space-y-1">
    <div className="flex justify-between text-xs font-bold text-slate-400">
      <span>{label}</span>
      <span className="text-cyan-400 font-mono">{value}{unit}</span>
    </div>
    <input type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(parseFloat(e.target.value))} className="w-full" />
  </div>
);

// --- MAIN COMPONENT ---
export const GravitySandbox: React.FC<{ lang: Language }> = ({ lang }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const offscreenRef = useRef<HTMLCanvasElement | null>(null);
  
  // Refs for performance
  const bodiesRef = useRef<Body3D[]>([]);
  const cameraRef = useRef<Camera>({ pos: {x:0, y:400, z:-1500}, yaw: 0, pitch: 0.25, fov: 800 });
  const keysRef = useRef<Set<string>>(new Set());
  const mouseRef = useRef<{x: number, y: number} | null>(null);
  const isFocusedRef = useRef(false);
  const starsRef = useRef<{x: number, y: number, z: number, brightness: number}[]>([]);
  
  // UI State
  const [uiBodies, setUiBodies] = useState<Body3D[]>([]);
  const [history, setHistory] = useState<SystemHistory[]>([]);
  
  // Params
  const [gConstant, setGConstant] = useState(0.8);
  const [timeSpeed, setTimeSpeed] = useState(1);
  const [camSpeed, setCamSpeed] = useState(10);
  const [paused, setPaused] = useState(false);
  const [selectedBodyId, setSelectedBodyId] = useState<number | null>(null);
  const [showTrails, setShowTrails] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [showStars, setShowStars] = useState(true);
  const [showOrbits, setShowOrbits] = useState(false);
  const [collisionMode, setCollisionMode] = useState<'merge' | 'bounce'>('merge');
  const [renderQuality, setRenderQuality] = useState<'low' | 'medium' | 'high'>('medium');
  
  const [launchConfig, setLaunchConfig] = useState<LaunchConfig>({
    mass: 50, radius: 12, speed: 8, color: '#06b6d4', type: 'planet'
  });

  const frameRef = useRef(0);
  const trailsRef = useRef<Map<number, Vector3[]>>(new Map());

  const safeLang = translations[lang] ? lang : 'en';
  const t = translations[safeLang].gravity;

  // Generate background stars
  useEffect(() => {
    const stars: typeof starsRef.current = [];
    for (let i = 0; i < 500; i++) {
      stars.push({
        x: (Math.random() - 0.5) * 10000,
        y: (Math.random() - 0.5) * 10000,
        z: (Math.random() - 0.5) * 10000,
        brightness: Math.random() * 0.8 + 0.2
      });
    }
    starsRef.current = stars;
  }, []);

  // Init
  useEffect(() => {
    resetSimulation();
    const down = (e: KeyboardEvent) => { 
      if(isFocusedRef.current) {
        if(['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) e.preventDefault();
        keysRef.current.add(e.code);
      }
    };
    const up = (e: KeyboardEvent) => keysRef.current.delete(e.code);
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, []);

  const resetSimulation = () => {
    const initialBodies: Body3D[] = [
      { id: 1, pos: {x:0, y:0, z:0}, vel: {x:0, y:0, z:0}, mass: 5000, radius: 50, color: '#fbbf24', trail: [], type: 'star', temperature: 5500, rotationSpeed: 0.01 },
      { id: 2, pos: {x:300, y:0, z:0}, vel: {x:0, y:0, z:3.2}, mass: 30, radius: 8, color: '#94a3b8', trail: [], type: 'planet', rotationSpeed: 0.05 },
      { id: 3, pos: {x:500, y:0, z:0}, vel: {x:0, y:0, z:2.5}, mass: 80, radius: 14, color: '#3b82f6', trail: [], type: 'planet', rotationSpeed: 0.03 },
      { id: 4, pos: {x:-700, y:50, z:0}, vel: {x:0, y:0, z:-2.0}, mass: 150, radius: 20, color: '#f97316', trail: [], type: 'planet', rotationSpeed: 0.02 },
      { id: 5, pos: {x:530, y:0, z:0}, vel: {x:0, y:0, z:3.8}, mass: 5, radius: 4, color: '#a1a1aa', trail: [], type: 'moon', rotationSpeed: 0.1 },
    ];
    bodiesRef.current = initialBodies;
    setUiBodies(initialBodies);
    setHistory([]);
    trailsRef.current.clear();
    cameraRef.current = { pos: {x:0, y:400, z:-1500}, yaw: 0, pitch: 0.25, fov: 800 };
    frameRef.current = 0;
    setSelectedBodyId(null);
  };

  // Presets
  const loadPreset = (preset: string) => {
    let bodies: Body3D[] = [];
    if (preset === 'solar') {
      bodies = [
        { id: 1, pos: {x:0, y:0, z:0}, vel: {x:0, y:0, z:0}, mass: 8000, radius: 60, color: '#fbbf24', trail: [], type: 'star', temperature: 5778 },
        { id: 2, pos: {x:200, y:0, z:0}, vel: {x:0, y:0, z:4.5}, mass: 10, radius: 5, color: '#9ca3af', trail: [], type: 'planet' },
        { id: 3, pos: {x:350, y:0, z:0}, vel: {x:0, y:0, z:3.5}, mass: 25, radius: 8, color: '#fcd34d', trail: [], type: 'planet' },
        { id: 4, pos: {x:500, y:0, z:0}, vel: {x:0, y:0, z:2.8}, mass: 40, radius: 12, color: '#3b82f6', trail: [], type: 'planet' },
        { id: 5, pos: {x:700, y:0, z:0}, vel: {x:0, y:0, z:2.3}, mass: 35, radius: 10, color: '#ef4444', trail: [], type: 'planet' },
      ];
    } else if (preset === 'binary') {
      bodies = [
        { id: 1, pos: {x:-150, y:0, z:0}, vel: {x:0, y:0, z:1.5}, mass: 3000, radius: 40, color: '#fbbf24', trail: [], type: 'star', temperature: 6000 },
        { id: 2, pos: {x:150, y:0, z:0}, vel: {x:0, y:0, z:-1.5}, mass: 3000, radius: 35, color: '#f97316', trail: [], type: 'star', temperature: 4500 },
        { id: 3, pos: {x:600, y:0, z:0}, vel: {x:0, y:0, z:2.8}, mass: 50, radius: 10, color: '#06b6d4', trail: [], type: 'planet' },
      ];
    } else if (preset === 'chaos') {
      bodies = Array.from({length: 15}, (_, i) => ({
        id: i + 1,
        pos: { x: (Math.random() - 0.5) * 800, y: (Math.random() - 0.5) * 400, z: (Math.random() - 0.5) * 800 },
        vel: { x: (Math.random() - 0.5) * 2, y: (Math.random() - 0.5) * 2, z: (Math.random() - 0.5) * 2 },
        mass: Math.random() * 200 + 20,
        radius: Math.random() * 15 + 5,
        color: `hsl(${Math.random() * 360}, 70%, 60%)`,
        trail: [],
        type: 'asteroid' as const
      }));
    }
    bodiesRef.current = bodies;
    setUiBodies(bodies);
    trailsRef.current.clear();
    setHistory([]);
  };

  // Input handlers
  const handleMouseMove = (e: React.MouseEvent) => {
    if (e.buttons === 1) { 
      const cam = cameraRef.current;
      cam.yaw += e.movementX * 0.005;
      cam.pitch = Math.max(-Math.PI/2, Math.min(Math.PI/2, cam.pitch + e.movementY * 0.005));
    }
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    const cam = cameraRef.current;
    cam.fov = Math.max(400, Math.min(1500, cam.fov + e.deltaY * 0.5));
  };

  const handleClick = (e: React.MouseEvent) => {
    isFocusedRef.current = true;
    if (e.button === 0) selectBodyAtMouse();
    if (e.button === 2) { e.preventDefault(); shootBody(); }
  };

  const shootBody = () => {
    const cam = cameraRef.current;
    const forward = {
      x: Math.sin(cam.yaw) * Math.cos(cam.pitch),
      y: Math.sin(cam.pitch),
      z: Math.cos(cam.yaw) * Math.cos(cam.pitch)
    };
    const newBody: Body3D = {
      id: Date.now(),
      pos: { ...cam.pos },
      vel: { x: forward.x * launchConfig.speed, y: forward.y * launchConfig.speed, z: forward.z * launchConfig.speed },
      mass: launchConfig.mass,
      radius: launchConfig.radius,
      color: launchConfig.color,
      trail: [],
      type: launchConfig.type,
      rotationSpeed: 0.05
    };
    bodiesRef.current.push(newBody);
    setUiBodies([...bodiesRef.current]);
  };

  const selectBodyAtMouse = () => {
    if(!mouseRef.current || !canvasRef.current) return;
    const width = canvasRef.current.width;
    const height = canvasRef.current.height;
    const cx = width / 2;
    const cy = height / 2;
    const cam = cameraRef.current;
    let closestId: number | null = null;
    let closestZ = Infinity;

    bodiesRef.current.forEach(b => {
      let x = b.pos.x - cam.pos.x, y = b.pos.y - cam.pos.y, z = b.pos.z - cam.pos.z;
      const cosY = Math.cos(cam.yaw), sinY = Math.sin(cam.yaw);
      const x2 = x * cosY - z * sinY, z2 = z * cosY + x * sinY;
      const cosP = Math.cos(cam.pitch), sinP = Math.sin(cam.pitch);
      const y2 = y * cosP - z2 * sinP, z3 = z2 * cosP + y * sinP;
      if (z3 > 0) {
        const scale = cam.fov / z3;
        const screenX = cx + x2 * scale, screenY = cy + y2 * scale;
        const radius = Math.max(5, b.radius * scale);
        const dx = screenX - mouseRef.current!.x, dy = screenY - mouseRef.current!.y;
        if (Math.sqrt(dx*dx + dy*dy) < radius + 10 && z3 < closestZ) {
          closestZ = z3; closestId = b.id;
        }
      }
    });
    setSelectedBodyId(closestId);
  };

  const deleteSelected = () => {
    if(selectedBodyId) {
      bodiesRef.current = bodiesRef.current.filter(b => b.id !== selectedBodyId);
      setUiBodies([...bodiesRef.current]);
      setSelectedBodyId(null);
    }
  };

  // --- RENDER LOOP ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    if (wrapperRef.current) {
      canvas.width = wrapperRef.current.clientWidth;
      canvas.height = 650;
    }

    const width = canvas.width;
    const height = canvas.height;
    const cx = width / 2;
    const cy = height / 2;

    let animationId: number;

    const project = (p: Vector3, cam: Camera) => {
      let x = p.x - cam.pos.x, y = p.y - cam.pos.y, z = p.z - cam.pos.z;
      const cosY = Math.cos(cam.yaw), sinY = Math.sin(cam.yaw);
      const x2 = x * cosY - z * sinY, z2 = z * cosY + x * sinY;
      const cosP = Math.cos(cam.pitch), sinP = Math.sin(cam.pitch);
      const y2 = y * cosP - z2 * sinP, z3 = z2 * cosP + y * sinP;
      if (z3 <= 0) return null;
      const scale = cam.fov / z3;
      return { x: cx + x2 * scale, y: cy + y2 * scale, scale, depth: z3 };
    };

    const loop = () => {
      const cam = cameraRef.current;
      
      // Camera movement
      let camMove = { x: 0, y: 0, z: 0 };
      const speed = camSpeed * 2;
      const cosY = Math.cos(cam.yaw), sinY = Math.sin(cam.yaw);
      const k = keysRef.current;
      if (k.has('KeyW')) { camMove.z += cosY; camMove.x += sinY; }
      if (k.has('KeyS')) { camMove.z -= cosY; camMove.x -= sinY; }
      if (k.has('KeyA')) { camMove.z += sinY; camMove.x -= cosY; }
      if (k.has('KeyD')) { camMove.z -= sinY; camMove.x += cosY; }
      if (k.has('Space')) camMove.y -= 1;
      if (k.has('ShiftLeft')) camMove.y += 1;
      cam.pos.x += camMove.x * speed;
      cam.pos.y += camMove.y * speed;
      cam.pos.z += camMove.z * speed;

      // Physics
      let activeBodies = bodiesRef.current;
      if (!paused) {
        const dt = timeSpeed / 2;
        
        // Forces
        for (let i = 0; i < activeBodies.length; i++) {
          let fx = 0, fy = 0, fz = 0;
          const b1 = activeBodies[i];
          for (let j = 0; j < activeBodies.length; j++) {
            if (i === j) continue;
            const b2 = activeBodies[j];
            const dx = b2.pos.x - b1.pos.x, dy = b2.pos.y - b1.pos.y, dz = b2.pos.z - b1.pos.z;
            const distSq = dx*dx + dy*dy + dz*dz;
            const dist = Math.sqrt(distSq);
            const force = (gConstant * b1.mass * b2.mass) / (distSq + 100);
            fx += (force * dx) / dist;
            fy += (force * dy) / dist;
            fz += (force * dz) / dist;
          }
          b1.vel.x += (fx / b1.mass) * dt;
          b1.vel.y += (fy / b1.mass) * dt;
          b1.vel.z += (fz / b1.mass) * dt;
        }

        // Move & Collisions
        const bodiesToRemove = new Set<number>();
        const newBodies: Body3D[] = [];

        for (let i = 0; i < activeBodies.length; i++) {
          if (bodiesToRemove.has(activeBodies[i].id)) continue;
          const b1 = activeBodies[i];
          b1.pos.x += b1.vel.x * dt;
          b1.pos.y += b1.vel.y * dt;
          b1.pos.z += b1.vel.z * dt;

          if (showTrails && frameRef.current % 3 === 0) {
            const t = trailsRef.current.get(b1.id) || [];
            t.push({ ...b1.pos });
            if (t.length > 80) t.shift();
            trailsRef.current.set(b1.id, t);
          }

          for (let j = i + 1; j < activeBodies.length; j++) {
            if (bodiesToRemove.has(activeBodies[j].id)) continue;
            const b2 = activeBodies[j];
            const dx = b2.pos.x - b1.pos.x, dy = b2.pos.y - b1.pos.y, dz = b2.pos.z - b1.pos.z;
            const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);

            if (dist < (b1.radius + b2.radius) * 0.85) {
              if (collisionMode === 'merge') {
                const totalMass = b1.mass + b2.mass;
                const merged: Body3D = {
                  id: Date.now() + Math.random(),
                  pos: { x: (b1.pos.x * b1.mass + b2.pos.x * b2.mass) / totalMass, y: (b1.pos.y * b1.mass + b2.pos.y * b2.mass) / totalMass, z: (b1.pos.z * b1.mass + b2.pos.z * b2.mass) / totalMass },
                  vel: { x: (b1.vel.x * b1.mass + b2.vel.x * b2.mass) / totalMass, y: (b1.vel.y * b1.mass + b2.vel.y * b2.mass) / totalMass, z: (b1.vel.z * b1.mass + b2.vel.z * b2.mass) / totalMass },
                  mass: totalMass,
                  radius: Math.pow(totalMass, 1/3) * 2.5,
                  color: b1.mass > b2.mass ? b1.color : b2.color,
                  trail: [],
                  type: totalMass > 2000 ? 'star' : b1.mass > b2.mass ? b1.type : b2.type,
                  temperature: totalMass > 2000 ? 5000 : undefined
                };
                bodiesToRemove.add(b1.id); bodiesToRemove.add(b2.id);
                newBodies.push(merged);
              } else {
                const temp = {...b1.vel}; b1.vel = b2.vel; b2.vel = temp;
                const overlap = (b1.radius + b2.radius) - dist;
                b1.pos.x -= dx/dist * overlap * 0.5;
                b1.pos.y -= dy/dist * overlap * 0.5;
                b1.pos.z -= dz/dist * overlap * 0.5;
              }
            }
          }
        }

        if (bodiesToRemove.size > 0) {
          bodiesRef.current = activeBodies.filter(b => !bodiesToRemove.has(b.id)).concat(newBodies);
          setUiBodies([...bodiesRef.current]);
        }

        if (frameRef.current % 15 === 0) {
          let ke = 0;
          activeBodies.forEach(b => {
            const v = Math.sqrt(b.vel.x**2 + b.vel.y**2 + b.vel.z**2);
            ke += 0.5 * b.mass * v*v;
          });
          setHistory(prev => [...prev, { time: frameRef.current, kinetic: ke, potential: 0, totalEnergy: ke }].slice(-50));
        }
        frameRef.current++;
      }

      // --- RENDER ---
      // Background gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, '#020617');
      bgGrad.addColorStop(0.5, '#0a0f1a');
      bgGrad.addColorStop(1, '#020617');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Stars
      if (showStars) {
        starsRef.current.forEach(star => {
          const proj = project(star, cam);
          if (proj && proj.depth > 0) {
            const size = Math.max(0.5, 2 * proj.scale * star.brightness);
            ctx.fillStyle = `rgba(255, 255, 255, ${star.brightness * 0.6})`;
            ctx.beginPath();
            ctx.arc(proj.x, proj.y, size, 0, Math.PI * 2);
            ctx.fill();
          }
        });
      }

      // Grid
      if (showGrid) {
        ctx.strokeStyle = 'rgba(30, 41, 59, 0.5)';
        ctx.lineWidth = 1;
        const gridSize = 3000, step = 400, floorY = 400;
        ctx.beginPath();
        for(let x = -gridSize; x <= gridSize; x += step) {
          const p1 = project({x, y: floorY, z: -gridSize}, cam);
          const p2 = project({x, y: floorY, z: gridSize}, cam);
          if(p1 && p2) { ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); }
        }
        for(let z = -gridSize; z <= gridSize; z += step) {
          const p1 = project({x: -gridSize, y: floorY, z}, cam);
          const p2 = project({x: gridSize, y: floorY, z}, cam);
          if(p1 && p2) { ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); }
        }
        ctx.stroke();
      }

      // Render bodies
      const renderList = bodiesRef.current.map(b => {
        const proj = project(b.pos, cam);
        return { body: b, proj };
      }).filter(item => item.proj !== null).sort((a, b) => (b.proj?.depth || 0) - (a.proj?.depth || 0));

      renderList.forEach(({ body, proj }) => {
        if (!proj) return;
        const r = Math.max(2, body.radius * proj.scale);

        // Trails
        if (showTrails) {
          const trail = trailsRef.current.get(body.id);
          if (trail && trail.length > 1) {
            ctx.beginPath();
            ctx.strokeStyle = body.color;
            ctx.lineWidth = Math.max(1, 1.5 * proj.scale);
            let started = false;
            for (let i = 0; i < trail.length; i++) {
              const tProj = project(trail[i], cam);
              if (tProj) {
                ctx.globalAlpha = (i / trail.length) * 0.6;
                if (!started) { ctx.moveTo(tProj.x, tProj.y); started = true; }
                else ctx.lineTo(tProj.x, tProj.y);
              }
            }
            ctx.stroke();
            ctx.globalAlpha = 1.0;
          }
        }

        // Glow effect
        const glowSize = r * (body.type === 'star' ? 5 : 2.5);
        const glowGrad = ctx.createRadialGradient(proj.x, proj.y, r * 0.3, proj.x, proj.y, glowSize);
        glowGrad.addColorStop(0, body.color);
        glowGrad.addColorStop(0.3, body.color + '80');
        glowGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = glowGrad;
        ctx.globalAlpha = body.type === 'star' ? 0.7 : 0.3;
        ctx.beginPath(); ctx.arc(proj.x, proj.y, glowSize, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = 1.0;

        // Corona for stars
        if (body.type === 'star' && renderQuality !== 'low') {
          for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2 + frameRef.current * 0.01;
            const rayLen = r * (1.5 + Math.sin(frameRef.current * 0.05 + i) * 0.5);
            ctx.beginPath();
            ctx.strokeStyle = body.color + '40';
            ctx.lineWidth = 2;
            ctx.moveTo(proj.x, proj.y);
            ctx.lineTo(proj.x + Math.cos(angle) * rayLen, proj.y + Math.sin(angle) * rayLen);
            ctx.stroke();
          }
        }

        // Body sphere with lighting
        const lightDir = { x: -0.5, y: -0.5 };
        const sphereGrad = ctx.createRadialGradient(
          proj.x + lightDir.x * r * 0.4, proj.y + lightDir.y * r * 0.4, r * 0.1,
          proj.x, proj.y, r
        );
        
        if (body.type === 'star') {
          sphereGrad.addColorStop(0, '#ffffff');
          sphereGrad.addColorStop(0.2, body.color);
          sphereGrad.addColorStop(0.8, body.color);
          sphereGrad.addColorStop(1, '#000000');
        } else {
          sphereGrad.addColorStop(0, '#ffffff');
          sphereGrad.addColorStop(0.15, body.color);
          sphereGrad.addColorStop(0.7, body.color);
          sphereGrad.addColorStop(1, '#000000');
        }

        ctx.fillStyle = sphereGrad;
        ctx.beginPath(); ctx.arc(proj.x, proj.y, r, 0, Math.PI * 2); ctx.fill();

        // Atmosphere for planets
        if (body.type === 'planet' && r > 8 && renderQuality === 'high') {
          ctx.strokeStyle = body.color + '30';
          ctx.lineWidth = 2;
          ctx.beginPath(); ctx.arc(proj.x, proj.y, r * 1.15, 0, Math.PI * 2); ctx.stroke();
        }

        // Selection
        if (body.id === selectedBodyId) {
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2;
          ctx.setLineDash([4, 4]);
          ctx.beginPath(); ctx.arc(proj.x, proj.y, r + 8, 0, Math.PI * 2); ctx.stroke();
          ctx.setLineDash([]);
        }
      });

      // HUD Crosshair
      ctx.strokeStyle = 'rgba(255,255,255,0.3)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx - 15, cy); ctx.lineTo(cx - 5, cy);
      ctx.moveTo(cx + 5, cy); ctx.lineTo(cx + 15, cy);
      ctx.moveTo(cx, cy - 15); ctx.lineTo(cx, cy - 5);
      ctx.moveTo(cx, cy + 5); ctx.lineTo(cx, cy + 15);
      ctx.stroke();

      animationId = requestAnimationFrame(loop);
    };

    loop();
    return () => cancelAnimationFrame(animationId);
  }, [gConstant, timeSpeed, paused, showGrid, showTrails, showStars, showOrbits, collisionMode, camSpeed, selectedBodyId, launchConfig, renderQuality]);

  const selectedBody = uiBodies.find(b => b.id === selectedBodyId);

  return (
    <div className="flex flex-col gap-6 pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* LEFT PANEL */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <div className="bg-[#0B1221]/90 backdrop-blur-md p-5 rounded-2xl border border-white/10 shadow-xl max-h-[650px] flex flex-col overflow-y-auto custom-scrollbar">
             
             <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-widest border-b border-white/10 pb-2 flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
                {t.controls.title}
             </h3>

             <div className="grid grid-cols-2 gap-2 mb-4">
                <ControlButton 
                    onClick={() => setPaused(!paused)} 
                    icon={paused ? <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg> : <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>}
                    label={paused ? t.controls.running : t.controls.paused}
                    active={!paused}
                />
                <ControlButton onClick={resetSimulation} icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>} label={t.controls.reset} />
             </div>

             {/* Presets */}
             <div className="mb-4">
               <label className="text-[10px] text-slate-500 uppercase tracking-widest mb-2 block">Presets</label>
               <div className="grid grid-cols-3 gap-1">
                 <button onClick={() => loadPreset('solar')} className="px-2 py-1.5 bg-white/5 hover:bg-white/10 text-[10px] text-slate-400 rounded border border-white/5">Solar</button>
                 <button onClick={() => loadPreset('binary')} className="px-2 py-1.5 bg-white/5 hover:bg-white/10 text-[10px] text-slate-400 rounded border border-white/5">Binary</button>
                 <button onClick={() => loadPreset('chaos')} className="px-2 py-1.5 bg-white/5 hover:bg-white/10 text-[10px] text-slate-400 rounded border border-white/5">Chaos</button>
               </div>
             </div>

             <div className="space-y-3 mb-4">
                <RangeSlider label={t.controls.g_constant} value={gConstant} min={0.1} max={5} step={0.1} onChange={setGConstant} />
                <RangeSlider label={t.controls.time_speed} value={timeSpeed} min={0} max={5} step={0.1} onChange={setTimeSpeed} unit="x" />
                <RangeSlider label={t.controls.cam_speed} value={camSpeed} min={1} max={30} step={1} onChange={setCamSpeed} />
             </div>

             <div className="space-y-1 mb-4">
                <ControlSwitch label={t.controls.show_grid} checked={showGrid} onChange={setShowGrid} />
                <ControlSwitch label="Show Stars" checked={showStars} onChange={setShowStars} />
                <ControlSwitch label="Show Trails" checked={showTrails} onChange={setShowTrails} />
             </div>

             {/* Quality */}
             <div className="mb-4">
               <label className="text-[10px] text-slate-500 uppercase tracking-widest mb-2 block">Render Quality</label>
               <div className="grid grid-cols-3 gap-1">
                 {(['low', 'medium', 'high'] as const).map(q => (
                   <button key={q} onClick={() => setRenderQuality(q)} className={`px-2 py-1.5 text-[10px] rounded border ${renderQuality === q ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400' : 'bg-white/5 border-white/5 text-slate-400'}`}>{q}</button>
                 ))}
               </div>
             </div>

             {/* Launch Settings */}
             <h3 className="text-sm font-bold text-cyan-400 mb-3 uppercase tracking-widest border-b border-white/10 pb-2 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                {t.controls.launch_settings}
             </h3>
             
             <div className="space-y-3 mb-4">
                 <RangeSlider label={t.controls.mass} value={launchConfig.mass} min={10} max={3000} step={10} onChange={v => setLaunchConfig({...launchConfig, mass: v})} unit="kg" />
                 <RangeSlider label={t.controls.radius} value={launchConfig.radius} min={3} max={80} step={1} onChange={v => setLaunchConfig({...launchConfig, radius: v})} unit="m" />
                 <RangeSlider label={t.controls.launch_velocity} value={launchConfig.speed} min={0} max={30} step={0.5} onChange={v => setLaunchConfig({...launchConfig, speed: v})} />
                 
                 <div className="flex gap-2 justify-between">
                    {['#ef4444', '#f59e0b', '#10b981', '#06b6d4', '#8b5cf6', '#ec4899', '#ffffff'].map(c => (
                        <button key={c} onClick={() => setLaunchConfig({...launchConfig, color: c})} className={`w-5 h-5 rounded-full border-2 transition-transform ${launchConfig.color === c ? 'border-white scale-110' : 'border-transparent opacity-70 hover:opacity-100'}`} style={{backgroundColor: c}} />
                    ))}
                 </div>

                 <div className="grid grid-cols-4 gap-1 mt-2">
                   {(['star', 'planet', 'moon', 'asteroid'] as const).map(type => (
                     <button key={type} onClick={() => setLaunchConfig({...launchConfig, type})} className={`px-1 py-1 text-[9px] rounded ${launchConfig.type === type ? 'bg-purple-500/30 text-purple-300' : 'bg-white/5 text-slate-500'}`}>{type}</button>
                   ))}
                 </div>
             </div>

             {/* Inspector */}
             <h3 className="text-sm font-bold text-indigo-400 mb-3 uppercase tracking-widest border-b border-white/10 pb-2">{t.controls.inspector}</h3>
             {selectedBody ? (
                 <div className="bg-white/5 rounded-lg p-3 text-xs font-mono space-y-1.5">
                     <div className="flex justify-between"><span className="text-slate-500">Type</span> <span className="text-purple-400 capitalize">{selectedBody.type}</span></div>
                     <div className="flex justify-between"><span className="text-slate-500">Mass</span> <span className="text-orange-400 font-bold">{selectedBody.mass.toFixed(0)} kg</span></div>
                     <div className="flex justify-between"><span className="text-slate-500">Radius</span> <span className="text-cyan-400">{selectedBody.radius.toFixed(0)} m</span></div>
                     <div className="flex justify-between"><span className="text-slate-500">Velocity</span> <span className="text-emerald-400">{Math.sqrt(selectedBody.vel.x**2 + selectedBody.vel.y**2 + selectedBody.vel.z**2).toFixed(2)}</span></div>
                     <ControlButton onClick={deleteSelected} label={t.controls.delete} icon={<svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>} danger />
                 </div>
             ) : (
                 <p className="text-xs text-slate-600 text-center py-3 italic border border-dashed border-white/10 rounded-lg">{t.controls.no_selection}</p>
             )}
          </div>
        </div>

        {/* CANVAS AREA */}
        <div className="lg:col-span-9 flex flex-col gap-4" ref={wrapperRef}>
          <div className="relative">
            <canvas 
                ref={canvasRef}
                onMouseMove={handleMouseMove}
                onMouseDown={handleClick}
                onWheel={handleWheel}
                onContextMenu={(e) => e.preventDefault()}
                onFocus={() => isFocusedRef.current = true}
                onBlur={() => isFocusedRef.current = false}
                className="w-full h-[650px] bg-[#020617] rounded-2xl border border-white/10 shadow-2xl cursor-crosshair touch-none block focus:outline-none focus:ring-1 focus:ring-purple-500/50"
                tabIndex={0}
            />
            
            {/* HUD Overlay */}
            <div className="absolute top-4 left-4 flex gap-2">
              <div className="bg-black/60 backdrop-blur px-3 py-1.5 rounded-lg border border-white/10 text-[10px] font-mono text-slate-400">
                Bodies: <span className="text-cyan-400">{uiBodies.length}</span>
              </div>
              <div className="bg-black/60 backdrop-blur px-3 py-1.5 rounded-lg border border-white/10 text-[10px] font-mono text-slate-400">
                FOV: <span className="text-purple-400">{cameraRef.current.fov.toFixed(0)}</span>
              </div>
            </div>

            {/* Controls Hint */}
            <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur px-4 py-2 rounded-lg border border-white/10">
              <div className="flex gap-4 text-[10px] text-slate-500">
                <span><kbd className="px-1 bg-white/10 rounded">WASD</kbd> Move</span>
                <span><kbd className="px-1 bg-white/10 rounded">Space/Shift</kbd> Up/Down</span>
                <span><kbd className="px-1 bg-white/10 rounded">Drag</kbd> Look</span>
                <span><kbd className="px-1 bg-white/10 rounded">Right Click</kbd> Shoot</span>
                <span><kbd className="px-1 bg-white/10 rounded">Scroll</kbd> Zoom</span>
              </div>
            </div>
          </div>

          {/* Energy Chart */}
          <div className="h-32 bg-[#0B1221]/90 backdrop-blur-md rounded-xl border border-white/10 p-3">
            <h4 className="text-[10px] font-bold text-purple-400 mb-1 uppercase tracking-widest">System Energy</h4>
            <ResponsiveContainer width="100%" height="85%">
              <AreaChart data={history}>
                <defs>
                  <linearGradient id="colorKE" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" hide />
                <YAxis hide />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
                <Area type="monotone" dataKey="kinetic" stroke="#8b5cf6" fill="url(#colorKE)" isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
