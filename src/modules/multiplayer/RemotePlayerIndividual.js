// import React, { useRef, useState, useEffect } from 'react';
// import * as THREE from 'three';
// import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
// import { useFrame } from '@react-three/fiber';
// import { PlayerLabel } from './PlayerLabel';
// import { PLAYER_CONFIG } from '@/modules/multiplayer/config/playerConfig';

// // Cache compartido
// const modelCache = new Map();
// const animationCache = new Map();

// /**
//  * Componente optimizado para jugador remoto con FBX
//  */
// const RemotePlayer = ({ 
//   id, 
//   position, 
//   rotation, 
//   animation = PLAYER_CONFIG.DEFAULT_ANIMATION, 
//   color = PLAYER_CONFIG.VISUAL.DEFAULT_COLOR 
// }) => {
//   // Referencias y estado
//   const groupRef = useRef();
//   const modelRef = useRef();
//   const mixerRef = useRef();
//   const actionsRef = useRef({});
//   const [modelLoaded, setModelLoaded] = useState(false);
//   const [currentAnimation, setCurrentAnimation] = useState(animation);
  
//   // Posición y rotación para interpolación
//   const targetPos = useRef(new THREE.Vector3());
//   const currentPos = useRef(new THREE.Vector3());
//   const targetRot = useRef(0);
//   const currentRot = useRef(0);
  
//   // Debug
//   console.log(`Rendering player ${id} with animation ${animation}`);
  
//   // Inicialización - establece posición y rotación iniciales
//   useEffect(() => {
//     if (position && position.length === 3) {
//       currentPos.current.set(position[0], position[1], position[2]);
//       targetPos.current.set(position[0], position[1], position[2]);
//       if (groupRef.current) {
//         groupRef.current.position.copy(currentPos.current);
//       }
//     }
    
//     if (typeof rotation === 'number') {
//       currentRot.current = rotation;
//       targetRot.current = rotation;
//       if (groupRef.current) {
//         groupRef.current.rotation.y = currentRot.current;
//       }
//     }
//   }, []);
  
//   // Actualizar targets cuando cambian las props
//   useEffect(() => {
//     if (position && position.length === 3) {
//       targetPos.current.set(position[0], position[1], position[2]);
//     }
    
//     if (typeof rotation === 'number') {
//       // Normalizar para el camino más corto
//       let diff = rotation - currentRot.current;
//       while (diff > Math.PI) diff -= Math.PI * 2;
//       while (diff < -Math.PI) diff += Math.PI * 2;
//       targetRot.current = currentRot.current + diff;
//     }
//   }, [position, rotation]);
  
//   // Cargar el modelo FBX
//   useEffect(() => {
//     // Función para cargar el modelo
//     const loadModel = () => {
//       const modelPath = PLAYER_CONFIG.MODEL_PATH;
//       console.log(`Loading model for ${id}: ${modelPath}`);
      
//       // Verificar si ya está en caché
//       if (modelCache.has(modelPath)) {
//         console.log(`Using cached model for ${id}`);
//         setupModel(modelCache.get(modelPath).clone());
//         return;
//       }
      
//       // Crear indicador de carga
//       const tempGeometry = new THREE.SphereGeometry(0.3, 16, 16);
//       const tempMaterial = new THREE.MeshBasicMaterial({ 
//         color, wireframe: true, transparent: true, opacity: 0.7 
//       });
//       const tempMesh = new THREE.Mesh(tempGeometry, tempMaterial);
//       tempMesh.name = "loadingIndicator";
      
//       if (groupRef.current) {
//         groupRef.current.add(tempMesh);
//       }
      
//       // Cargar el modelo
//       const loader = new FBXLoader();
//       loader.load(
//         modelPath,
//         (fbx) => {
//           console.log(`Model loaded successfully for ${id}`);
          
//           // Guardar en caché
//           modelCache.set(modelPath, fbx.clone());
          
//           // Quitar indicador de carga
//           if (groupRef.current) {
//             const indicator = groupRef.current.children.find(c => c.name === "loadingIndicator");
//             if (indicator) groupRef.current.remove(indicator);
//           }
          
//           setupModel(fbx);
//         },
//         (xhr) => {
//           // Progress callback
//           const percentComplete = Math.round((xhr.loaded / xhr.total) * 100);
//           if (percentComplete % 25 === 0) {
//             console.log(`${id} model: ${percentComplete}% loaded`);
//           }
//         },
//         (error) => {
//           console.error(`Error loading model for ${id}:`, error);
//         }
//       );
//     };
    
// // Dentro de la función setupModel, modifica la forma en que se maneja el modelo:

// const setupModel = (fbx) => {
//   if (!groupRef.current) return;
  
//   // PRIMERO: Limpiar cualquier modelo anterior
//   const existingModel = groupRef.current.children.find(
//     child => child.name && child.name.startsWith('avatar_')
//   );
//   if (existingModel) {
//     groupRef.current.remove(existingModel);
//   }
  
//   // IMPORTANTE: Crear un grupo contenedor intermedio para el modelo
//   const modelContainer = new THREE.Group();
//   modelContainer.name = `avatar_container_${id}`;
  
//   // Ajustar modelo
//   fbx.scale.set(1, 1, 1);
//   fbx.position.set(0, 0, 0); // Posición relativa al contenedor
//   fbx.rotation.set(0, 0, 0);
//   fbx.name = `avatar_mesh_${id}`;
//   fbx.visible = true;

//   // Traverse y ajustar materiales
// fbx.traverse((child) => {
//   if (child.isMesh) {
//     child.castShadow = true;
//     child.receiveShadow = true;

//     if (child.material) {
//       // Clonar el material original para conservar texturas
//       const originalMaterial = child.material.clone();
//       originalMaterial.skinning = true; // Asegurar que soporta skinning

//       // Si el modelo tiene un mapa de textura, conservarlo
//       if (child.material.map) {
//         originalMaterial.map = child.material.map;
//       }

//       // Aplicar tinte si se desea, pero sin sobrescribir la textura
//       originalMaterial.color.multiply(new THREE.Color(color));

//       // Asignar el material corregido
//       child.material = originalMaterial;
//       child.material.needsUpdate = true;
//     }
//   }
// });

  
//   // Añadir el modelo al contenedor
//   modelContainer.add(fbx);
  
//   // Añadir el contenedor al grupo principal
//   groupRef.current.add(modelContainer);
  
//   // Guardar referencia al modelo
//   modelRef.current = fbx;
  
//   // CRÍTICO: Asegurarse de que el modelo se posiciona correctamente al inicio
//   if (position && position.length === 3) {
//     groupRef.current.position.set(position[0], position[1], position[2]);
//     currentPos.current.set(position[0], position[1], position[2]);
//     targetPos.current.set(position[0], position[1], position[2]);
//   }
  
//   if (typeof rotation === 'number') {
//     groupRef.current.rotation.y = rotation;
//     currentRot.current = rotation;
//     targetRot.current = rotation;
//   }
  
//   // Crear mixer para animaciones
//   const mixer = new THREE.AnimationMixer(fbx);
//   mixerRef.current = mixer;
  
//   setModelLoaded(true);
  
//   // Cargar animación inicial
//   loadAnimation(animation);
// };

    
//     loadModel();
    
//     return () => {
//       console.log(`Unmounting player ${id}`);
//       if (mixerRef.current) {
//         mixerRef.current.stopAllAction();
//       }
//     };
//   }, [id, color, animation]);
  
//   // Función para cargar y aplicar animaciones
//   const loadAnimation = (animName) => {
//     if (!mixerRef.current || !modelRef.current) return;
    
//     const animPath = PLAYER_CONFIG.ANIMATION_PATHS[animName];
//     if (!animPath) {
//       console.warn(`No animation path found for: ${animName}`);
//       return;
//     }
    
//     console.log(`Loading animation ${animName} for ${id}: ${animPath}`);
    
//     // Verificar si ya tenemos esta acción
//     if (actionsRef.current[animName]) {
//       applyAnimation(animName);
//       return;
//     }
    
//     // Verificar caché
//     if (animationCache.has(animPath)) {
//       const clip = animationCache.get(animPath);
// const action = mixerRef.current.clipAction(clip, modelRef.current.children[0] || modelRef.current);
//       actionsRef.current[animName] = action;
//       applyAnimation(animName);
//       return;
//     }
    
//     // Cargar nueva animación
//     const loader = new FBXLoader();
//     loader.load(
//       animPath,
//       (animFbx) => {
//         if (!mixerRef.current) return;
        
//         const clip = animFbx.animations[0];
//         if (!clip) {
//           console.error(`No animations found in ${animPath}`);
//           return;
//         }
        
//         // Guardar en caché
//         animationCache.set(animPath, clip);
        
//         // Crear acción
// const action = mixerRef.current.clipAction(clip, modelRef.current.children[0] || modelRef.current);
//         actionsRef.current[animName] = action;
        
//         applyAnimation(animName);
//       },
//       undefined,
//       (error) => {
//         console.error(`Error loading animation ${animName}:`, error);
//       }
//     );
//   };
  
//   // Aplicar animación
//   const applyAnimation = (animName) => {
//     if (!actionsRef.current[animName]) return;
    
//     // Detener todas las animaciones actuales
//     mixerRef.current.stopAllAction();
    
//     // Obtener y configurar nueva acción
//     const action = actionsRef.current[animName];
//     action.reset();
//     action.setLoop(THREE.LoopRepeat);
//     action.timeScale = animName === 'running' ? 1.5 : 1.0;
//     action.clampWhenFinished = false;
//     action.fadeIn(0.2).play();
    
//     setCurrentAnimation(animName);
//     console.log(`Playing animation ${animName} for ${id}`);
//   };
  
//   // Detectar cambios de animación
//   useEffect(() => {
//     if (modelLoaded && animation && animation !== currentAnimation) {
//       console.log(`Animation changed for ${id}: ${animation}`);
//       loadAnimation(animation);
//     }
//   }, [animation, modelLoaded, id, currentAnimation]);
  
//   // Frame update - interpolar posición y rotación
// // Reemplaza la función useFrame para garantizar actualizaciones correctas:

// useFrame((state, delta) => {
//   if (!groupRef.current) return;

//   // Interpolación de posición y rotación
//   currentPos.current.lerp(targetPos.current, 0.25);
//   groupRef.current.position.copy(currentPos.current);

//   const rotDiff = targetRot.current - currentRot.current;
//   if (Math.abs(rotDiff) > 0.01) {
//     let normalizedDiff = rotDiff;
//     while (normalizedDiff > Math.PI) normalizedDiff -= Math.PI * 2;
//     while (normalizedDiff < -Math.PI) normalizedDiff += Math.PI * 2;
//     currentRot.current += normalizedDiff * 0.25;
//     groupRef.current.rotation.y = currentRot.current;
//   }

//   groupRef.current.updateMatrixWorld(true);

//   // CRÍTICO: Actualizar el mixer de animaciones
//   if (mixerRef.current) {
//     mixerRef.current.update(delta);
//   }
// });


  
//   return (
//     <group ref={groupRef}>
//       {/* Etiqueta del jugador */}
//       <PlayerLabel 
//         id={id}
//         color={color}
//         height={PLAYER_CONFIG.VISUAL.LABEL_HEIGHT}
//       />
      
//       {/* Indicador de centro (para debug) */}
//       <mesh position={[0, 0.1, 0]} scale={0.1}>
//         <sphereGeometry />
//         <meshBasicMaterial color="yellow" wireframe={true} />
//       </mesh>
//     </group>
//   );
// };

// // Optimizar renderizado
// export default React.memo(RemotePlayer, (prev, next) => {
//   return prev.id === next.id && 
//          prev.animation === next.animation && 
//          prev.color === next.color;
// });
