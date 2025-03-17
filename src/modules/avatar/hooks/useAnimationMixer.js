import { useState, useRef, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { ANIMATION_STATES } from '@/modules/avatar/config/animationConfig';

const animationCache = new Map();

export function useAnimationMixer(mixer, animationsMap) {
  const [animationActions, setAnimationActions] = useState(new Map());
  const actionRef = useRef(null);
  const currentAnimRef = useRef(ANIMATION_STATES.IDLE);
  
  useFrame((_, delta) => {
    if (mixer) {
      mixer.update(delta);
    }
  });
  

  const playAnimation = useCallback((animPath) => {
    if (!mixer || !animPath) return null;
    
    if (animationCache.has(animPath)) {
      const animation = animationCache.get(animPath);
      return startAction(animation);
    }
    
    const loader = new FBXLoader();
    loader.load(animPath, (animFbx) => {
      const animation = animFbx.animations[0];
      if (animation) {
        animationCache.set(animPath, animation);
        startAction(animation);
      }
    });
    
    return null;
  }, [mixer]);
  

  const startAction = useCallback((animation) => {
    if (!mixer) return null;
    
   
    if (actionRef.current) {
      actionRef.current.fadeOut(0.2);
    }
    
    const action = mixer.clipAction(animation);
    action.reset();
    action.fadeIn(0.2);
    action.play();
    
    actionRef.current = action;
    
    setAnimationActions(prev => {
      const updated = new Map(prev);
      updated.set(animation, action);
      return updated;
    });
    
    return action;
  }, [mixer]);
  
  return {
    playAnimation,
    animationActions
  };
}