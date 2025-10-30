import { io, Socket } from 'socket.io-client';

const SOCKET_URL = `${process.env.NEXT_PUBLIC_SOCKET_URL}/chat`;

export const createChatSocket = (userId: string): Socket => {
  const socket = io(SOCKET_URL, {
    query: { userId }, // truyền userId của admin
    transports: ['websocket'],
    reconnection: true,
    reconnectionAttempts: 5,
  });

  socket.on('connect', () => {
    console.log('Socket connected:', socket.id);
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected');
  });

  return socket;
};
