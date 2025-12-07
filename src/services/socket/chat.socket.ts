/* eslint-disable @typescript-eslint/no-require-imports */
const io = require('socket.io-client');

export const createChatSocket = (adminId: string) => {
  console.log('🔌 Creating socket connection for admin:', adminId);

  // Use environment variable or fallback to localhost
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
  console.log('🔌 Socket base URL:', baseUrl);

  // Validate adminId
  if (!adminId || adminId === '550e8400-e29b-41d4-a716-446655440000') {
    console.warn('⚠️ Invalid or default adminId detected:', adminId);
  }

  // Socket.io config:
  // - baseUrl: http://localhost:8080
  // - namespace: /chat
  // - path: /socket/socket.io (custom path where socket.io server is mounted)
  // Result: ws://localhost:8080/socket/socket.io/chat?userId=xxx
  const socket = io(`${baseUrl}/chat`, {
    path: '/socket/socket.io',
    query: { userId: adminId },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    timeout: 20000,
    forceNew: true,
  });

  console.log('🔌 Socket config:', {
    url: `${baseUrl}/chat`,
    path: '/socket/socket.io',
    query: { userId: adminId },
  });

  socket.on('reconnect_attempt', (attemptNumber: number) => {
    console.log(`🔄 Reconnection attempt #${attemptNumber}`);
  });

  socket.on('reconnect_failed', () => {
    console.error('❌ All reconnection attempts failed');
  });

  socket.on('connect', () => {
    console.log('✅ Connected to Socket.IO server');
    console.log('Socket ID:', socket.id);
    console.log('Admin ID:', adminId);
  });

  socket.on('disconnect', (reason: string) => {
    console.log('❌ Disconnected from Socket.IO server. Reason:', reason);
  });

  socket.on('connect_error', (error: Error) => {
    console.error('❌ Socket connection error:', error);
    console.error('Error details:', error.message);
  });

  // ✅ Thêm: Listen server confirmation
  socket.on('connect_success', (data: any) => {
    console.log('✅ Server confirmed connection:', data.message);
  });

  return socket;
};
