import { useState } from 'react';
import { SKATEBOARD_CONFIG } from '@/modules/skateboard/config/skateboardConfig';

/**
 * Hook para manejar los límites del mundo para el skateboard
 */
export function useWorldBoundaryEnforcer() {
  const { WORLD_BOUNDS } = SKATEBOARD_CONFIG;
  const { CENTER_X, CENTER_Z, SIDE_DISTANCE, FORWARD_DISTANCE, BOUNDARY_MARGIN } = WORLD_BOUNDS;
  
  const [atBoundaryX, setAtBoundaryX] = useState(false);
  const [atBoundaryZ, setAtBoundaryZ] = useState(false);
  
  /**
   * Verifica si una posición está cerca de los límites del mundo
   */
  const checkBoundaryProximity = (position) => {
    if (!position) return { x: false, z: false };
    
    const nearXMinBoundary = position.x <= (CENTER_X - SIDE_DISTANCE + 0.1);
    const nearXMaxBoundary = position.x >= (CENTER_X + SIDE_DISTANCE - 0.1);
    const nearZMinBoundary = position.z <= (CENTER_Z - FORWARD_DISTANCE + 0.1);
    const nearZMaxBoundary = position.z >= (CENTER_Z + FORWARD_DISTANCE - 0.1);
    
    const newAtBoundaryX = nearXMinBoundary || nearXMaxBoundary;
    const newAtBoundaryZ = nearZMinBoundary || nearZMaxBoundary;
    
    if (newAtBoundaryX !== atBoundaryX) {
      setAtBoundaryX(newAtBoundaryX);
    }
    
    if (newAtBoundaryZ !== atBoundaryZ) {
      setAtBoundaryZ(newAtBoundaryZ);
    }
    
    return { 
      x: newAtBoundaryX, 
      z: newAtBoundaryZ,
      nearXMin: nearXMinBoundary,
      nearXMax: nearXMaxBoundary,
      nearZMin: nearZMinBoundary,
      nearZMax: nearZMaxBoundary
    };
  };
  
  /**
   * Corrige la velocidad si estamos en un límite
   */
  const correctVelocityAtBoundary = (position, velocity, boundaries) => {
    if (!position || !velocity) return velocity;
    
    let newVelX = velocity.x;
    let newVelZ = velocity.z;
    
    // Cancelar velocidad en X si estamos en un límite X
    if (boundaries.x) {
      if ((boundaries.nearXMin && velocity.x < 0) || (boundaries.nearXMax && velocity.x > 0)) {
        newVelX = 0;
      }
    }
    
    // Cancelar velocidad en Z si estamos en un límite Z
    if (boundaries.z) {
      if ((boundaries.nearZMin && velocity.z < 0) || (boundaries.nearZMax && velocity.z > 0)) {
        newVelZ = 0;
      }
    }
    
    return { x: newVelX, y: velocity.y, z: newVelZ };
  };
  
  /**
   * Corrige la posición para mantenerse dentro de los límites
   */
  const enforceWorldBoundaries = (proposedPosition) => {
    if (!proposedPosition) return proposedPosition;
    
    // Verificar si la posición propuesta está dentro de los límites
    let x = proposedPosition.x;
    let z = proposedPosition.z;
    
    // Aplicar restricciones
    if (x < CENTER_X - SIDE_DISTANCE) x = CENTER_X - SIDE_DISTANCE + BOUNDARY_MARGIN;
    if (x > CENTER_X + SIDE_DISTANCE) x = CENTER_X + SIDE_DISTANCE - BOUNDARY_MARGIN;
    if (z < CENTER_Z - FORWARD_DISTANCE) z = CENTER_Z - FORWARD_DISTANCE + BOUNDARY_MARGIN;
    if (z > CENTER_Z + FORWARD_DISTANCE) z = CENTER_Z + FORWARD_DISTANCE - BOUNDARY_MARGIN;
    
    // Devolver la posición corregida
    return { x, y: proposedPosition.y, z };
  };
  
  return {
    atBoundaryX,
    atBoundaryZ,
    checkBoundaryProximity,
    correctVelocityAtBoundary,
    enforceWorldBoundaries
  };
}
