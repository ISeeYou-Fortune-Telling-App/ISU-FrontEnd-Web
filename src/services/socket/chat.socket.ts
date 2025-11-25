/* eslint-disable @typescript-eslint/no-require-imports */
const io = require('socket.io-client');

export const createChatSocket = (adminId: string) => {
  console.log('🔌 Creating socket connection for admin:', adminId);

  const socket = io('http://localhost:8082/chat', {
    query: { userId: adminId },
    transports: ['websocket', 'polling'],
  });

  socket.on('connect', () => {
    console.log('✅ Connected to Socket.IO v2 server');
    console.log('Socket ID:', socket.id);
    console.log('Admin ID:', adminId);
  });

  socket.on('disconnect', (reason: string) => {
    console.log('❌ Disconnected from Socket.IO server. Reason:', reason);
  });

  socket.on('connect_error', (error: Error) => {
    console.error('❌ Socket connection error:', error);
  });

  return socket;
};
