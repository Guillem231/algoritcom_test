import React, { useRef, useEffect, useCallback, useState } from 'react';
import { useFBXModel } from './hooks/useFBXModel';
import { useAnimationMixer } from './hooks/useAnimationMixer';
import {
  MODEL_PATH,
  ANIMATION_PATHS,
  ANIMATION_STATES,
} from '@/modules/avatar/config/animationConfig';
import PropTypes from 'prop-types';
import * as THREE from 'three';

export default function FBXAvatar({
  modelPath = MODEL_PATH,
  animationsMap = ANIMATION_PATHS,
  currentAnimation = ANIMATION_STATES.IDLE,
  onLoad,
  onError,
}) {
  const group = useRef();
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadAttempts, setLoadAttempts] = useState(0);

  const handleModelLoaded = useCallback(() => {
    setIsLoaded(true);
    if (onLoad) onLoad();
  }, [modelPath, onLoad]);

  const handleLoadError = useCallback(() => {
    console.error(`Failed to load model: ${modelPath}`);
    if (onError) onError();

    if (loadAttempts < 3) {
      setTimeout(() => {
        setLoadAttempts(prev => prev + 1);
      }, 500);
    }
  }, [modelPath, loadAttempts, onError]);

  const { model, mixer } = useFBXModel(
    modelPath,
    group,
    handleModelLoaded,
    handleLoadError,
    loadAttempts
  );

  const { playAnimation } = useAnimationMixer(mixer, animationsMap, currentAnimation);

  useEffect(() => {
    if (!isLoaded && group.current) {
      const geometry = new THREE.SphereGeometry(0.5, 16, 16);
      const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
      const sphere = new THREE.Mesh(geometry, material);

      while (group.current.children.length > 0) {
        group.current.remove(group.current.children[0]);
      }

      group.current.add(sphere);

      return () => {
        if (group.current && group.current.children.includes(sphere)) {
          group.current.remove(sphere);
        }
      };
    }
  }, [isLoaded]);

  useEffect(() => {
    if (currentAnimation && animationsMap?.[currentAnimation]) {
      playAnimation(animationsMap[currentAnimation]);
    }
  }, [currentAnimation, animationsMap, playAnimation]);

  return <group ref={group} />;
}

FBXAvatar.propTypes = {
  modelPath: PropTypes.string,
  animationsMap: PropTypes.objectOf(PropTypes.string),
  currentAnimation: PropTypes.string,
  onLoad: PropTypes.func,
  onError: PropTypes.func,
};
