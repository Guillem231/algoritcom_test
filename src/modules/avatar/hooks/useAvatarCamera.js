import { useCallback } from 'react';
import * as THREE from 'three';
import { CAMERA } from '../constants/camera';


export const useAvatarCamera = (
  rigidBodyRef, 
  avatarRef, 
  camera, 
  isOnSkate, 
  isManualCameraMode, 
  cameraTargetRef
) => {
  const updateCamera = useCallback(() => {
    if (!rigidBodyRef.current || !avatarRef.current || isManualCameraMode) return;
  
    const position = rigidBodyRef.current.translation();
    const avatarRotation = avatarRef.current.rotation.y;
  
    const direction = new THREE.Vector3(0, 0, 1).applyAxisAngle(
      new THREE.Vector3(0, 1, 0),
      avatarRotation
    );
  
    const targetCameraPos = new THREE.Vector3(
      position.x - direction.x * CAMERA.TARGET_BACK_DISTANCE,
      position.y + CAMERA.TARGET_HEIGHT_OFFSET,
      position.z - direction.z * CAMERA.TARGET_BACK_DISTANCE
    );
  
    const cameraLerpFactor = isOnSkate 
      ? CAMERA.LERP_FACTOR_SKATE 
      : CAMERA.LERP_FACTOR_NORMAL;
    
    camera.position.lerp(targetCameraPos, cameraLerpFactor);
  
    const targetLookAt = new THREE.Vector3(
      position.x + direction.x * CAMERA.LOOK_AHEAD_DISTANCE,
      position.y + CAMERA.LOOK_HEIGHT_OFFSET,
      position.z + direction.z * CAMERA.LOOK_AHEAD_DISTANCE
    );
  
    cameraTargetRef.current.lerp(targetLookAt, cameraLerpFactor);
    camera.lookAt(cameraTargetRef.current);
  }, [rigidBodyRef, avatarRef, camera, isOnSkate, isManualCameraMode, cameraTargetRef]);

  return { updateCamera };
};
