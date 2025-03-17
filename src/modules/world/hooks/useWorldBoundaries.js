import { useMemo } from 'react';


export function useWorldBoundaries(colliders) {
  const worldBoundaries = useMemo(() => {
    if (!colliders || colliders.length === 0) return null;
    
    let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;
    
    colliders.forEach(c => {
      minX = Math.min(minX, c.position[0] - c.size[0]);
      maxX = Math.max(maxX, c.position[0] + c.size[0]);
      minZ = Math.min(minZ, c.position[2] - c.size[2]);
      maxZ = Math.max(maxZ, c.position[2] + c.size[2]);
    });
    
    const worldWidth = maxX - minX;
    const worldDepth = maxZ - minZ;
    const centerX = (minX + maxX) / 2;
    const centerZ = (minZ + maxZ) / 2;
    
    return {
      dimensions: { width: worldWidth, depth: worldDepth },
      center: { x: centerX, z: centerZ },
      min: { x: minX, z: minZ },
      max: { x: maxX, z: maxZ },
      boundaries: [
        {
          position: [centerX, 5, minZ - 2],
          geometry: [worldWidth + 10, 10, 1]
        },
        {
          position: [centerX, 5, maxZ + 2],
          geometry: [worldWidth + 10, 10, 1]
        },
        {
          position: [maxX + 2, 5, centerZ],
          geometry: [1, 10, worldDepth + 10]
        },
        {
          position: [minX - 2, 5, centerZ],
          geometry: [1, 10, worldDepth + 10]
        }
      ]
    };
  }, [colliders]);
  
  return worldBoundaries;
}
