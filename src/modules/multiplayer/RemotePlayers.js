// import React from 'react';
// import RemotePlayer from './RemotePlayerIndividual';

// export function RemotePlayers({ players, socket }) {
//   return (
//     <>
//       {Object.entries(players).map(([playerId, player]) => {
//         // No renderizar el jugador local
//         if (!player || !player.id || player.id === socket?.id) return null;
        
//         // Asegurarse de que todos los datos necesarios estén presentes
//         const playerPosition = player.position || [0, 0, 0];
//         const playerRotation = player.rotation || 0;
//         const playerAnimation = player.animation || 'idle';
        
//         return (
//           <RemotePlayer 
//             key={`player-${playerId}-${Date.now()}`}
//             id={playerId}
//             position={playerPosition}
//             rotation={playerRotation}
//             animation={playerAnimation}
//             color={player.color || '#FF0000'}
//           />
//         );
//       })}
//     </>
//   );
// }
