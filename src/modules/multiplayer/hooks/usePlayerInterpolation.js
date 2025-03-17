// import { useRef, useState, useEffect } from 'react';
// import { useFrame } from '@react-three/fiber';
// import * as THREE from 'three';

// /**
//  * Hook mejorado para interpolación fluida de movimiento
//  */
// export function usePlayerInterpolation(position, rotation, posLerpFactor = 0.15, rotLerpFactor = 0.2) {
//   const nodeRef = useRef();
//   const lastUpdateTime = useRef(Date.now());
//   const targetPos = useRef(new THREE.Vector3());
//   const currentPos = useRef(new THREE.Vector3());
//   const velocity = useRef(new THREE.Vector3());
//   const targetRot = useRef(0);
//   const currentRot = useRef(0);
//   const [initialized, setInitialized] = useState(false);
  
//   // Inicialización - importante hacerlo una sola vez con valores correctos
//   useEffect(() => {
//     if (!initialized && position && position.length === 3) {
//       // Inicializar posiciones
//       currentPos.current.set(position[0], position[1], position[2]);
//       targetPos.current.set(position[0], position[1], position[2]);
      
//       // Inicializar rotación
//       if (typeof rotation === 'number') {
//         currentRot.current = rotation;
//         targetRot.current = rotation;
//       }
      
//       setInitialized(true);
//       console.log(`[INTERP] Player initialized at position:`, position);
//     }
//   }, [position, rotation, initialized]);
  
//   // Actualizar objetivos cuando cambian las props
//   useEffect(() => {
//     if (!initialized) return;
    
//     if (position && position.length === 3) {
//       // Calcular velocidad basada en cuánto se ha movido y el tiempo transcurrido
//       const now = Date.now();
//       const deltaTime = (now - lastUpdateTime.current) / 1000; // En segundos
//       lastUpdateTime.current = now;
      
//       // Actualizar posición objetivo
//       const newTarget = new THREE.Vector3(position[0], position[1], position[2]);
      
//       // Si el movimiento es grande (teleport), saltar directamente
//       if (newTarget.distanceTo(targetPos.current) > 5) {
//         targetPos.current.copy(newTarget);
//         currentPos.current.copy(newTarget);
//         velocity.current.set(0, 0, 0);
//         console.log(`[INTERP] Large movement detected - teleporting`);
//       } else {
//         // Actualizar objetivo normalmente
//         targetPos.current.copy(newTarget);
        
//         // Calcular velocidad para movimiento más natural
//         if (deltaTime > 0 && deltaTime < 1) { // Evitar divisiones por cero y valores atípicos
//           velocity.current.subVectors(newTarget, currentPos.current).multiplyScalar(0.5 / deltaTime);
//           // Limitar la velocidad máxima para evitar movimientos erráticos
//           if (velocity.current.length() > 20) {
//             velocity.current.normalize().multiplyScalar(20);
//           }
//         }
//       }
//     }
    
//     // Actualizar rotación objetivo
//     if (typeof rotation === 'number') {
//       // Normalizar diferencia de rotación para tomar el camino más corto
//       let newTargetRot = rotation;
//       while (newTargetRot > Math.PI) newTargetRot -= Math.PI * 2;
//       while (newTargetRot < -Math.PI) newTargetRot += Math.PI * 2;
//       targetRot.current = newTargetRot;
//     }
//   }, [position, rotation, initialized]);
  
//   // Interpolación suave con predicción de movimiento
//   useFrame((state, delta) => {
//     if (!initialized || !nodeRef.current) return;
    
//     // Factor de suavizado adaptativo - más rápido cuando estamos lejos del objetivo
//     const distance = currentPos.current.distanceTo(targetPos.current);
//     const adaptivePosLerp = Math.min(1, posLerpFactor * (1 + distance * 2));
    
//     // Aplicar velocidad para predecir movimiento
//     const velocityInfluence = Math.min(1, delta * 3); // Limitar influencia de la velocidad
//     const predictedPos = new THREE.Vector3().copy(targetPos.current)
//       .add(velocity.current.clone().multiplyScalar(velocityInfluence));
    
//     // Interpolar hacia la posición predicha
//     currentPos.current.lerp(predictedPos, adaptivePosLerp);
//     nodeRef.current.position.copy(currentPos.current);
    
//     // Interpolar rotación con factor adaptativo
//     const rotDiff = getShortestAngle(targetRot.current, currentRot.current);
//     const adaptiveRotLerp = Math.min(1, rotLerpFactor * (1 + Math.abs(rotDiff) * 2));
//     currentRot.current += rotDiff * adaptiveRotLerp;
//     nodeRef.current.rotation.y = currentRot.current;
//   });
  
//   // Función para calcular el camino más corto entre dos ángulos
//   const getShortestAngle = (target, current) => {
//     let diff = target - current;
//     while (diff > Math.PI) diff -= Math.PI * 2;
//     while (diff < -Math.PI) diff += Math.PI * 2;
//     return diff;
//   };
  
//   return {
//     nodeRef,
//     isReady: initialized,
//     currentPosition: currentPos.current,
//     currentRotation: currentRot.current,
//     velocity: velocity.current
//   };
// }
