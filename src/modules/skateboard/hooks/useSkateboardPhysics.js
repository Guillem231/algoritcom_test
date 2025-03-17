import { useState, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SKATEBOARD_CONFIG } from '@/modules/skateboard/config/skateboardConfig';

export function useSkateboardPhysics(rigidBodyRef, skateRef, position) {
  const { PHYSICS } = SKATEBOARD_CONFIG;
  const [isRiding, setIsRiding] = useState(false);
  const [isNearby, setIsNearby] = useState(false);
  const [elevation, setElevation] = useState(0);

  useFrame(state => {
    if (!rigidBodyRef.current || !skateRef.current) return;

    const currentPos = rigidBodyRef.current.translation();
    const targetHeight = PHYSICS.HOVER_HEIGHT + elevation;

    if (!isRiding) {
      skateRef.current.position.y =
        Math.sin(state.clock.elapsedTime * SKATEBOARD_CONFIG.VISUAL.FLOAT_SPEED) *
        SKATEBOARD_CONFIG.VISUAL.FLOAT_AMPLITUDE;
    } else {
      skateRef.current.position.y = 0;
    }

    if (currentPos.y < targetHeight && !isRiding) {
      rigidBodyRef.current.setTranslation(
        {
          x: currentPos.x,
          y: targetHeight,
          z: currentPos.z,
        },
        false
      );

      const vel = rigidBodyRef.current.linvel();
      rigidBodyRef.current.setLinvel(
        {
          x: vel.x,
          y: 0,
          z: vel.z,
        },
        false
      );
    } else if (isRiding && Math.abs(currentPos.y - targetHeight) > 0.05) {
      rigidBodyRef.current.setTranslation(
        {
          x: currentPos.x,
          y: targetHeight,
          z: currentPos.z,
        },
        false
      );
    }
  });

  useFrame(() => {
    if (!rigidBodyRef.current) return;

    const currentPos = rigidBodyRef.current.translation();

    if (currentPos.y < PHYSICS.MIN_HEIGHT) {
      rigidBodyRef.current.setTranslation(
        {
          x: position[0],
          y: PHYSICS.HOVER_HEIGHT + elevation,
          z: position[2],
        },
        true
      );

      rigidBodyRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
      rigidBodyRef.current.setAngvel({ x: 0, y: 0, z: 0 }, true);

      if (isRiding) {
        setIsRiding(false);
      }
    }
  });

  return {
    isRiding,
    setIsRiding,
    isNearby,
    setIsNearby,
    elevation,
    setElevation,
  };
}
