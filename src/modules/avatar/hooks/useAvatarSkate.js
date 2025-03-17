import { useCallback, useRef } from 'react';
import * as THREE from 'three';
import { W, A, S, D } from '@/modules/avatar/hooks/useKeyboardControls';
import { SKATEBOARD } from '@/modules/avatar/constants/skateboardUser';
import { lerpAngle } from '../utils/angleUtils';



const getCameraDirection = (camera) => {
  const direction = new THREE.Vector3();
  
  if (typeof camera.getWorldDirection === 'function') {
    camera.getWorldDirection(direction);
  } 
  else if (camera.position && camera.target) {
    direction.subVectors(camera.position, camera.target).normalize().negate();
  }
  else if (camera.rotation) {
    direction.set(0, 0, -1).applyEuler(camera.rotation);
  }
  else {
    direction.set(0, 0, -1);
    console.warn('No se pudo determinar la dirección de la cámara, usando dirección por defecto');
  }
  
  return direction;
};


export const useAvatarSkate = (
  rigidBodyRef,
  avatarRef,
  rotationRef,
  skateboardRef,
  setIsOnSkate,
  controls,
  camera
) => {
  const currentVelocityRef = useRef(0);

  const checkSkateProximity = useCallback(() => {
    if (!skateboardRef?.current || !rigidBodyRef.current) return false;
    
    const avatarPos = rigidBodyRef.current.translation();
    const skatePos = skateboardRef.current.getPosition();
    
    const distance = Math.sqrt(
      Math.pow(avatarPos.x - skatePos.x, 2) + 
      Math.pow(avatarPos.z - skatePos.z, 2)
    );
    
    return distance < SKATEBOARD.PROXIMITY_THRESHOLD;
  }, [rigidBodyRef, skateboardRef]);


  const mountSkateboard = useCallback(() => {
    if (!skateboardRef.current || !rigidBodyRef.current || !avatarRef.current) return;
    
    const skatePos = skateboardRef.current.getPosition();
    
    rigidBodyRef.current.setTranslation({
      x: skatePos.x + SKATEBOARD.AVATAR_X_OFFSET,
      y: skatePos.y + SKATEBOARD.AVATAR_Y_OFFSET,
      z: skatePos.z
    }, true);
    
    rigidBodyRef.current.setLinvel({x: 0, y: 0, z: 0}, true);
    
    const cameraDirection = getCameraDirection(camera);
    cameraDirection.y = 0;
    cameraDirection.normalize();
    const angle = Math.atan2(cameraDirection.x, cameraDirection.z);
    
    rotationRef.current = angle;
    avatarRef.current.rotation.y = angle;
    skateboardRef.current.setRotation(angle);
    
    skateboardRef.current.setElevation(SKATEBOARD.ELEVATION);
    skateboardRef.current.setIsRiding(true);
    
    currentVelocityRef.current = 0;
  }, [skateboardRef, rigidBodyRef, avatarRef, rotationRef, camera]);

  
  const dismountSkateboard = useCallback(() => {
    if (!skateboardRef.current || !rigidBodyRef.current) return;
    
    const skatePos = skateboardRef.current.getPosition();
    
    rigidBodyRef.current.setTranslation({
      x: skatePos.x,
      y: skatePos.y + SKATEBOARD.AVATAR_Y_OFFSET,
      z: skatePos.z
    }, true);
    
    rigidBodyRef.current.setLinvel({x: 0, y: 0, z: 0}, true);
    
    skateboardRef.current.setElevation(0);
    skateboardRef.current.setIsRiding(false);
    
    currentVelocityRef.current = 0;
  }, [skateboardRef, rigidBodyRef]);


  const handleSkateMovement = useCallback((controls, delta, camera) => {
    if (!skateboardRef?.current || !rigidBodyRef.current || !avatarRef.current) return;
    
    const skatePos = skateboardRef.current.getPosition();
    
    if (skatePos && typeof skatePos.y === 'number' && !isNaN(skatePos.y) && skatePos.y > -10) {
      rigidBodyRef.current.setTranslation({
        x: skatePos.x,
        y: skatePos.y ,
        z: skatePos.z
      }, true);
      
      rigidBodyRef.current.setLinvel({x: 0, y: 0, z: 0}, true);
      rigidBodyRef.current.setAngvel({x: 0, y: 0, z: 0}, true);
    }
    

    const cameraDirection = getCameraDirection(camera);
    cameraDirection.y = 0;
    cameraDirection.normalize();
    
    const cameraRight = new THREE.Vector3(-cameraDirection.z, 0, cameraDirection.x);
    const moveVector = new THREE.Vector3(0, 0, 0);
    
    if (controls[W]) moveVector.add(cameraDirection);  
    if (controls[S]) moveVector.sub(cameraDirection);
    if (controls[A]) moveVector.sub(cameraRight);
    if (controls[D]) moveVector.add(cameraRight);
    
    if (moveVector.length() > 0) {
      moveVector.normalize();
      const targetRotation = Math.atan2(moveVector.x, moveVector.z);
      
      rotationRef.current = lerpAngle(
        rotationRef.current, 
        targetRotation, 
        SKATEBOARD.TURNING_FACTOR
      );
      
      avatarRef.current.rotation.y = rotationRef.current;
      skateboardRef.current.setRotation?.(rotationRef.current);
      
      if (currentVelocityRef.current < SKATEBOARD.MAX_SPEED) {
        currentVelocityRef.current += delta * SKATEBOARD.ACCELERATION;
        if (currentVelocityRef.current > SKATEBOARD.MAX_SPEED) {
          currentVelocityRef.current = SKATEBOARD.MAX_SPEED;
        }
      }
    } else {
      if (currentVelocityRef.current > 0) {
        currentVelocityRef.current -= delta * SKATEBOARD.DECELERATION;
        if (currentVelocityRef.current < 0) {
          currentVelocityRef.current = 0;
        }
      }
    }
    
    if (currentVelocityRef.current > 0) {
      const skateDirection = new THREE.Vector3(
        Math.sin(rotationRef.current),
        0,
        Math.cos(rotationRef.current)
      );
      
      const moveX = skateDirection.x * currentVelocityRef.current * delta;
      const moveZ = skateDirection.z * currentVelocityRef.current * delta;
      
      const skateRigidBody = skateboardRef.current.rigidBody;
      if (skateRigidBody) {
        const position = skateRigidBody.translation();
        
        const newPosition = {
          x: position.x + moveX,
          y: position.y,
          z: position.z + moveZ
        };
        
        if (skateboardRef.current.enforceWorldBoundaries) {
          const correctedPosition = skateboardRef.current.enforceWorldBoundaries(newPosition);
          skateRigidBody.setTranslation(correctedPosition, false);
        } else {
          skateRigidBody.setTranslation(newPosition, false);
        }
      }
    }
  }, [skateboardRef, rigidBodyRef, avatarRef, rotationRef]);

  return {
    checkSkateProximity,
    mountSkateboard,
    dismountSkateboard,
    handleSkateMovement,
    currentVelocityRef
  };
};
