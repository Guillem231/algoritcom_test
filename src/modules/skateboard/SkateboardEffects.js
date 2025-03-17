import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SKATEBOARD_CONFIG } from '@/modules/skateboard/config/skateboardConfig';

export function SkateboardEffects({ isRiding, isVisible = true }) {
  const { VISUAL } = SKATEBOARD_CONFIG;
  const lightColor = useRef(new THREE.Color(VISUAL.LIGHT_COLOR));
  const lightIntensity = useRef(VISUAL.BASE_INTENSITY);

  useFrame(state => {
    if (!isRiding) {
      lightIntensity.current =
        VISUAL.BASE_INTENSITY +
        Math.sin(state.clock.elapsedTime * VISUAL.PULSE_SPEED) * VISUAL.PULSE_INTENSITY;
    } else {
      lightIntensity.current = VISUAL.BASE_INTENSITY / 2;
    }
  });

  if (!isVisible || isRiding) return null;

  return (
    <pointLight
      position={[0, -0.1, 0]}
      intensity={lightIntensity.current}
      distance={1.5}
      color={lightColor.current}
      castShadow={false}
    />
  );
}
