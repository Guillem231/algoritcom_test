import { useState, useEffect } from 'react';
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

const modelCache = new Map();


export function useFBXModel(modelPath, groupRef, onLoad) {
  const [model, setModel] = useState(null);
  const [mixer, setMixer] = useState(null);

  useEffect(() => {
    if (!modelPath) return;
    
    const setupModel = (fbx) => {
      fbx.scale.set(1, 1, 1);
      fbx.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      if (!groupRef.current) {
  console.warn(`Group ref not ready for player ${id}`);
  return;
}
      groupRef.current?.add(fbx);
      
      const newMixer = new THREE.AnimationMixer(fbx);
      setMixer(newMixer);
      setModel(fbx);
      
      if (onLoad) {
        onLoad(fbx, newMixer, new Map());
      }
    };

    if (modelCache.has(modelPath)) {
      setupModel(modelCache.get(modelPath).clone());
      return;
    }

    const loader = new FBXLoader();
    loader.load(modelPath, (fbx) => {
      modelCache.set(modelPath, fbx.clone());
      setupModel(fbx);
    });

    return () => {
      if (model && groupRef.current) {
        groupRef.current.remove(model);
      }
    };
  }, [modelPath, groupRef, onLoad]);

  return { model, mixer };
}
