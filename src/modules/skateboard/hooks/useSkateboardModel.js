import { useState, useEffect, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { SKATEBOARD_CONFIG } from '@/modules/skateboard/config/skateboardConfig';

/**
 * Hook para manejar la carga y preparación del modelo del skateboard
 */
export function useSkateboardModel() {
  const { MODEL } = SKATEBOARD_CONFIG;
  const [modelLoaded, setModelLoaded] = useState(false);
  const skateModel = useRef(null);
  
  // Precargar el modelo para asegurar que esté disponible
  useGLTF.preload(MODEL.PATH);
  
  // Cargar el modelo
  const { scene: skateScene } = useGLTF(MODEL.PATH);
  
  useEffect(() => {
    if (skateScene) {
      // Clonar la escena para tener una instancia única
      skateModel.current = skateScene.clone();
      
      // Configurar propiedades del modelo
      skateModel.current.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          
          // Mejorar materiales si es necesario
          if (child.material) {
            child.material = child.material.clone();
            child.material.needsUpdate = true;
          }
        }
      });
      
      // Marcar el modelo como cargado
      setModelLoaded(true);
    }
  }, [skateScene]);
  
  // Renderizar un placeholder mientras el modelo se carga
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
