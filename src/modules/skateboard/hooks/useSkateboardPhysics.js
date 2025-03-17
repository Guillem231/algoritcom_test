import { useState, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SKATEBOARD_CONFIG } from '@/modules/skateboard/config/skateboardConfig';

/**
 * Hook para manejar la física del skateboard
 */
export function useSkateboardPhysics(rigidBodyRef, skateRef, position) {
  const { PHYSICS } = SKATEBOARD_CONFIG;
  const [isRiding, setIsRiding] = useState(false);
  const [isNearby, setIsNearby] = useState(false);
  const [elevation, setElevation] = useState(0);
  
  // Aplicar física y levitación
  useFrame((state) => {
    if (!rigidBodyRef.current || !skateRef.current) return;
    
    const currentPos = rigidBodyRef.current.translation();
    const targetHeight = PHYSICS.HOVER_HEIGHT + elevation;
    
    // Aplicar efectos de flotación si no está montado
    if (!isRiding) {
      skateRef.current.position.y = 
        Math.sin(state.clock.elapsedTime * SKATEBOARD_CONFIG.VISUAL.FLOAT_SPEED) * 
        SKATEBOARD_CONFIG.VISUAL.FLOAT_AMPLITUDE;
    } else {
      skateRef.current.position.y = 0;
    }
    
    // Si está por debajo de la altura deseada pero no en caída libre
    if (currentPos.y < targetHeight && !isRiding) {
      rigidBodyRef.current.setTranslation({
        x: currentPos.x,
        y: targetHeight,
        z: currentPos.z
      }, false);
      
      // Restablecer la velocidad vertical a cero para evitar rebotes
      const vel = rigidBodyRef.current.linvel();
      rigidBodyRef.current.setLinvel({
        x: vel.x,
        y: 0,
        z: vel.z
      }, false);
    }
    // Si está montado, asegurarse de mantener la elevación correcta
    else if (isRiding && Math.abs(currentPos.y - targetHeight) > 0.05) {
      rigidBodyRef.current.setTranslation({
        x: currentPos.x,
        y: targetHeight,
        z: currentPos.z
      }, false);
    }
  });
  
  // Verificar si el skateboard ha caído demasiado lejos
  useFrame(() => {
    if (!rigidBodyRef.current) return;
    
    const currentPos = rigidBodyRef.current.translation();
    
    // Establecer un límite inferior absoluto para evitar caídas al vacío
    if (currentPos.y < PHYSICS.MIN_HEIGHT) {
      // Reposicionar el skateboard si cae demasiado
      rigidBodyRef.current.setTranslation({
        x: position[0],
        y: PHYSICS.HOVER_HEIGHT + elevation,
        z: position[2]
      }, true);
      
      // Detener cualquier movimiento
      rigidBodyRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
      rigidBodyRef.current.setAngvel({ x: 0, y: 0, z: 0 }, true);
      
      if (isRiding) {
        setIsRiding(false);
      }
    }
  });
  
  return {
    isRiding,
    setIsRiding,
    isNearby,
    setIsNearby,
    elevation,
    setElevation
  };
}
