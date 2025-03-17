export const normalizeAngle = angle => {
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
    RUNNING_SLOW: 0.04,
  }
) => {
  const startNorm = normalizeAngle(start);
  const endNorm = normalizeAngle(end);
  let diff = endNorm - startNorm;

  if (diff > Math.PI) diff -= 2 * Math.PI;
  if (diff < -Math.PI) diff += 2 * Math.PI;

  const absDiff = Math.abs(diff);

  if (isRunning) {
    if (absDiff > Math.PI / 2) {
      return startNorm + diff * turningFactors.RUNNING_SLOW;
    } else {
      return startNorm + diff * turningFactors.RUNNING;
    }
  }

  return startNorm + diff * t;
};
