export interface QuadraticParams {
  a: number;
  b: number;
  c: number;
}

export interface QuadraticStats {
  discriminant: number;
  roots: string[];
  vertex: { x: number; y: number } | null;
  axisOfSymmetry: number | null;
  yIntercept: number;
  // New advanced stats
  derivative: { a: number; b: number }; // f'(x) = 2ax + b
  secondDerivative: number; // f''(x) = 2a
  concavity: 'up' | 'down' | 'linear';
  areaUnderCurve: { from: number; to: number; value: number } | null;
  tangentAtVertex: number; // slope at vertex (always 0 for parabola)
  focusPoint: { x: number; y: number } | null;
  directrix: number | null;
}

export interface GraphPoint {
  x: number;
  y: number;
}