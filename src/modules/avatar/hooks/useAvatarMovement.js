import { useCallback } from 'react';
import * as THREE from 'three';
import { MOVEMENT, TURNING } from '../constants/movement';
import { W, A, S, D, SHIFT, SPACE, C } from '@/modules/avatar/hooks/useKeyboardControls';
import { lerpAngle } from '../utils/angleUtils';
import { getCameraDirectionVectors, createMoveVector } from '../utils/positionUtils';
import { ANIMATION_STATES } from '../config/animationConfig';

export const useAvatarMovement = (
  rigidBodyRef,
  avatarRef,
  rotationRef,
  isJumping,
  setIsJumping,
  isDancing,
  setIsDancing
) => {
  const handleMovement = useCallback(
    (controls, delta, camera) => {
      if (!rigidBodyRef.current || !avatarRef.current) return ANIMATION_STATES.IDLE;

      let animationState = ANIMATION_STATES.IDLE;
      const directionPressed = [W, A, S, D].some(key => controls[key]);

      if (directionPressed && controls[SHIFT]) {
        animationState = ANIMATION_STATES.RUNNING;
      } else if (directionPressed) {
        animationState = ANIMATION_STATES.WALKING;
      }

      if (controls[SPACE] && !isJumping && !isDancing) {
        setIsJumping(true);
        animationState = ANIMATION_STATES.JUMPING;

        setTimeout(() => {
          if (rigidBodyRef.current) {
            rigidBodyRef.current.applyImpulse({ x: 0, y: MOVEMENT.JUMP_FORCE, z: 0 }, true);
          }
        }, MOVEMENT.JUMP_PREPARATION_TIME);

        setTimeout(() => {
          setIsJumping(false);
        }, MOVEMENT.JUMP_DURATION);
      }

      if (controls[C] && controls[C] !== controls.sitPrevious) {
        setIsDancing(!isDancing);
        animationState = isDancing ? ANIMATION_STATES.IDLE : ANIMATION_STATES.DANCING;
      }

      if (!isDancing && directionPressed && !isJumping) {
        const directionVectors = getCameraDirectionVectors(camera);

        const controlKeys = { FORWARD: W, BACKWARD: S, LEFT: A, RIGHT: D };
        const moveVector = createMoveVector(controls, directionVectors, controlKeys);

        if (moveVector.length() > 0) {
          const targetRotation = Math.atan2(moveVector.x, moveVector.z);

          const isRunning = animationState === ANIMATION_STATES.RUNNING;
          const turningFactor = isRunning ? TURNING.RUNNING : TURNING.WALKING;

          rotationRef.current = lerpAngle(
            rotationRef.current,
            targetRotation,
            turningFactor,
            isRunning,
            { RUNNING: TURNING.RUNNING, RUNNING_SLOW: TURNING.RUNNING_SLOW }
          );

          avatarRef.current.rotation.y = rotationRef.current;

          const velocity = isRunning ? MOVEMENT.RUNNING_VELOCITY : MOVEMENT.WALKING_VELOCITY;
          const moveX = moveVector.x * velocity * delta;
          const moveZ = moveVector.z * velocity * delta;

          const position = rigidBodyRef.current.translation();
          rigidBodyRef.current.setTranslation(
            {
              x: position.x + moveX,
              y: position.y,
              z: position.z + moveZ,
            },
            false
          );
        }
      }

      return animationState;
    },
    [rigidBodyRef, avatarRef, rotationRef, isJumping, setIsJumping, isDancing, setIsDancing]
  );

  return { handleMovement };
};
