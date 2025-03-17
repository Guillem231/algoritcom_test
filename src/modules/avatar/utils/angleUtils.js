
export const normalizeAngle = (angle) => {
  while (angle > Math.PI) angle -= 2 * Math.PI;
  while (angle < -Math.PI) angle += 2 * Math.PI;
  return angle;
};

export const lerpAngle = (
  start, 
  end, 
  t, 
  isRunning = false, 
  turningFactors = { 
    RUNNING: 0.08, 
    RUNNING_SLOW: 0.04 
  }
) => {
  const startNorm = normalizeAngle(start);
  const endNorm = normalizeAngle(end);
  let diff = endNorm - startNorm;
  
  // Take the shortest path
  if (diff > Math.PI) diff -= 2 * Math.PI;
  if (diff < -Math.PI) diff += 2 * Math.PI;
  
  const absDiff = Math.abs(diff);
  
  if (isRunning) {
    // For wide turns (over 90 degrees), use slower turning
    if (absDiff > Math.PI / 2) {
      return startNorm + diff * turningFactors.RUNNING_SLOW;
    } else {
      // For small turns, use faster turning
      return startNorm + diff * turningFactors.RUNNING;
    }
  }
  
  // Standard interpolation for walking or other states
  return startNorm + diff * t;
};
