import React from 'react';
import { RigidBody } from '@react-three/rapier';
import { SCENE_CONFIG } from '@/modules/world/config/sceneConfig';

export function WorldBoundaries({ boundaries }) {
  const { DEBUG } = SCENE_CONFIG;
  
  return (
    <>
      {boundaries.map((boundary, index) => (
        <RigidBody key={index} type="fixed" position={boundary.position}>
          <mesh>
            <boxGeometry args={boundary.geometry} />
            <meshBasicMaterial opacity={DEBUG ? 0.2 : 0} transparent />
          </mesh>
        </RigidBody>
      ))}
    </>
  );
}
