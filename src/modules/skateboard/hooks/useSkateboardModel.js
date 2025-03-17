import { useState, useEffect, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { SKATEBOARD_CONFIG } from '@/modules/skateboard/config/skateboardConfig';



export function useSkateboardModel() {
  const { MODEL } = SKATEBOARD_CONFIG;
  const [modelLoaded, setModelLoaded] = useState(false);
  const skateModel = useRef(null);
  
  useGLTF.preload(MODEL.PATH);
  
  const { scene: skateScene } = useGLTF(MODEL.PATH);
  
  useEffect(() => {
    if (skateScene) {
      skateModel.current = skateScene.clone();
      
      skateModel.current.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          
          if (child.material) {
            child.material = child.material.clone();
            child.material.needsUpdate = true;
          }
        }
      });
      
      setModelLoaded(true);
    }
  }, [skateScene]);
  
  const renderFallback = () => (
    <mesh>
      <boxGeometry args={[0.8, 0.1, 0.3]} />
      <meshStandardMaterial color="#888888" />
    </mesh>
  );
  
  return {
    model: skateModel.current,
    isLoaded: modelLoaded,
    renderFallback,
    modelConfig: MODEL
  };
}
