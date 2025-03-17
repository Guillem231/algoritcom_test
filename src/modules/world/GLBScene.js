import React, { useRef, memo, useEffect } from 'react';
import { RigidBody } from '@react-three/rapier';
import { useGLBLoader } from '@/modules/world/hooks/useGLBLoader';
import { useWorldBoundaries } from '@/modules/world/hooks/useWorldBoundaries';
import { SceneColliders } from './SceneColliders';

const GLBScene = memo(function GLBScene({
  scenePath,
  scale = 0.03,
  position = [0, -0.5, 0],
  debug = false,
}) {
  const groupRef = useRef();

  const { model, colliders, isLoaded } = useGLBLoader(scenePath, position, scale);

  const worldBoundaries = useWorldBoundaries(colliders);

  useEffect(() => {
    if (model && groupRef.current) {
      while (groupRef.current.children.length) {
        groupRef.current.remove(groupRef.current.children[0]);
      }
      groupRef.current.add(model);
    }

    return () => {
      if (groupRef.current) {
        while (groupRef.current.children.length) {
          groupRef.current.remove(groupRef.current.children[0]);
        }
      }
    };
  }, [model]);

  return (
    <>
      <group ref={groupRef} />

      <RigidBody type="fixed" colliders="cuboid" friction={0.8}>
        <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[200, 200]} />
          <meshStandardMaterial color="#808080" opacity={0} transparent />
        </mesh>
      </RigidBody>

      {isLoaded && <SceneColliders colliders={colliders} visible={debug} />}

      {isLoaded && worldBoundaries && (
        <SceneColliders colliders={worldBoundaries.boundaries} visible={debug} />
      )}
    </>
  );
});

export default GLBScene;
