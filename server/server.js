const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const players = {};

io.on('connection', (socket) => {
  socket.on('player:join', (playerData) => {
    players[socket.id] = {
      id: socket.id,
      position: playerData.position,
      rotation: playerData.rotation,
      animation: playerData.animation || 'idle',
      color: playerData.color || '#' + Math.floor(Math.random()*16777215).toString(16)
    };
    
    socket.broadcast.emit('player:joined', players[socket.id]);
    
    socket.emit('players', players);
  });

  
  const playerLastUpdate = {};

  socket.on('player:update', (data) => {
    const now = Date.now();
    const lastUpdate = playerLastUpdate[socket.id] || 0;
    
    if (now - lastUpdate > 100) {
      playerLastUpdate[socket.id] = now;
      
      if (players[socket.id]) {
        players[socket.id] = {
          ...players[socket.id],
          ...data
        };
        
        Object.entries(players).forEach(([playerId, playerData]) => {
          if (playerId !== socket.id) {
            const distance = calculateDistance(data.position, playerData.position);
            if (distance < 20) {
              io.to(playerId).emit('player:updated', {
                id: socket.id,
                ...data
              });
            }
          }
        });
      }
    }
  });

function calculateDistance(pos1, pos2) {
  if (!pos1 || !pos2) return Infinity;
  return Math.sqrt(
    Math.pow(pos1[0] - pos2[0], 2) +
    Math.pow(pos1[1] - pos2[1], 2) +
    Math.pow(pos1[2] - pos2[2], 2)
  );
}  
  socket.on('disconnect', () => {
    console.log(`Jugador desconectado: ${socket.id}`);
    
    delete players[socket.id];
    
    io.emit('player:left', socket.id);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
