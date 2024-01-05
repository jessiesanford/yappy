import * as http from 'http';
import { Server} from 'socket.io';

const server = http.createServer();
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000'
  }
});

io.on('connection', (socket) => {
  console.log('A user connected');
  // Handle disconnect if needed
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

server.listen(3001, () => {
  console.log('WebSocket server listening on port 3001');
});

export {}