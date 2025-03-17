import { useEffect, useState, useCallback, useRef } from 'react';
import { io } from 'socket.io-client';

const SERVER_URL = 'http://localhost:3001';

export default function useMultiplayer(avatarRef) {
  const [socket, setSocket] = useState(null);
  const [players, setPlayers] = useState({});
  const [connected, setConnected] = useState(false);
  const updateQueueRef = useRef([]);
  const updateTimeoutRef = useRef(null);
  
  useEffect(() => {
    const newSocket = io(SERVER_URL);
    
    newSocket.on('connect', () => {
      console.log('Conectado al servidor:', newSocket.id);
      setConnected(true);
      
      if (avatarRef?.current) {
        const pos = avatarRef.current.translation();
        newSocket.emit('player:join', {
          position: [pos.x, pos.y, pos.z],
          rotation: 0,
          animation: 'idle'
        });
      } else {
        newSocket.emit('player:join', {
          position: [4, 0.2, 0],
          rotation: 0,
          animation: 'idle'
        });
      }
    });
    
    newSocket.on('disconnect', () => {
      console.log('Desconectado del servidor');
      setConnected(false);
    });
    
    newSocket.on('players', handlePlayersUpdate);
    
    newSocket.on('player:joined', handlePlayerJoined);
    
    newSocket.on('player:updated', handlePlayerUpdated);
    
    newSocket.on('player:left', handlePlayerLeft);
    
    setSocket(newSocket);
    
    return () => {
      newSocket.disconnect();
    };
  }, [avatarRef]);

  const handlePlayersUpdate = useCallback((allPlayers) => {
    setPlayers(allPlayers);
  }, []);
  
  const handlePlayerJoined = useCallback((player) => {
    setPlayers(prev => ({
      ...prev,
      [player.id]: player
    }));
  }, []);
  
  const handlePlayerLeft = useCallback((playerId) => {
    setPlayers(prev => {
      const newPlayers = { ...prev };
      delete newPlayers[playerId];
      return newPlayers;
    });
  }, []);
  
  const handlePlayerUpdated = useCallback((update) => {
    setPlayers(prev => {
      const currentPlayer = prev[update.id];
      if (!currentPlayer) return { ...prev, [update.id]: update };
      
      const positionChanged = !currentPlayer.position || 
        !update.position ||
        Math.abs(currentPlayer.position[0] - update.position[0]) > 0.1 ||
        Math.abs(currentPlayer.position[1] - update.position[1]) > 0.1 ||
        Math.abs(currentPlayer.position[2] - update.position[2]) > 0.1;
      
      const rotationChanged = Math.abs(currentPlayer.rotation - update.rotation) > 0.1;
      
      const animationChanged = currentPlayer.animation !== update.animation;
      
      if (positionChanged || rotationChanged || animationChanged) {
        return { ...prev, [update.id]: update };
      }
      
      return prev;
    });
  }, []);
  
  const updatePlayerPosition = useCallback((position, rotation, animation) => {
    if (!socket || !connected) return;
    
    updateQueueRef.current.push({
      position,
      rotation,
      animation
    });
    
    if (!updateTimeoutRef.current) {
      updateTimeoutRef.current = setTimeout(() => {
        const latestUpdate = updateQueueRef.current[updateQueueRef.current.length - 1];
        
        if (latestUpdate) {
          socket.emit('player:update', latestUpdate);
        }
        
        updateQueueRef.current = [];
        updateTimeoutRef.current = null;
      }, 50); 
    }
  }, [socket, connected]);
  
  return {
    socket,
    players,
    connected,
    updatePlayerPosition
  };
}
