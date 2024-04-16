const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const { instrument } = require('@socket.io/admin-ui');

const app = express();
app.get('/2', (req: any, res: any) => {
  res.send('222222');
});
const httpServer = createServer(app);
const io = new Server(httpServer, {
  /* options */
  cors: {
    origin: ['https://admin.socket.io'],
    credentials: true,
  },
});

io.on('connection', (socket: any) => {
  // ...
  console.log(socket);
});

instrument(io, {
  auth: false,
});

httpServer.listen(3000, () => {
  console.log('listening on *:3000');
});
