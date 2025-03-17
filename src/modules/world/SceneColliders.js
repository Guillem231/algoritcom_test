import React from 'react';
import { RigidBody } from '@react-three/rapier';

export function SceneColliders({ colliders, visible = false }) {
  if (!colliders || colliders.length === 0) return null;

  return (
    <>
      {colliders.map((collider, index) => {
        if (!collider || !collider.position || (!collider.size && !collider.geometry)) {
          console.warn(`Collider ${index} tiene formato inválido:`, collider);
          return null;
        }

        const size = collider.size || collider.geometry;

        return (
          <RigidBody
            key={index}
            type="fixed"
            position={collider.position}
            friction={collider.type === 'floor' ? 0.8 : 0.2}
            restitution={0.1}
          >
            <mesh visible={visible}>
              <boxGeometry
                args={[
                  Math.max(size[0] * 2, 0.1),
                  Math.max(size[1] * 2, 0.1),
                  Math.max(size[2] * 2, 0.1),
                ]}
              />
              <meshStandardMaterial
                color={collider.type === 'floor' ? '#666666' : '#7777aa'}
                opacity={0.3}
                transparent
              />
            </mesh>
          </RigidBody>
        );
      })}
    </>
  );
}