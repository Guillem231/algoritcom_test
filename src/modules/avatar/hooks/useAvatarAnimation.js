import { useCallback } from 'react';


export const useAvatarAnimation = (
  animationState, 
  setAnimationState, 
  onAnimationChange, 
  rigidBodyRef,
  avatarRef
) => {

  const updateAnimation = useCallback((newState) => {
    if (newState !== animationState) {
      setAnimationState(newState);
      
      if (onAnimationChange) {
        onAnimationChange(newState);
      }
      

    }
  }, [animationState, setAnimationState, onAnimationChange, rigidBodyRef, avatarRef]);

  return { updateAnimation };
};
