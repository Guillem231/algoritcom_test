import { useCallback } from 'react';
import { SCENE_CONFIG } from '@/modules/world/config/sceneConfig';


export function useWorldBounds() {
  const { START_POSITION, WORLD_BOUNDS } = SCENE_CONFIG;
  const [startX, startY, startZ] = START_POSITION;
  const { FORWARD_DISTANCE, SIDE_DISTANCE } = WORLD_BOUNDS;
  
  
  const createWorldBoundaries = useCallback(() => {
    return [
      {
        position: [startX, 1.5, startZ + FORWARD_DISTANCE],
        geometry: [SIDE_DISTANCE * 2 + 2, 5, 0.2]
      },
      {
        position: [startX, 1.5, startZ - FORWARD_DISTANCE],
        geometry: [SIDE_DISTANCE * 2 + 2, 5, 0.2]
      },
      {
        position: [startX - SIDE_DISTANCE, 1.5, startZ],
        geometry: [0.2, 5, FORWARD_DISTANCE * 2 + 2]
      },
      {
        position: [startX + SIDE_DISTANCE, 1.5, startZ],
        geometry: [0.2, 5, FORWARD_DISTANCE * 2 + 2]
      }
    ];
  }, [startX, startZ, FORWARD_DISTANCE, SIDE_DISTANCE]);
  
  return {
    createWorldBoundaries,
    startPosition: START_POSITION
  };
}
