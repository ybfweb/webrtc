import { SignalServe } from "./app/ws/signaling";

const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const { instrument } = require('@socket.io/admin-ui');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  /* options */
  cors: {
    origin: ['https://admin.socket.io', "http://localhost:5173"],
    credentials: true,
  },
});

io.on('connection', (socket: any) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

// 监控
instrument(io, {
  auth: false,
});

// 初始化信令
new SignalServe(io);

httpServer.listen(3000, () => {
  console.log('listening on *:3000');
});
