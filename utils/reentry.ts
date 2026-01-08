export interface ReentryParams {
  entryAngle: number; // Degrees
  initialVelocity: number; // m/s (e.g., 7000 for orbital)
  dragCoefficient: number; // Represents aerodynamic profile/shielding (0.5 - 2.0)
}

export interface ReentryStep {
  time: number;
  altitude: number; // meters
  velocity: number; // m/s
  temperature: number; // Celsius (simplified surface temp)
  gForce: number; // Gs
  density: number; // kg/m3
  status: 'Space' | 'Reentry' | 'Plasma' | 'Subsonic' | 'Landed' | 'Crashed' | 'Burned';
}

export const calculateReentryProfile = (params: ReentryParams): ReentryStep[] => {
  const steps: ReentryStep[] = [];
  
  // Constants
  const dt = 0.5; // Time step (seconds)
  const g = 9.81;
  const earthRadius = 6371000;
  const scaleHeight = 8500; // Atmospheric scale height (m)
  const surfaceDensity = 1.225; // kg/m3 at sea level
  
  // Initial State
  let t = 0;
  let h = 100000; // Start at 100km (Karman line edge)
  let v = params.initialVelocity;
  let angle = params.entryAngle * (Math.PI / 180); // Convert to radians
  let destroyed = false;
  
  // Pod properties (simplified)
  const mass = 5000; // kg
  const area = 10; // m2

  while (h > 0 && t < 600 && !destroyed) {
    // 1. Atmosphere Density (Exponential model)
    const rho = surfaceDensity * Math.exp(-h / scaleHeight);

    // 2. Drag Force: Fd = 0.5 * rho * v^2 * Cd * A
    const dragForce = 0.5 * rho * v * v * params.dragCoefficient * area;
    const deceleration = dragForce / mass;

    // 3. Gravity component affecting velocity along path
    const gravityComponent = g * Math.sin(angle);

    // 4. Update Velocity (dv = a * dt)
    // Deceleration opposes motion, gravity aids it (if pointing down)
    v = v - (deceleration - gravityComponent) * dt;

    // 5. Update Altitude
    // Vertical speed = v * sin(angle)
    const verticalSpeed = v * Math.sin(angle);
    h = h - verticalSpeed * dt;

    // 6. Update Angle (Simplified flight path adjustments due to lift/gravity turn - very basic)
    // As it slows, gravity pulls the nose down
    if (v < 2000) {
        angle = Math.min(Math.PI / 2, angle + 0.001 * dt);
    }

    // 7. Temperature (Simplified stagnation point heating)
    // T is proportional to v^3 and sqrt(rho) roughly
    // Scaling factor tuned for "gameplay" feel
    const heatFlux = 1.83e-4 * Math.sqrt(rho) * Math.pow(v, 3); 
    const temp = Math.min(3000, 20 + (heatFlux / 10000)); // Surface temp approximation

    // 8. G-Force
    const gForce = deceleration / g;

    // 9. Determine Status
    let status: ReentryStep['status'] = 'Space';
    if (h > 80000) status = 'Space';
    else if (temp > 1400) status = 'Plasma';
    else if (v > 343) status = 'Reentry';
    else if (h <= 0) status = 'Landed';
    else status = 'Subsonic';

    // Fail states
    if (gForce > 12 || temp > 2800) {
        status = 'Burned'; // Structural failure or melt
        destroyed = true;
    }
    if (h <= 0 && v > 100) {
        status = 'Crashed';
        destroyed = true;
    }

    steps.push({
      time: Number(t.toFixed(1)),
      altitude: Math.max(0, Number(h.toFixed(0))),
      velocity: Number(v.toFixed(0)),
      temperature: Number(temp.toFixed(0)),
      gForce: Number(gForce.toFixed(1)),
      density: rho,
      status
    });

    if (h <= 0) break;
    t += dt;
  }

  return steps;
};