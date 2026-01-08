import React, { useState, useEffect, useRef } from 'react';

interface FPSCounterProps {
  show: boolean;
}

export const FPSCounter: React.FC<FPSCounterProps> = ({ show }) => {
  const [fps, setFps] = useState(0);
  const [avgFps, setAvgFps] = useState(0);
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());
  const fpsHistory = useRef<number[]>([]);

  useEffect(() => {
    if (!show) return;

    let animationId: number;

    const measureFPS = () => {
      frameCount.current++;
      const currentTime = performance.now();
      const elapsed = currentTime - lastTime.current;

      if (elapsed >= 1000) {
        const currentFps = Math.round((frameCount.current * 1000) / elapsed);
        setFps(currentFps);
        
        // Keep history for average
        fpsHistory.current.push(currentFps);
        if (fpsHistory.current.length > 60) {
          fpsHistory.current.shift();
        }
        
        const avg = Math.round(
          fpsHistory.current.reduce((a, b) => a + b, 0) / fpsHistory.current.length
        );
        setAvgFps(avg);

        frameCount.current = 0;
        lastTime.current = currentTime;
      }

      animationId = requestAnimationFrame(measureFPS);
    };

    animationId = requestAnimationFrame(measureFPS);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [show]);

  if (!show) return null;

  const getFpsColor = () => {
    if (fps >= 55) return 'text-emerald-400';
    if (fps >= 30) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="fixed bottom-4 right-4 z-[90] bg-black/80 backdrop-blur-sm rounded-lg border border-white/10 px-3 py-2 font-mono text-xs shadow-lg">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span className="text-slate-500">FPS:</span>
          <span className={`font-bold ${getFpsColor()}`}>{fps}</span>
        </div>
        <div className="w-px h-4 bg-white/10"></div>
        <div className="flex items-center gap-1.5">
          <span className="text-slate-500">AVG:</span>
          <span className="text-slate-300">{avgFps}</span>
        </div>
      </div>
    </div>
  );
};
