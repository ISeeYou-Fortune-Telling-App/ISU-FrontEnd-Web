/* eslint-disable @typescript-eslint/no-require-imports */
const io = require('socket.io-client');

export const createChatSocket = (adminId: string) => {
  const socket = io('http://localhost:8082/chat', {
    query: { userId: adminId },
    transports: ['websocket', 'polling'],
  });

  socket.on('connect', () => {
    console.log('✅ Connected to Socket.IO v2 server');
  });

  socket.on('disconnect', () => {
    console.log('❌ Disconnected from Socket.IO server');
  });

  return socket;
};
