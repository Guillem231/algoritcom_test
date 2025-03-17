import React, { useRef, forwardRef, useImperativeHandle, Suspense } from 'react';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import { useSkateboardModel } from '@/modules/skateboard/hooks/useSkateboardModel';
import { useSkateboardPhysics } from '@/modules/skateboard/hooks/useSkateboardPhysics';
import { useWorldBoundaryEnforcer } from '@/modules/skateboard/hooks/useWorldBoundaryEnforcer';
import { SkateboardEffects } from './SkateboardEffects';
import { SKATEBOARD_CONFIG } from '@/modules/skateboard/config/skateboardConfig';
import * as THREE from 'three';

const Skateboard = forwardRef(({ position = [0, 0, 0] }, ref) => {
  const skateRef = useRef();
  const rigidBodyRef = useRef();

  const { model, isLoaded, renderFallback, modelConfig } = useSkateboardModel();
  const { isRiding, setIsRiding, isNearby, setIsNearby, elevation, setElevation } =
    useSkateboardPhysics(rigidBodyRef, skateRef, position);
  const { enforceWorldBoundaries } = useWorldBoundaryEnforcer();

  const { PHYSICS, COLLIDER } = SKATEBOARD_CONFIG;

  useImperativeHandle(ref, () => ({
    rigidBody: rigidBodyRef.current,
    isRiding,
    setIsRiding: value => {
      setIsRiding(value);
      if (!value) {
        setIsNearby(true);
        setTimeout(() => setIsNearby(false), 5000);
      }
    },
    getPosition: () => rigidBodyRef.current.translation(),
    setRotation: angle => {
      if (rigidBodyRef.current) {
        const quat = new THREE.Quaternion();
        quat.setFromAxisAngle(new THREE.Vector3(0, 1, 0), angle);

        rigidBodyRef.current.setRotation(
          {
            x: quat.x,
            y: quat.y,
            z: quat.z,
            w: quat.w,
          },
          true
        );
      }
    },
    setElevation,
    enforceWorldBoundaries,
    setNearby: value => {
      setIsNearby(value);
    },
  }));

  return (
    <RigidBody
      ref={rigidBodyRef}
      type="dynamic"
      position={[position[0], Math.max(position[1], PHYSICS.HOVER_HEIGHT), position[2]]}
      colliders={false}
      mass={isRiding ? PHYSICS.MASS.RIDING : PHYSICS.MASS.DEFAULT}
      friction={PHYSICS.FRICTION}
      restitution={PHYSICS.RESTITUTION}
      linearDamping={isRiding ? PHYSICS.DAMPING.LINEAR_RIDING : PHYSICS.DAMPING.LINEAR_DEFAULT}
      angularDamping={isRiding ? PHYSICS.DAMPING.ANGULAR_RIDING : PHYSICS.DAMPING.ANGULAR_DEFAULT}
      lockRotations={true}
      enabledTranslations={[true, true, true]}
      contactForceEventThreshold={0}
    >
      <CuboidCollider args={COLLIDER.SIZE} />

      <group ref={skateRef}>
        <Suspense fallback={renderFallback()}>
          {model ? (
            <primitive
              object={model}
              scale={modelConfig.SCALE}
              position={modelConfig.POSITION}
              rotation={modelConfig.ROTATION}
              visible={true}
            />
          ) : (
            renderFallback()
          )}
        </Suspense>

        <SkateboardEffects isRiding={isRiding} isVisible={!isRiding || isNearby} />

        <mesh visible={false}>
          <boxGeometry args={COLLIDER.DEBUG_SIZE} />
          <meshBasicMaterial color="red" wireframe={true} />
        </mesh>
      </group>
    </RigidBody>
  );
});

export default Skateboard;
