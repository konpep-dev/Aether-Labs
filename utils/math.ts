import { QuadraticParams, QuadraticStats, GraphPoint } from '../types';
import { translations, Language } from './translations';

// High precision formatting
const formatNumber = (n: number, decimals: number = 4): string => {
  if (Math.abs(n) < 1e-10) return '0';
  if (Math.abs(n) >= 1e6 || (Math.abs(n) < 0.0001 && n !== 0)) {
    return n.toExponential(decimals);
  }
  return n.toFixed(decimals).replace(/\.?0+$/, '');
};

export const calculateStats = ({ a, b, c }: QuadraticParams, lang: Language = 'el'): QuadraticStats => {
  const t = translations[lang].quadratic.solution;
  const discriminant = b * b - 4 * a * c;
  let roots: string[] = [];
  let vertex = null;
  let axisOfSymmetry = null;
  let focusPoint = null;
  let directrix = null;
  let areaUnderCurve = null;

  // Derivative: f'(x) = 2ax + b
  const derivative = { a: 2 * a, b: b };
  // Second derivative: f''(x) = 2a
  const secondDerivative = 2 * a;
  // Concavity
  const concavity: 'up' | 'down' | 'linear' = Math.abs(a) < 0.0001 ? 'linear' : (a > 0 ? 'up' : 'down');

  // Handle a = 0 (Linear equation bx + c = 0)
  if (Math.abs(a) < 0.0001) {
    if (Math.abs(b) > 0.0001) {
      roots = [`x = ${formatNumber(-c / b)}`];
    } else {
      roots = c === 0 ? [t.identity] : [t.impossible];
    }
  } else {
    // Vertex calculation (h, k)
    const h = -b / (2 * a);
    const k = c - (b * b) / (4 * a);
    vertex = { x: h, y: k };
    axisOfSymmetry = h;

    // Focus and Directrix for parabola y = ax² + bx + c
    // Standard form: (x - h)² = 4p(y - k) where p = 1/(4a)
    const p = 1 / (4 * a);
    focusPoint = { x: h, y: k + p };
    directrix = k - p;

    // Calculate area under curve between roots (if real roots exist)
    if (discriminant >= 0) {
      const x1 = (-b - Math.sqrt(discriminant)) / (2 * a);
      const x2 = (-b + Math.sqrt(discriminant)) / (2 * a);
      // Integral of ax² + bx + c from x1 to x2
      // = [ax³/3 + bx²/2 + cx] from x1 to x2
      const integral = (x: number) => (a * x * x * x / 3) + (b * x * x / 2) + (c * x);
      const area = Math.abs(integral(x2) - integral(x1));
      areaUnderCurve = { from: x1, to: x2, value: area };
    }

    // Roots calculation with higher precision
    if (discriminant > 1e-10) {
      const sqrtD = Math.sqrt(discriminant);
      const x1 = (-b + sqrtD) / (2 * a);
      const x2 = (-b - sqrtD) / (2 * a);
      roots = [`x₁ = ${formatNumber(x1)}`, `x₂ = ${formatNumber(x2)}`];
    } else if (Math.abs(discriminant) <= 1e-10) {
      const x = -b / (2 * a);
      roots = [`x = ${formatNumber(x)} (${t.double})`];
    } else {
      const realPart = -b / (2 * a);
      const imagPart = Math.sqrt(Math.abs(discriminant)) / (2 * Math.abs(a));
      
      const rText = Math.abs(realPart) < 1e-10 ? "0" : formatNumber(realPart);
      const iText = formatNumber(imagPart);

      roots = [
        `x₁ = ${rText} + ${iText}i`,
        `x₂ = ${rText} - ${iText}i`
      ];
    }
  }

  return {
    discriminant,
    roots,
    vertex,
    axisOfSymmetry,
    yIntercept: c,
    derivative,
    secondDerivative,
    concavity,
    areaUnderCurve,
    tangentAtVertex: 0, // Always 0 at vertex
    focusPoint,
    directrix
  };
};

export const generateDataPoints = ({ a, b, c }: QuadraticParams, rangeX: number = 15): GraphPoint[] => {
  const points: GraphPoint[] = [];
  
  // Center graph on vertex if a != 0, otherwise center on 0
  let centerX = 0;
  if (Math.abs(a) > 0.001) {
    centerX = -b / (2 * a);
  }

  // Clamping
  if (centerX < -100) centerX = -100;
  if (centerX > 100) centerX = 100;

  const start = centerX - rangeX;
  const end = centerX + rangeX;
  const steps = 100; 

  for (let i = 0; i <= steps; i++) {
    const x = start + (i / steps) * (end - start);
    const y = a * x * x + b * x + c;
    points.push({ x: Number(x.toFixed(2)), y: Number(y.toFixed(2)) });
  }

  return points;
};

export const generateComparisonData = (current: QuadraticParams, snapshot: QuadraticParams) => {
  // Determine a viewing window that covers both vertices
  const getVertexX = (p: QuadraticParams) => (Math.abs(p.a) > 0.001 ? -p.b / (2 * p.a) : 0);
  const v1 = getVertexX(current);
  const v2 = getVertexX(snapshot);

  // Center the view between the two vertices
  const center = (v1 + v2) / 2;
  // Make sure the range covers both, plus some padding
  const dist = Math.abs(v1 - v2);
  const range = Math.max(dist + 10, 20); // Minimum range of 20

  const start = center - range / 2;
  const end = center + range / 2;
  const steps = 60; // Slightly lower resolution for the mini chart is fine

  const points = [];
  for (let i = 0; i <= steps; i++) {
    const x = start + (i / steps) * (end - start);
    
    const yCurrent = current.a * x * x + current.b * x + current.c;
    const ySnapshot = snapshot.a * x * x + snapshot.b * x + snapshot.c;

    points.push({
      x: Number(x.toFixed(2)),
      yCurrent: Number(yCurrent.toFixed(2)),
      ySnapshot: Number(ySnapshot.toFixed(2)),
    });
  }
  return points;
};