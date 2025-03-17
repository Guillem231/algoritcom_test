// import React from 'react';
// import { Text } from '@react-three/drei';

// /**
//  * Componente para mostrar la etiqueta de identificación sobre un jugador
//  */
// export function PlayerLabel({ id, color = '#FF0000', height = 2.5 }) {
//   return (
//     <>
//       {/* Indicador del jugador (esfera) */}
//       <mesh position={[0, height - 0.3, 0]}>
//         <sphereGeometry args={[0.2, 16, 16]} />
//         <meshBasicMaterial color={color} />
//       </mesh>
      
//       {/* Etiqueta con el ID */}
//       <Text
//         position={[0, height, 0]}
//         fontSize={0.2}
//         color="white"
//         anchorX="center"
//         anchorY="middle"
//       >
//         {typeof id === 'string' ? id.substring(0, 4) : id}
//       </Text>
//     </>
//   );
// }
