import { useEffect } from 'react';
import { SKATEBOARD_CONFIG } from '@/modules/skateboard/config/skateboardConfig';

/**
 * Hook para manejar colisiones del skateboard
 */
export function useSkateboardCollisions(rigidBodyRef, setIsRiding) {
  useEffect(() => {
    if (!rigidBodyRef.current) return;
    
    // Función para manejar colisiones
    const handleCollision = (event) => {
      // Si la colisión es significativa y estamos montados, desmontar
      if (event.totalForceMagnitude > 20 && setIsRiding) {
        setIsRiding(false);
      }
    };
    
    // Agregar listener de eventos de colisión
    const unsubscribe = rigidBodyRef.current.onContactForce(handleCollision);
    
    return () => {
      // Limpiar listener
      if (unsubscribe) unsubscribe();
    };
  }, [rigidBodyRef, setIsRiding]);
}
