import * as io from 'socket.io-client';

const SOCKET_URL = `${process.env.NEXT_PUBLIC_GATEWAY_DEPLOY}/socket`;

export const createChatSocket = (userId: string): SocketIOClient.Socket => {
  const socket = io.connect(SOCKET_URL, {
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
