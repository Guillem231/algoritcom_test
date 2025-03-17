import React, { useRef, useState, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { RigidBody, CapsuleCollider, useRapier } from '@react-three/rapier';
import * as THREE from 'three';
import { useKeyboardControls,  E, DIRECTIONS } from '@/modules/avatar/hooks/useKeyboardControls';
import FBXAvatar from './FBXAvatar';
import { PHYSICS } from './constants/physics';
import { MODEL_PATH, ANIMATION_PATHS, ANIMATION_STATES } from './config/animationConfig';

import { useAvatarInit } from './hooks/useAvatarInit';
import { useAvatarCamera } from './hooks/useAvatarCamera';
import { useAvatarMovement } from './hooks/useAvatarMovement';
import { useAvatarSkate } from './hooks/useAvatarSkate';
import { useAvatarAnimation } from './hooks/useAvatarAnimation';


const Avatar = forwardRef(({ 
  startPosition = [0, 0, 0], 
  skateboardRef, 
  isManualCameraMode = false, 
  onAnimationChange,
}, ref) => {
  const rigidBodyRef = useRef();
  const avatarRef = useRef();
  const rotationRef = useRef(0);
  const cameraTargetRef = useRef(new THREE.Vector3());
  
  const [animationState, setAnimationState] = useState(ANIMATION_STATES.IDLE);
  const [isJumping, setIsJumping] = useState(false);
  const [isDancing, setIsDancing] = useState(false);
  const [isInit, setIsInit] = useState(false);
  const [isOnSkate, setIsOnSkate] = useState(false);
  const [isNearSkate, setIsNearSkate] = useState(false);
  
  const controls = useKeyboardControls();
  const { camera } = useThree();
  
  useAvatarInit(rigidBodyRef, isInit, setIsInit, startPosition, camera);
  
  const { updateAnimation } = useAvatarAnimation(
    animationState, 
    setAnimationState, 
    onAnimationChange, 
    rigidBodyRef,
    avatarRef
  );
  
  const { updateCamera } = useAvatarCamera(
    rigidBodyRef, 
    avatarRef, 
    camera, 
    isOnSkate, 
    isManualCameraMode, 
    cameraTargetRef
  );
  
  const { handleMovement } = useAvatarMovement(
    rigidBodyRef,
    avatarRef,
    rotationRef,
    isJumping,
    setIsJumping,
    isDancing,
    setIsDancing
  );
  
  const { 
    checkSkateProximity, 
    mountSkateboard, 
    dismountSkateboard, 
    handleSkateMovement
  } = useAvatarSkate(
    rigidBodyRef,
    avatarRef,
    rotationRef,
    skateboardRef,
    isOnSkate,
    setIsOnSkate,
    controls,
    camera
  );
  
  useImperativeHandle(ref, () => ({
    translation: () => {
      if (rigidBodyRef.current) {
        return rigidBodyRef.current.translation();
      }
      return { x: startPosition[0], y: startPosition[1], z: startPosition[2] };
    }
  }));
  
  useEffect(() => {
    if (!skateboardRef || !rigidBodyRef.current) return;
    
    const intervalId = setInterval(() => {
      const isNear = checkSkateProximity();
      setIsNearSkate(isNear);
    }, 200);
    
    return () => clearInterval(intervalId);
  }, [skateboardRef, checkSkateProximity]);
  
  useEffect(() => {
    if (controls[E] && controls[E] !== controls.ePrevious) {
      if (isNearSkate && !isOnSkate) {
        mountSkateboard();
        setIsOnSkate(true);
      } else if (isOnSkate) {
        dismountSkateboard();
        setIsOnSkate(false);
      }
    }
    controls.ePrevious = controls[E];
  }, [controls, isNearSkate, isOnSkate, mountSkateboard, dismountSkateboard]);
  
  useFrame((state, delta) => {
    if (!rigidBodyRef.current || !avatarRef.current || !isInit) return;
    
    const limitedDelta = Math.min(delta, PHYSICS.MAX_DELTA_TIME);
    const directionPressed = DIRECTIONS.some(key => controls[key]);
    
    let nextAnimationState = ANIMATION_STATES.IDLE;
    
    if (isOnSkate && skateboardRef.current) {
      nextAnimationState = ANIMATION_STATES.SKATEBOARDING;
      handleSkateMovement(controls, limitedDelta, camera);
    } else {
      nextAnimationState = handleMovement(controls, limitedDelta, camera);
    }
    
    if (!isJumping || nextAnimationState === ANIMATION_STATES.JUMPING) {
      updateAnimation(
        isDancing 
          ? ANIMATION_STATES.DANCING 
          : (isOnSkate && directionPressed 
              ? ANIMATION_STATES.SKATEBOARDING 
              : nextAnimationState)
      );
    }
    
    if (!isManualCameraMode) {
      updateCamera();
    }
    

    controls.sitPrevious = controls.C;
  });
  
  return (
    <>
      <RigidBody
        ref={rigidBodyRef}
        colliders={false}
        mass={PHYSICS.AVATAR_MASS}
        type="dynamic"
        lockRotations={true}
        friction={PHYSICS.AVATAR_FRICTION}
        restitution={PHYSICS.AVATAR_RESTITUTION}
      >
        <CapsuleCollider 
          args={[PHYSICS.CAPSULE_RADIUS, PHYSICS.CAPSULE_HEIGHT]} 
          position={[0, PHYSICS.CAPSULE_Y_OFFSET, 0]} 
        />
        <group ref={avatarRef}>
          <mesh 
            position={[0, 0.01, 0]} 
            rotation={[-Math.PI / 2, 0, 0]} 
            receiveShadow={false} 
            castShadow={true}
          >
            <planeGeometry args={[1, 1]} />
            <shadowMaterial opacity={0.6} color="black" />
          </mesh>
          <FBXAvatar 
            modelPath={MODEL_PATH} 
            animationsMap={ANIMATION_PATHS} 
            currentAnimation={animationState} 
          />
        </group>
      </RigidBody>
    </>
  );
});

export default Avatar;
