import { useCallback } from 'react';


export const useAvatarAnimation = (
  animationState, 
  setAnimationState, 
  onAnimationChange, 
  updatePlayerPosition,
  rigidBodyRef,
  avatarRef
) => {

  const updateAnimation = useCallback((newState) => {
    if (newState !== animationState) {
      setAnimationState(newState);
      
      if (onAnimationChange) {
        onAnimationChange(newState);
      }
      
      if (updatePlayerPosition && rigidBodyRef.current && avatarRef.current) {
        const pos = rigidBodyRef.current.translation();
        updatePlayerPosition(
          [pos.x, pos.y, pos.z],
          avatarRef.current.rotation.y,
          newState
        );
      }
    }
  }, [animationState, setAnimationState, onAnimationChange, updatePlayerPosition, rigidBodyRef, avatarRef]);

  return { updateAnimation };
};
