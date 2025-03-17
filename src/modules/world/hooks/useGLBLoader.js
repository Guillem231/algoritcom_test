import { useState, useEffect } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three';

export function useGLBLoader(scenePath, position = [0, -0.5, 0], scale = 0.03) {
  const [model, setModel] = useState(null);
  const [colliders, setColliders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!scenePath || isLoading) return;

    setIsLoading(true);
    setIsLoaded(false);
    setError(null);

    const loader = new GLTFLoader();

    loader.load(
      scenePath,
      gltf => {
        const glbScene = gltf.scene;

        glbScene.scale.set(scale, scale, scale);
        glbScene.position.set(position[0], position[1], position[2]);

        const collidersList = [];
        const worldBounds = new THREE.Box3().setFromObject(glbScene);
        const worldSize = new THREE.Vector3();
        worldBounds.getSize(worldSize);

        const worldCenter = new THREE.Vector3();
        worldBounds.getCenter(worldCenter);

        collidersList.push({
          position: [worldCenter.x, worldCenter.y - 0.5, worldCenter.z],
          size: [worldSize.x / 1.9, 0.5, worldSize.z / 1.9],
          type: 'floor',
        });

        glbScene.traverse(child => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;

            if (child.material) {
              if (Array.isArray(child.material)) {
                child.material.forEach(mat => {
                  if (mat) {
                    mat.needsUpdate = true;
                  }
                });
              } else {
                child.material.needsUpdate = true;
              }
            }

            const bbox = new THREE.Box3().setFromObject(child);
            const size = new THREE.Vector3();
            bbox.getSize(size);

            const center = new THREE.Vector3();
            bbox.getCenter(center);

            if (Math.max(size.x, size.y, size.z) > 0.1) {
              collidersList.push({
                position: [center.x, center.y, center.z],
                size: [size.x / 2, size.y / 2, size.z / 2],
                type: 'object',
              });
            }
          }
        });

        setModel(glbScene);
        setColliders(collidersList);
        setIsLoaded(true);
        setIsLoading(false);
      },
      xhr => {
        if (xhr.lengthComputable) {
          const percent = Math.round((xhr.loaded / xhr.total) * 100);
          setLoadingProgress(percent);
        }
      },
      error => {
        setError(error);
        setIsLoading(false);
      }
    );
  }, [scenePath, scale, position]);

  return {
    model,
    colliders,
    isLoading,
    isLoaded,
    loadingProgress,
    error,
  };
}
